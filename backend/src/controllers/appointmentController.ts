import { Request, Response } from "express";
import { z } from "zod";
import Appointment from "../models/Appointment";

const newAppointmentSchema = z.object({
    tutor_id: z.number(),
    start: z.string(),
    end: z.string(),
    zoom_link: z.string(),
});

const handleNewAppointment = async (req: Request, res: Response) => {
    try {
      const { tutor_id, start, end, zoom_link } = newAppointmentSchema.parse(req.body);
  

      const duplicate = await Appointment.findAppoitnmentByTutor(tutor_id,new Date(start))
      if (duplicate[0] != undefined) return res.sendStatus(409);
      await Appointment.createAppointment({
        tutor_id: tutor_id,
        student_id:undefined,
        selected_subject:undefined,
        start_time: new Date(start),
        end_time: new Date(end),
        zoom_link: zoom_link
      });
  
      res.status(201).json({ success: `New appointment by tutor id ${tutor_id} created!` });
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
  try{
    const tutor_id = req.query.tutor_id
    const tid = tutor_id?.toString()
    const appointments = await Appointment.findOpenAppointmentsByTutor(tid)

    if(!appointments) {
      res.json(null)
    } else {
      res.json(appointments)
    }
  } catch(err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

export { handleNewAppointment, handleFindAvailableAppointments };
  