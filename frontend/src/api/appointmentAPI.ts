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
  start: string,
  end: string,
  zoom: string,
) =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .post(`/appointment`, {
        tutor_id: tutorID,
        start: start,
        end: end,
        zoom_link: zoom,
      })
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

export const findAppointmentByTutor = (
  axiosPrivate: AxiosInstance,
  tutorID: string,
): Promise<Appointment[]> =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .get(`/appointment?tutor_id=${tutorID}`)
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });
