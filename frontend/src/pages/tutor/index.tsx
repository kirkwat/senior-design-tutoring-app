import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTutorAppointments } from "src/api/appointment-api";
import { buttonVariants } from "src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import useAuth from "src/hooks/useAuth";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { TutorAppointment } from "src/types/appointment";
import TutorAppointmentsTable from "./tutor-appointment-table";
import { getZoomConnection } from "src/api/tutor-api";

export default function TutorPage() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [appointments, setAppointments] = useState<TutorAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = () => {
    if (!auth?.id) return;
    setIsLoading(true);

    getTutorAppointments(axiosPrivate, auth.id)
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
          Tutor Dashboard
        </h1>
        <div className="flex gap-4">
          <Link
            to="/tutor/edit"
            className={buttonVariants({ variant: "outline" })}
          >
            Edit Profile
          </Link>
          <AvailabilityBlockButton />
        </div>
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
                fetchAppointments={fetchAppointments}
                data={appointments
                  .filter(
                    (appointment) =>
                      appointment.student_id !== null &&
                      appointment.status === "booked" &&
                      appointment.end_time > Date.now(),
                  )
                  .sort((a, b) => a.start_time - b.start_time)}
              />
            </TabsContent>
            <TabsContent value="available">
              <TutorAppointmentsTable
                tab="available"
                fetchAppointments={fetchAppointments}
                data={appointments
                  .filter(
                    (appointment) =>
                      appointment.student_id === null &&
                      appointment.status === "available",
                  )
                  .sort((a, b) => a.start_time - b.start_time)}
              />
            </TabsContent>
            <TabsContent value="past">
              <TutorAppointmentsTable
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

function AvailabilityBlockButton() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [zoomConnection, setZoomConnection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!auth?.id) return;
    setIsLoading(true);

    getZoomConnection(axiosPrivate, auth.id)
      .then((data) => {
        console.log("data", data);
        setZoomConnection(data.zoomConnected);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [auth?.id]);
  return !isLoading ? (
    zoomConnection ? (
      <Link to="/tutor/create" className={buttonVariants()}>
        Create Availability Block
      </Link>
    ) : (
      <Link
        to="https://zoom.us/oauth/authorize?client_id=nAp_cGrfQRe4rJQrVTkZfA&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fzoom"
        className={buttonVariants()}
      >
        Connect Zoom
      </Link>
    )
  ) : null;
}
