import { Button } from "src/components/ui/button";
import AppointmentsTable from "./appointments-table";
import { Appointment, columns } from "./columns";
import { Link } from "react-router-dom";

const data: Appointment[] = [
  {
    tutor: "Tutor 1",
    student_id: 1,
    selected_subject: "Math",
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 30 * 60000),
    zoom_link: "https://zoom.us/j/123456789",
  },
  {
    tutor: "Tutor 2",
    student_id: 2,
    selected_subject: "Science",
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 30 * 60000),
    zoom_link: "https://zoom.us/j/123456789",
  },
  {
    tutor: "Tutor 3",
    student_id: 2,
    selected_subject: "Math",
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 30 * 60000),
    zoom_link: "https://zoom.us/j/123456789",
  },
  {
    tutor: "Tutor 4",
    student_id: 2,
    selected_subject: "Reading",
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 30 * 60000),
    zoom_link: "https://zoom.us/j/123456789",
  },
  {
    tutor: "Tutor 5",
    student_id: 2,
    selected_subject: "Writing",
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 30 * 60000),
    zoom_link: "https://zoom.us/j/123456789",
  },
  {
    tutor: "Tutor 6",
    student_id: 2,
    selected_subject: "Math",
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 30 * 60000),
    zoom_link: "https://zoom.us/j/123456789",
  },
];

export default function User() {
  return (
    <div className="container min-h-[60vh] py-12 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Students Page
        </h1>
        <Button>
          <Link to="/tutorAvailabilities">Tutor Availabilities</Link>
        </Button>
      </div>
      <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
        Your Upcoming Appointments
      </p>
      <div className="">
        <AppointmentsTable columns={columns} data={data} />
      </div>
    </div>
  );
}
