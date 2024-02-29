import { Request, Response } from "express";
import { z } from "zod";
import Tutor from "../models/Tutor";

const newTutorSchema = z.object({
  user_id: z.number(),
  bio: z.string(),
});

const handleFindAllTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await Tutor.findAllTutors();

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

const handleFindTutorByID = async (req: Request, res: Response) => {
  try {
    const tid = req.params.tutor_id;
    const tutor = await Tutor.findTutorByID(tid);

    if (!tutor) {
      res.json(null);
    } else {
      res.json(tutor);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

const handleFindAvailableTutorsByTime = async (req: Request, res: Response) => {
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

const handleFindAvailableTutorsByDay = async (req: Request, res: Response) => {
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

const handleFindAvailableTutorsByWeek = async (req: Request, res: Response) => {
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

export {
  handleFindAllTutors,
  handleFindTutorByID,
  handleFindAvailableTutorsByTime,
  handleFindAvailableTutorsByDay,
  handleFindAvailableTutorsByWeek,
};
