import { Request, Response } from "express";
import Subject from "../models/Subject";

const handleFindTutorsSubjects = async (req: Request, res: Response) => {
  try {
    const tid = req.params.tutorID;
    var tutorID = -1;
    if (tid) {
      tutorID = Number(tid);
    }
    const subjects = await Subject.findAllSubjectsForTutor(tutorID);

    if (!subjects) {
      res.json(null);
    } else {
      res.json(subjects);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export { handleFindTutorsSubjects };
