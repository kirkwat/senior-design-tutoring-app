import { useEffect, useMemo, useState } from "react";
import {
  findAvailableAppointments,
  scheduleAppointment,
} from "src/api/appointment-api";
import { Button } from "src/components/ui/button";
import { Calendar } from "src/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import useAuth from "src/hooks/useAuth";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { Appointment } from "src/types/appointment";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { format } from "date-fns";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Tutor } from "src/types/tutor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { toast } from "sonner";

export default function ScheduleDialog({ tutor }: { tutor: Tutor }) {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined,
  );
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!auth?.id) return;
      setIsLoading(true);

      findAvailableAppointments(axiosPrivate, tutor.id)
        .then((data) => {
          setAppointments(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [tutor.id, isOpen]);

  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return [];

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.start_time);
      return (
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [appointments, selectedDate]);

  const handleBookAppointment = () => {
    if (!auth?.id) return;

    if (!selectedAppointmentId) {
      toast.error("Please select an appointment time.");
      return;
    }

    if (!selectedSubject) {
      toast.error("Please select a subject.");
      return;
    }
    setIsSubmitting(true);

    toast.promise(
      scheduleAppointment(
        axiosPrivate,
        selectedAppointmentId,
        selectedSubject,
        auth.id,
      ),
      {
        loading: "Booking appointment...",
        success: (data) => {
          setIsSubmitting(false);
          setIsOpen(false);
          return "Appointment booked successfully!";
        },
        error: () => {
          setIsSubmitting(false);
          return "Error booking appointment. Please try again.";
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full self-end">Book Appointment</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>
            Find a time that works for you to get some help!
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-6 flex-col md:flex-row">
          <div>
            <div className="text-sm font-medium mb-1 text-center">
              Pick a Date
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date)}
              disabled={(date) => {
                const enabledDates = appointments.map((appointment) => {
                  const date = new Date(appointment.start_time);
                  return new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                  ).getTime();
                });

                const checkDate = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                ).getTime();

                return !enabledDates.includes(checkDate);
              }}
              className="rounded-md border w-fit mx-auto h-fit"
            />
            <div className="text-sm font-medium mt-4 mb-1 text-center">
              Pick a Subject
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="capitalize">
                <SelectValue placeholder="Pick..." />
              </SelectTrigger>
              <SelectContent>
                {tutor.subjects.length > 0 ? (
                  tutor.subjects.map((subject) => (
                    <SelectItem
                      key={subject}
                      value={subject}
                      className="capitalize"
                    >
                      {subject}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="any" className="capitalize">
                    any
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <div className="text-sm font-medium mb-1 text-center">
              Pick a Time
            </div>
            <ScheduleTable
              data={filteredAppointments}
              selectedAppointmentId={selectedAppointmentId}
              setSelectedAppointmentId={setSelectedAppointmentId}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button
            className="w-full"
            onClick={handleBookAppointment}
            disabled={
              !selectedAppointmentId || !selectedSubject || isSubmitting
            }
          >
            Book Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DataTableProps {
  data: Appointment[];
  selectedAppointmentId: number | undefined;
  setSelectedAppointmentId: (id: number) => void;
}

function ScheduleTable({
  data,
  selectedAppointmentId,
  setSelectedAppointmentId,
}: DataTableProps) {
  const axiosPrivate = useAxiosPrivate();

  const columns: ColumnDef<Appointment>[] = useMemo(
    () => [
      {
        accessorKey: "start_time",
        header: "Start Time",
        cell: ({ row }) => format(row.original.start_time, "h:mma"),
      },
      {
        accessorKey: "end_time",
        header: "End Time",
        cell: ({ row }) => format(row.original.end_time, "h:mma"),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => format(row.original.start_time, "M/d/yy"),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return row.original.id === selectedAppointmentId ? (
            <Button size="sm" disabled className="w-20">
              Selected
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-20"
              onClick={() => setSelectedAppointmentId(row.original.id)}
            >
              Select
            </Button>
          );
        },
      },
    ],
    [axiosPrivate, selectedAppointmentId, setSelectedAppointmentId],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border w-full">
      <ScrollArea viewportClassName="max-h-96">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No appointments.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
