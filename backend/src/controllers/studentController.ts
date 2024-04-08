import { Request, Response } from "express";
import Student from "../models/Student";

const handleFindStudentByID = async (req: Request, res: Response) => {
  try {
    const sid = req.params.studentID;
    var id = -1;
    if (sid) {
      id = Number(sid);
    }
    const student = await Student.findStudentByID(id);

    if (!student) {
      res.json(null);
    } else {
      res.json(student);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

const handleUpdateStudentProfile = async (req: Request, res: Response) => {
  try {
    const sid = req.params.studentID;
    var id = -1;
    if (sid) {
      id = Number(sid);
    }
    const { profile_picture } = req.body;
    await Student.updateStudentProfile(id, profile_picture);

    res.status(201).json({
      success: `Student id ${sid} successfully updated profile`,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export { handleFindStudentByID, handleUpdateStudentProfile };
