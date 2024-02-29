import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { getTutors } from "src/api/tutorAPI";
import { Button } from "src/components/ui/button";
import { redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import { findAppointmentByTutor } from "src/api/appointmentAPI";

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
  id: number;
  tutor_id: number;
  student_id: null;
  selected_subject: null;
  start_time: number;
  end_time: number;
  zoom_link: string;
}

// List of all the tutors
const TutorAvailabilities = () => {
  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];
  const [tutors, setTutors] = useState<Tutor[] | null>(null);
  const [date, setDate] = useState<Value>(new Date());
  const [availableTutors, setAvailableTutors] = useState<Tutor[] | null>(null);
  const [curAppointment, setCurAppointment] = useState<Appointment | null>(
    null,
  );
  const [curAvailable, setCurAvailable] = useState<Appointment[] | null>(null);

  useEffect(() => {
    getTutors()
      .then((data) => setTutors(data))
      .catch((error) => console.error("Error fetching tutor data:", error));
  }, []);

  // useEffect(() => {
  //   if (tutors) {
  //     for (let i = 0; i < tutors.length; i++) {
  //       findAppointmentByTutor(`${tutors[i].id}`).then((data) => setCurAvailable(data)).catch((error) => console.error("Error fetching appointment data:", error));

  //     }
  //   }

  // }, [date]);

  return (
    <div className="flex">
      <div className="mt-4 ml-5">
        <h1 className="font-bold text-xl">Tutor Availabilities</h1>
        <Calendar onChange={setDate} value={date} calendarType="gregory" />
      </div>
      <div className="ml-4">
        {tutors === null ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Tutor Name</TableHead>
                <TableHead className="w-[500px]">Bio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell>{tutor.name}</TableCell>
                  <TableCell>{tutor.bio}</TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link to={`../makeAppointment/${tutor.id}`}>
                        View Availabilities
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TutorAvailabilities;
