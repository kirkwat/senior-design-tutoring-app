import { Tutor } from "src/types/tutor";
import { AxiosInstance } from "axios";

export const getTutorAndSubjects = (
  axiosPrivate: AxiosInstance,
  tutor_id: number,
): Promise<Tutor> =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .get(`/tutor/${tutor_id}`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

export const editTutorProfile = (
  axiosPrivate: AxiosInstance,
  tutor_id: number,
  bio: string,
  name: string,
  subjects: string[],
): Promise<Tutor> =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .put(`/tutor/edit/${tutor_id}`, {
        bio,
        name,
        subjects,
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

export const uploadTutorPicture = (
  axiosPrivate: AxiosInstance,
  tutor_id: number,
  profile_picture: File,
) =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("profile_picture", profile_picture);

    axiosPrivate
      .put(`/tutor/avatar/${tutor_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error updating tutor's picture:", error);
        reject(error);
      });
  });

export const getAllTutorsWithSubjects = (
  axiosPrivate: AxiosInstance,
): Promise<Tutor[]> =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .get("/tutor")
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

export const getZoomConnection = (
  axiosPrivate: AxiosInstance,
  tutor_id: number,
): Promise<{ zoomConnected: boolean }> =>
  new Promise((resolve, reject) => {
    axiosPrivate
      .get(`/zoom/connection/${tutor_id}`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });
