import axios from "./axios";
import { AxiosInstance } from "axios";

interface Appointment {
  id: number;
  tutor_id: number;
  student_id: null;
  selected_subject: null;
  start_time: number;
  end_time: number;
  zoom_link: string;
}

export const createAppointment = (
  axiosPrivate: AxiosInstance,
  tutorID: number,
  startDate: string,
  appointmentLength: number,
  weekSpan: number,
  zoomLink: string,
) =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .post(`/appointment/${tutorID}`, {
        startDate,
        appointmentLength,
        weekSpan,
        zoomLink,
      })
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

export const getTutorAppointments = (
  axiosPrivate: AxiosInstance,
  tutorID: number,
) =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .get(`/appointment/tutor/${tutorID}`)
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

export const findAppointmentByTutor = (
  tutorID: string,
): Promise<Appointment[]> =>
  new Promise((resolve, reject) => {
    axios
      .get(`/appointment?tutor_id=${tutorID}`)
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

export const checkAvailableAppointments = (
  day: string,
  tutorID: string,
): Promise<Boolean> =>
  new Promise((resolve, reject) => {
    axios
      .get(`/appointment/available?day=${day}&tutor_id=${tutorID}`)
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });
