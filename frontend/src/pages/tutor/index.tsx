import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTutorAppointments } from "src/api/appointment-api";
import { Button } from "src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import useAuth from "src/hooks/useAuth";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { TutorAppointment } from "src/types/tutor-appointment";
import TutorAppointmentsTable from "./tutor-appointment-table";

export default function TutorPage() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [appointments, setAppointments] = useState<TutorAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!auth?.id) return;
    setIsLoading(true);

    getTutorAppointments(axiosPrivate, auth.id)
      .then((data) => {
        setAppointments(data as TutorAppointment[]);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [auth?.id, axiosPrivate]);

  console.log(appointments);

  if (appointments.length !== 0) {
    console.log("type", typeof appointments[0].start_time);
  }

  return (
    <div className="container min-h-[60vh] py-12 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Tutor Page
        </h1>
        <div className="flex gap-4">
          <Button variant="outline">
            <Link to="/tutor/edit">Edit Profile</Link>
          </Button>
          <Button>
            <Link to="/tutor/create">Create Appointments</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <div className="flex justify-between">
          <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
            Your Appointments
          </p>
          <TabsList>
            <TabsTrigger value="upcoming" disabled={isLoading}>
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="available" disabled={isLoading}>
              Available
            </TabsTrigger>
            <TabsTrigger value="past" disabled={isLoading}>
              Past/Canceled
            </TabsTrigger>
          </TabsList>
        </div>
        {isLoading ? (
          <div className="mt-8 md:mt-24 text-center text-muted-foreground font-medium text-xl">
            Loading appointments...
          </div>
        ) : (
          <div className="mt-8">
            <TabsContent value="upcoming">
              <TutorAppointmentsTable
                tab="upcoming"
                data={appointments
                  .filter(
                    (appointment) =>
                      appointment.student_id !== null &&
                      appointment.end_time > Date.now(),
                  )
                  .sort((a, b) => a.start_time - b.start_time)}
              />
            </TabsContent>
            <TabsContent value="available">
              <TutorAppointmentsTable
                tab="available"
                data={appointments
                  .filter((appointment) => appointment.student_id === null)
                  .sort((a, b) => a.start_time - b.start_time)}
              />
            </TabsContent>
            <TabsContent value="past">
              <TutorAppointmentsTable
                tab="past"
                data={appointments
                  .filter((appointment) => appointment.end_time < Date.now())
                  .sort((a, b) => b.start_time - a.start_time)}
              />
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  );
}
