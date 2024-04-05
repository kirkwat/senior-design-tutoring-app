import { Tutor } from "src/types/tutor";
import axios from "./axios";
import { AxiosInstance } from "axios";

interface OldTutor {
  id: number;
  user_id: number;
  bio: string;
  name: string;
  email: string;
  password: string;
  profile_picture: number;
  refreshToken: null;
  role: string;
  subjects: string[];
}

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

// export const getTutors = (axiosPrivate: AxiosInstance): Promise<Tutor[]> =>
//   new Promise((resolve, reject) => {
//     axiosPrivate
//       .get("/tutor")
//       .then((response) => resolve(response.data))
//       .catch((error) => {
//         console.error("Error fetching tutors:", error);
//     });
// });

export const getTutors = (): Promise<OldTutor[]> =>
  new Promise((resolve, reject) => {
    axios
      .get("/tutor")
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

// export const getTutorByID = (
//     axiosPrivate: AxiosInstance,
//     tutor_id: string,
//   ): Promise<Tutor> =>
//     new Promise((resolve, reject) => {
//       axiosPrivate
//         .get(`/tutor/${tutor_id}`)
//         .then((response) => resolve(response.data))
//         .catch((error) => {
//           console.error("Error fetching tutors:", error);
//         });
//     });

export const getTutorByID = (tutor_id: number): Promise<OldTutor> =>
  new Promise((resolve, reject) => {
    axios
      .get(`/tutor/${tutor_id}`)
      .then((response) => resolve(response.data[0]))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

// export const findAvailableTutorsByTime = (
//     axiosPrivate: AxiosInstance,
//     time: number,
//   ): Promise<Tutor[]> =>
//     new Promise((resolve, reject) => {
//       axiosPrivate
//         .get(`/tutor/available?time=${time}`)
//         .then((response) => resolve(response.data))
//         .catch((error) => {
//           console.error("Error fetching tutors:", error);
//     });
// });

export const findAvailableTutorsByTime = (time: number): Promise<OldTutor[]> =>
  new Promise((resolve, reject) => {
    axios
      .get(`/available-tutors?time=${time}`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

// export const findAvailableTutorsByDay = (
//     axiosPrivate: AxiosInstance,
//     day: number,
//   ): Promise<Tutor[]> =>
//     new Promise((resolve, reject) => {
//       axiosPrivate
//         .get(`/tutor/available/day?day=${day}`)
//         .then((response) => resolve(response.data))
//         .catch((error) => {
//           console.error("Error fetching tutors:", error);
//         });
//     });

export const findAvailableTutorsByDay = (day: number): Promise<OldTutor[]> =>
  new Promise((resolve, reject) => {
    axios
      .get(`/available-tutors/day?day=${day}`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

// export const findAvailableTutorsByWeek = (
//     axiosPrivate: AxiosInstance,
//     week: number,
//   ): Promise<Tutor[]> =>
//     new Promise((resolve, reject) => {
//       axiosPrivate
//         .get(`/tutor/available/week?week=${week}`)
//         .then((response) => resolve(response.data))
//         .catch((error) => {
//           console.error("Error fetching tutors:", error);
//         });
//     });

export const findAvailableTutorsByWeek = (week: number): Promise<OldTutor[]> =>
  new Promise((resolve, reject) => {
    axios
      .get(`/available-tutors/week?week=${week}`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });

export const updateTutorProfile = (
  tutor_id: number,
  profile_picture: number,
  bio: string,
  subjects: string[],
) =>
  new Promise((resolve, reject) => {
    axios
      .put(`/tutor/profile/${tutor_id}`, {
        profile_picture: profile_picture,
        bio: bio,
        subjects: subjects,
      })
      .then((x) => resolve(x.data))
      .catch((error) => {
        console.error("Error updating tutor profile:", error);
        reject(error);
      });
  });

export const getTutorSubjects = (tutorID: number): Promise<OldTutor[]> =>
  new Promise((resolve, reject) => {
    axios
      .get(`/tutor/${tutorID}/subjects`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        reject(error);
      });
  });
