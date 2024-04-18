import {
  TutorAppointment,
  StudentAppointment,
  Appointment,
} from "src/types/appointment";
import { AxiosInstance } from "axios";

export const createAppointment = (
  axiosPrivate: AxiosInstance,
  tutorID: number,
  startDate: string,
  appointmentLength: number,
  weekSpan: number,
) =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .post(`/appointment/${tutorID}`, {
        startDate,
        appointmentLength,
        weekSpan,
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
): Promise<TutorAppointment[]> =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .get(`/appointment/tutor/${tutorID}`)
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching tutor appointments:", error);
        reject(error);
      });
  });

export const cancelAppointment = (
  axiosPrivate: AxiosInstance,
  appointmentID: number,
) =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .put(`/appointment/cancel/${appointmentID}`)
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

export const getStudentAppointments = (
  axiosPrivate: AxiosInstance,
  studentID: number,
): Promise<StudentAppointment[]> =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .get(`/appointment/student/${studentID}`)
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching student appointments:", error);
        reject(error);
      });
  });

export const findAvailableAppointments = (
  axiosPrivate: AxiosInstance,
  tutorID: number,
): Promise<Appointment[]> =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .get(`/appointment/available/${tutorID}`)
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        reject(error);
      });
  });

export const scheduleAppointment = (
  axiosPrivate: AxiosInstance,
  appointmentID: number,
  selectedSubject: string,
  studentID: number,
) =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .put(`/appointment/schedule/${appointmentID}`, {
        selectedSubject,
        studentID,
      })
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });
