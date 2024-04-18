import { Request, Response } from "express";
import { z } from "zod";
import Appointment from "../models/Appointment";
import Zoom from "../models/Zoom";
import axios from "axios";

const newAppointmentSchema = z.object({
  startDate: z.string().datetime(),
  appointmentLength: z.number(),
  weekSpan: z.number(),
  zoomLink: z.string(),
});

export const handleNewAppointment = async (req: Request, res: Response) => {
  try {
    const tutorID = Number(req.params.tutorID);
    const { startDate, appointmentLength, weekSpan, zoomLink } =
      newAppointmentSchema.parse(req.body);

    let createdCount = 0;
    let failedCount = 0;

    for (let week = 0; week < weekSpan; week++) {
      const startDateTime = new Date(startDate);
      startDateTime.setDate(startDateTime.getDate() + 7 * week);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(startDateTime.getMinutes() + appointmentLength);

      const duplicates = await Appointment.findOverlappingAppointments(
        tutorID,
        startDateTime,
        endDateTime,
      );

      if (duplicates.length === 0) {
        await Appointment.createAppointment({
          tutor_id: tutorID,
          start_time: startDateTime,
          end_time: endDateTime,
          zoom_link: zoomLink,
          status: "available",
        });
        createdCount++;
      } else {
        failedCount++;
      }
    }

    if (createdCount === 0) {
      throw new Error("Failed to create appointments due to time conflicts.");
    }

    res.status(201).json({ created: createdCount, failed: failedCount });
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

export const handleGetTutorAppointments = async (
  req: Request,
  res: Response,
) => {
  try {
    const tutorID = Number(req.params.tutorID);
    const appointments = await Appointment.findTutorAppointments(tutorID);

    res.json(appointments);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const handleGetStudentAppointments = async (
  req: Request,
  res: Response,
) => {
  try {
    const studentID = Number(req.params.studentID);
    const appointments = await Appointment.findStudentAppointments(studentID);

    res.json(appointments);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const handleCancelAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentID = Number(req.params.appointmentID);
    await Appointment.cancelAppointment(appointmentID);

    res.json({ success: `Appointment ${appointmentID} has been cancelled.` });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const handleGetAvailableTutorAppointments = async (
  req: Request,
  res: Response,
) => {
  try {
    const tutorID = Number(req.params.tutorID);
    const appointments =
      await Appointment.findAvailableTutorAppointments(tutorID);

    res.json(appointments);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

const scheduleAppointmentSchema = z.object({
  selectedSubject: z.string(),
  studentID: z.number(),
});

export const handleScheduleAppointment = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointmentID = Number(req.params.appointmentID);
    const { selectedSubject, studentID } = scheduleAppointmentSchema.parse(
      req.body,
    );

    const existingUser = await Zoom.findZoomUserByAppointmentId(appointmentID);
    const appointment = await Appointment.findAppointmentById(appointmentID);

    if (Object.keys(existingUser).length === 0 || !appointment) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const { zoom_user_id, access_token, refresh_token, last_updated } =
      existingUser;
    let bearerToken = "";
    let user = existingUser;

    // Refresh access_token if it's 55+ minutes old (tokens are valid for 1 hour)
    if ((Date.now() - last_updated) / (1000 * 60) > 55) {
      const updateRequest = await Zoom.updateZoomUserToken({
        zoom_user_id,
        refresh_token,
      });

      if (updateRequest?.message === "Zoom token refresh successful") {
        const updatedCurrentUser = await Zoom.getCurrentZoomUser(zoom_user_id);
        user = updatedCurrentUser;
        bearerToken = `Bearer ${updatedCurrentUser?.access_token}`;
      } else {
        res.status(500).json({ message: "Error refreshing Zoom token" });
        return;
      }
    } else {
      bearerToken = `Bearer ${access_token}`;
    }

    const body = {
      topic: `Tutoring Session for ${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}`,
      type: 2,
      start_time: new Date(appointment.start_time).toISOString(),
      duration:
        (Number(appointment.end_time) - Number(appointment.start_time)) /
        (1000 * 60),
      timezone: "America/New_York",
      settings: {
        host_video: true,
        participant_video: true,
      },
    };

    const zoomMeeting = await axios.post(
      `https://api.zoom.us/v2/users/${existingUser.zoom_user_id}/meetings`,
      body,
      {
        headers: {
          Authorization: bearerToken,
        },
      },
    );

    await Appointment.scheduleAppointment(
      appointmentID,
      studentID,
      selectedSubject,
      zoomMeeting.data?.join_url,
    );

    res.status(201).json({
      success: `Appointment ${appointmentID} has been scheduled for student ${studentID}.`,
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
