import { useState, useEffect } from "react";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader,TableRow} from "src/components/ui/table"
import { getTutors } from "src/api/appointmentAPI";
import { Button } from "src/components/ui/button";
import { redirect } from "react-router-dom";
import { Link } from 'react-router-dom';

// List of all the tutors
const TutorAvailabilities = () => {
   const [tutors, setTutors] = useState([]);
   // useEffect(() => {
   //    getTutors().then((data) => setTutors(data)).catch((error) => console.error("Error fetching tutor data:", error));
   //  }, []);

    return (
      <Table>
         <TableHeader>
         <TableRow>
            <TableHead className="w-[150px]">Tutor Name</TableHead>
            <TableHead>Specialties</TableHead>
         </TableRow>
         </TableHeader>
         {/* ------Delete after routes are done------- */}
         <TableBody>
         <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>Algebra, Geometry, Calculus</TableCell>
            <TableCell><Button asChild><Link to={`../makeAppointment/1`}>View Availabilities</Link></Button></TableCell>
         </TableRow>

         <TableRow>
            <TableCell>Jane Doe</TableCell>
            <TableCell>History</TableCell>
            <TableCell><Button asChild><Link to={`../makeAppointment/2`}>View Availabilities</Link></Button></TableCell>
         </TableRow>

         <TableRow>
            <TableCell>Kevin Doe</TableCell>
            <TableCell>Literature, Phycology</TableCell>
            <TableCell><Button asChild><Link to={`../makeAppointment/3`}>View Availabilities</Link></Button></TableCell>
         </TableRow>
         </TableBody>
         {/* -------------------------- */}
         {/* <TableBody>
         {tutors.map((tutor) => (
          <TableRow key={tutor.id}>
            <TableCell>{tutor.name}</TableCell>
            <TableCell>{tutor.skills}</TableCell>
            <TableCell><Button asChild><Link to={`../makeAppointment/${tutor.id}`}>View Availabilities</Link></Button></TableCell>
          </TableRow>
        ))}
         </TableBody> */}
    </Table>
    );
  };

  export default  TutorAvailabilities;