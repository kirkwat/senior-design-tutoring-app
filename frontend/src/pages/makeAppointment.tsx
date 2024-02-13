// import { Calendar } from "src/components/ui/calendar"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "src/components/ui/button";
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader,TableRow} from "src/components/ui/table"

//Shows all available times for selected tutor
const MakeAppointment = () => {
    const {tutorID} = useParams()
    type ValuePiece = Date | null;

   type Value = ValuePiece | [ValuePiece, ValuePiece];
    const [date, setDate] = useState<Value>(new Date());
    const [tutor, setTutor] = useState([]);

   //  useEffect(() => {
   //    getTutorByID().then((data) => setTutor(data)).catch((error) => console.error("Error fetching tutor data:", error));
   //  }, []);

   return (
      <div className="flex">
         <div className="mt-4 ml-5">
             {/* <h1>Availabilities for {tutor.name}</h1> */}
            <h1 className="font-bold text-xl">Availabilities for John Doe</h1>
            <Calendar onChange={setDate} value={date} calendarType="gregory" />
      
            <Button className="mt-3">Submit</Button>
         </div>
         <div className="ml-4">
         <Table>
         <TableHeader>
            <TableRow>
               <TableHead>Time</TableHead>
               <TableHead>Status</TableHead>
            </TableRow>
            <TableRow>
               <TableCell>11:00 am - 12:00 pm</TableCell>
               <TableCell>Available</TableCell>
               <TableCell><Button asChild><Link to={`/`}>Schedule Appointment</Link></Button></TableCell>
            </TableRow>
            </TableHeader>
         </Table>
         </div>
      </div>
    );
  };

  export default MakeAppointment;