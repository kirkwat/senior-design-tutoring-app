import { Request, Response } from "express";
import Tutor from "../models/Tutor";
import Subject from "../models/Subject";
import { z } from "zod";

export const handleFindTutorByID = async (req: Request, res: Response) => {
  try {
    const tutor_id = parseInt(req.params.tutorID);
    const tutors = await Tutor.getTutorAndTheirSubjects(tutor_id);

    if (tutors.length === 0) {
      res.status(404).json({ message: "Tutor not found" });
    } else {
      res.json(tutors[0]);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

const editTutorSchema = z.object({
  bio: z.string().optional(),
  name: z.string(),
  subjects: z.array(z.string()).optional(),
});

export const handleEditTutorProfile = async (req: Request, res: Response) => {
  try {
    const tutor_id = Number(req.params.tutorID);
    const { bio, name, subjects } = editTutorSchema.parse(req.body);

    await Tutor.updateTutorProfile(tutor_id, bio || "", name);

    if (subjects) {
      await Subject.updateTutorSubjects(tutor_id, subjects);
    }

    res
      .status(201)
      .json({ success: `Tutor id ${tutor_id} successfully updated profile` });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors });
    } else if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const handleUpdateProfilePicture = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const tutor_id = Number(req.params.tutorID);
    const filePath = `/uploads/images/${req.file.filename}`;

    await Tutor.updateTutorProfilePicture(tutor_id, filePath);

    res.status(201).json({
      success: `Tutor id ${tutor_id} successfully updated profile picture`,
      filePath: filePath,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const handleGetAllTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await Tutor.getAllTutorsWithSubjects();

    if (tutors.length === 0) {
      res.status(404).json({ message: "No tutors found." });
    } else {
      res.json(tutors);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

export const handleFindAvailableTutorsByTime = async (
  req: Request,
  res: Response,
) => {
  try {
    const time_req = req.query.time;
    var time = 0;
    if (time_req) {
      time = new Date(time_req.toString()).getTime();
    }
    const tutors = await Tutor.findAvailableTutorsByTime(time);

    if (!tutors) {
      res.json(null);
    } else {
      res.json(tutors);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const handleFindAvailableTutorsByDay = async (
  req: Request,
  res: Response,
) => {
  try {
    const time_req = req.query.day;
    var time = 0;
    if (time_req) {
      time = new Date(time_req.toString()).setUTCHours(0, 0, 0, 0);
    }
    const tutors = await Tutor.findAvailableTutorsByDay(time);

    if (!tutors) {
      res.json(null);
    } else {
      res.json(tutors);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const handleFindAvailableTutorsByWeek = async (
  req: Request,
  res: Response,
) => {
  try {
    const time_req = req.query.week;
    var time = 0;
    if (time_req) {
      const date = new Date(time_req.toString());
      date.setDate(date.getDate() - date.getDay()); // setting the date to the most recent Sunday
      time = date.getTime();
    }
    const tutors = await Tutor.findAvailableTutorsByWeek(time);

    if (!tutors) {
      res.json(null);
    } else {
      res.json(tutors);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const handleUpdateTutorProfile = async (req: Request, res: Response) => {
  try {
    const tid = req.params.tutorID;
    var tutorID = -1;
    if (tid) {
      tutorID = Number(tid);
    }
    const { profile_picture, bio, subjects } = req.body;
    if (profile_picture) {
      await Tutor.updateTutorProfilePicture(tutorID, profile_picture);
    }
    if (bio) {
      await Tutor.updateTutorBio(tutorID, bio);
    }
    if (subjects) {
      const currentSubjects = await Subject.findAllSubjectsForTutor(tutorID);
      var subjectsToAdd = [];
      var subjectsToRemove = [];
      // Find the subjects to add
      for (const [key1, newSubject] of Object.entries(subjects)) {
        var found = false;
        for (const [key2, currSubject] of Object.entries(currentSubjects)) {
          if (String(newSubject) == String(currSubject.name)) {
            found = true;
            break;
          }
        }
        if (!found) subjectsToAdd.push(String(newSubject));
      }
      // Find the subjects to delete
      for (const [key1, currSubject] of Object.entries(currentSubjects)) {
        var found = false;
        for (const [key2, newSubject] of Object.entries(subjects)) {
          if (String(newSubject) == String(currSubject.name)) {
            found = true;
            break;
          }
        }
        if (!found) subjectsToRemove.push(String(currSubject.name));
      }
      for (const [key, subject] of Object.entries(subjectsToAdd)) {
        const subjectID = await Subject.findSubject(subject);
        if (subjectID[0] != undefined) {
          await Subject.assignTutorToSubject(tutorID, subject);
        } else {
          await Subject.addNewSubject(subject);
          await Subject.assignTutorToSubject(tutorID, subject);
        }
      }
      for (const [key, subject] of Object.entries(subjectsToRemove)) {
        await Subject.removeSubjectFromTutor(tutorID, subject);
      }
    }

    res.status(201).json({
      success: `Tutor id ${tid} successfully updated profile`,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
