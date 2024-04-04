import { Request, Response } from "express";
import { z } from "zod";
import Appointment from "../models/Appointment";
import { start } from "repl";

const newAppointmentSchema = z.object({
  start: z.string(),
  end: z.string(),
  zoom_link: z.string(),
});

const handleNewAppointment = async (req: Request, res: Response) => {
  try {
    const tutorID = Number(req.params.tutorID);
    const { start, end, zoom_link } = newAppointmentSchema.parse(req.body);

    const duplicate = await Appointment.findAppoitnmentByTutor(
      tutorID,
      new Date(start),
    );
    if (duplicate[0] != undefined) return res.sendStatus(409);
    await Appointment.createAppointment({
      tutor_id: tutorID,
      student_id: undefined,
      selected_subject: undefined,
      start_time: new Date(start),
      end_time: new Date(end),
      zoom_link: zoom_link,
    });

    res
      .status(201)
      .json({ success: `New appointment by tutor id ${tutorID} created!` });
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

const handleFindAvailableAppointments = async (req: Request, res: Response) => {
  try {
    const tutor_id = req.query.tutor_id;
    const tid = tutor_id?.toString();
    const appointments = await Appointment.findOpenAppointmentsByTutor(tid);
    for (let i = 0; i < appointments.length; i++) {
      appointments[i].start_time = new Date(appointments[i].start_time);
      appointments[i].end_time = new Date(appointments[i].end_time);
    }

    if (!appointments) {
      res.json(null);
    } else {
      res.json(appointments);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

const handleIsAvailable = async (req: Request, res: Response) => {
  try {
    const tutor_id = req.query.tutor_id;
    const tid = tutor_id?.toString();
    let time_req = String(req.query.day);
    time_req = time_req.concat("T00:00:00");
    let time = new Date(time_req).getTime();

    const appointment = await Appointment.isAvailable(time, tid);
    if (!appointment[0]) {
      res.json(false);
    } else if (appointment[0]) {
      res.json(true);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

const handleFindStudentsAppointments = async (req: Request, res: Response) => {
  try {
    const student_id = req.params.studentID;
    const sid = student_id?.toString();
    const appointments = await Appointment.findStudentsAppointments(sid);
    for (let i = 0; i < appointments.length; i++) {
      appointments[i].start_time = new Date(appointments[i].start_time);
      appointments[i].end_time = new Date(appointments[i].end_time);
    }

    if (!appointments) {
      res.json(null);
    } else {
      res.json(appointments);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

const handRegisterForAppointment = async (req: Request, res: Response) => {
  try {
    const { student_id, selected_subject } = req.body;
    const appointment_id = req.params.appointmentID;
    const appid = appointment_id?.toString();
    await Appointment.signUpForAppointment(student_id, selected_subject, appid);

    res.status(201).json({
      success: `Student id ${student_id} registered for appointment id ${appid}!`,
    });
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

export {
  handleNewAppointment,
  handleFindAvailableAppointments,
  handleIsAvailable,
  handleFindStudentsAppointments,
  handRegisterForAppointment,
};
