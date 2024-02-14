import axios from "./axios";


export const createAppointment = (tutorID:number, start:string, end:string, zoom:string) => new Promise((resolve, reject) => {
    axios.post(`/appointment`, {"tutor_id": tutorID, "start": start, "end": end, "zoom_link": zoom})
        .then(x => resolve(x.data))
        .catch(error => {
            console.error('Error fetching tutors:', error);
            reject(error);
    });
});












