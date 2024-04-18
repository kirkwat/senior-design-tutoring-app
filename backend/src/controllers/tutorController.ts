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
