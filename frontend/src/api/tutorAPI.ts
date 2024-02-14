import axios from "./axios";

interface Tutor {
    id: number;
    user_id: number;
    bio: string;
  }

export const getTutors = (): Promise<Tutor[]> => new Promise((resolve, reject) => {
    axios.get("/tutors")
      .then(response => resolve(response.data))
      .catch(error => {
        console.error('Error fetching tutors:', error);
        reject(error);
      });
  });


export const getTutorByID = (): Promise<Tutor> => new Promise((resolve, reject) => {
axios.get("/tutors")
    .then(response => resolve(response.data))
    .catch(error => {
    console.error('Error fetching tutors:', error);
    reject(error);
    });
});


