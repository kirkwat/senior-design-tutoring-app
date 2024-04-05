import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentAppointments } from "src/api/appointment-api";
import { buttonVariants } from "src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import useAuth from "src/hooks/useAuth";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { StudentAppointment } from "src/types/appointment";
import UserAppointmentsTable from "./user-appointment-table";

export default function UserPage() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [appointments, setAppointments] = useState<StudentAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = () => {
    if (!auth?.id) return;
    setIsLoading(true);

    getStudentAppointments(axiosPrivate, auth.id)
      .then((data) => {
        setAppointments(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [auth?.id]);

  return (
    <div className="container min-h-[60vh] py-12 space-y-4">
      <div className="flex justify-between items-center flex-col gap-2 md:flex-row">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Student Dashboard
        </h1>
        <Link to="/search" className={buttonVariants()}>
          Find a Tutor
        </Link>
      </div>

      <Tabs defaultValue="upcoming">
        <div className="flex justify-between flex-col items-center gap-2 md:flex-row">
          <p className="text-muted-foreground md:text-xl/relaxed">
            Your Appointments
          </p>
          <TabsList>
            <TabsTrigger value="upcoming" disabled={isLoading}>
              Upcoming
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
              <UserAppointmentsTable
                tab="upcoming"
                fetchAppointments={fetchAppointments}
                data={appointments
                  .filter((appointment) => appointment.end_time > Date.now())
                  .sort((a, b) => a.start_time - b.start_time)}
              />
            </TabsContent>
            <TabsContent value="past">
              <UserAppointmentsTable
                tab="past"
                fetchAppointments={fetchAppointments}
                data={appointments
                  .filter(
                    (appointment) =>
                      appointment.end_time < Date.now() ||
                      appointment.status === "cancelled",
                  )
                  .sort((a, b) => b.start_time - a.start_time)}
              />
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  );
}
