// import { Calendar } from "src/components/ui/calendar"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "src/components/ui/button";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getTutors, getTutorByID } from "src/api/tutorAPI";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import {
  createAppointment,
  findAppointmentByTutor,
} from "src/api/appointmentAPI";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";

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

interface NewAppointment {
  id: number;
  tutor_id: number;
  student_id: null;
  selected_subject: null;
  start_time: string;
  end_time: string;
  zoom_link: string;
  date: string;
}

//Shows all available times for selected tutor
const MakeAppointment = () => {
  const axiosPrivate = useAxiosPrivate();
  const { tutorID } = useParams();
  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];
  const [date, setDate] = useState<Value>(new Date());
  const [formattedDate, setFormattedDate] = useState<String>();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[] | null>();
  const [newAppointmentList, setNewAppointmentList] = useState<
    NewAppointment[] | null
  >();

  useEffect(() => {
    if (tutorID) {
      getTutorByID(axiosPrivate, tutorID)
        .then((data) => setTutor(data))
        .catch((error) => console.error("Error fetching tutor data:", error));
      findAppointmentByTutor(axiosPrivate, tutorID)
        .then((data) => setAppointments(data))
        .catch((error) => console.error("Error fetching tutor data:", error));
    }
  }, []);

  useEffect(() => {
    handleDateTime();
  }, [appointments]);

  useEffect(() => {
    if (date) {
      let newDate = new Date(date.toString());
      setFormattedDate(
        `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`,
      );
    }
  }, [date]);

  const handleSubmit = () => {
    // TODO: Add functionality for adding student to an appointment
  };

  const handleDateTime = () => {
    if (appointments) {
      let appList: NewAppointment[] = [];
      for (let i = 0; i < appointments.length; i++) {
        let app = appointments[i];

        let startDate = new Date(app.start_time);
        let newDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;

        let newStartHours = startDate.getHours();
        let startAM = newStartHours >= 12 ? "PM" : "AM";
        let newStartTime = `${newStartHours % 12 || 12}:${startDate.getMinutes().toString().padStart(2, "0")}:${startDate.getSeconds().toString().padStart(2, "0")} ${startAM}`;

        let endDate = new Date(app.end_time);
        let newEndHours = endDate.getHours();
        let endAM = newEndHours >= 12 ? "PM" : "AM";
        let newEndTime = `${newEndHours % 12 || 12}:${endDate.getMinutes().toString().padStart(2, "0")}:${endDate.getSeconds().toString().padStart(2, "0")} ${endAM}`;

        let newApp: NewAppointment = {
          id: app.id,
          tutor_id: app.tutor_id,
          student_id: app.student_id,
          selected_subject: app.selected_subject,
          start_time: newStartTime,
          end_time: newEndTime,
          zoom_link: app.zoom_link,
          date: newDate,
        };

        appList.push(newApp);
      }
      setNewAppointmentList(appList);
    }
  };

  return (
    <div className="flex">
      <div className="mt-4 ml-5">
        {tutor ? (
          <h1 className="font-bold text-xl">Availabilities for {tutor.name}</h1>
        ) : (
          <h1>Availabilities</h1>
        )}
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
          {newAppointmentList ? (
            <TableBody>
              {newAppointmentList.map((appointment) => {
                if (!formattedDate || appointment.date === formattedDate) {
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>{`${appointment.start_time}-${appointment.end_time}`}</TableCell>
                      <TableCell>Available</TableCell>
                      <TableCell>
                        <Button onClick={handleSubmit}>
                          Schedule Appointment
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          ) : (
            <p>Loading...</p>
          )}
        </Table>
      </div>
    </div>
  );
};

export default MakeAppointment;
