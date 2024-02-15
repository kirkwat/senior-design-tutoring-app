// import { Calendar } from "src/components/ui/calendar"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "src/components/ui/button";
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { getTutors, getTutorByID } from "src/api/tutorAPI";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader,TableRow} from "src/components/ui/table"
import { createAppointment, findAppointmentByTutor } from "src/api/appointmentAPI"

interface Tutor {
   id: number;
   user_id: number;
   bio: string;
   name: string;
   email: string;
   password: string;
   profile_picture: string;
   refreshToken: null;
   role: string;
 }

 interface Appointment {
   id: number,
   tutor_id: number,
   student_id: null,
   selected_subject: null,
   start_time: number,
   end_time: number,
   zoom_link: string
}


//Shows all available times for selected tutor
const MakeAppointment = () => {
    const {tutorID} = useParams()
    type ValuePiece = Date | null;

   type Value = ValuePiece | [ValuePiece, ValuePiece];
   const [date, setDate] = useState<Value>(new Date());
   const [tutor, setTutor] = useState<Tutor | null>(null);
   const [appointments, setAppointments] = useState<Appointment[] | null>()

    useEffect(() => {
      getTutorByID().then((data) => setTutor(data)).catch((error) => console.error("Error fetching tutor data:", error));
      if (tutorID) {
         findAppointmentByTutor(tutorID).then((data) => setAppointments(data)).catch((error) => console.error("Error fetching tutor data:", error));
      }
    }, []);

    const handleSubmit = () => {
      // TODO: Add functionality for adding student to an appointment
    };

   return (
      <div className="flex">
         <div className="mt-4 ml-5">
             {/* <h1>Availabilities for {tutor.name}</h1> */}
            <h1 className="font-bold text-xl">Availabilities for John Doe</h1>
            <Calendar onChange={setDate} value={date} calendarType="gregory" />
         </div>
         <div className="ml-4">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
               </TableRow>
            </TableHeader>
            {appointments ? (
            <TableBody>
               {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                  <TableCell>{`${appointment.start_time}-${appointment.end_time}`}</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell><Button onClick={handleSubmit}>Schedule Appointment</Button></TableCell>
                  </TableRow>
               ))}
            </TableBody>
            ) : (
            <div>Loading...</div>
            )}
         </Table>
         </div>
      </div>
    );
  };

  export default MakeAppointment;