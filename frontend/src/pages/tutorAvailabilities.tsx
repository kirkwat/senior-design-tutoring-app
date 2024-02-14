import { useState, useEffect } from "react";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader,TableRow} from "src/components/ui/table"
import { getTutors } from "src/api/tutorAPI";
import { Button } from "src/components/ui/button";
import { redirect } from "react-router-dom";
import { Link } from 'react-router-dom';
// import {ITutor} from '../../../backend/src/interfaces/ITutor'
// import Tutor from '../../../backend/src/models/Tutor'

interface Tutor {
   id: number;
   user_id: number;
   bio: string;
 }

// List of all the tutors
const TutorAvailabilities = () => {
   const [tutors, setTutors] = useState<Tutor[] | null>(null);
   
   useEffect(() => {
      getTutors().then((data) => setTutors(data)).catch((error) => console.error("Error fetching tutor data:", error));
    }, []);

    return (
      <div>
        {tutors === null ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Tutor Name</TableHead>
                <TableHead>Specialties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell>{tutor.id}</TableCell>
                  <TableCell>{tutor.bio}</TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link to={`../makeAppointment/${tutor.id}`}>View Availabilities</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  export default  TutorAvailabilities;