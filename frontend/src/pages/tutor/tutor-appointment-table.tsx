import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "src/components/ui/alert-dialog";
import { Button, buttonVariants } from "src/components/ui/button";
import { TutorAppointment } from "src/types/appointment";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { cancelAppointment } from "src/api/appointment-api";
import { toast } from "sonner";

interface DataTableProps {
  tab: "upcoming" | "available" | "past";
  fetchAppointments: () => void;
  data: TutorAppointment[];
}

export default function TutorAppointmentsTable({
  tab,
  fetchAppointments,
  data,
}: DataTableProps) {
  const axiosPrivate = useAxiosPrivate();

  const columns: ColumnDef<TutorAppointment>[] = useMemo(
    () => [
      ...(tab !== "available"
        ? ([
            {
              accessorKey: "student_name",
              header: "Student Name",
            },
            {
              accessorKey: "selected_subject",
              header: "Subject",
              cell: ({ row }) => (
                <span className="capitalize">
                  {row.original.selected_subject}
                </span>
              ),
            },
          ] as ColumnDef<TutorAppointment>[])
        : []),
      {
        accessorKey: "zoom_link",
        header: "Zoom Link",
        cell: ({ row }) =>
          row.original.status === "cancelled" ||
          row.original.status === "available" ? (
            <Button disabled>Join Zoom</Button>
          ) : (
            <a
              href={row.original.zoom_link}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants()}
            >
              Join Zoom
            </a>
          ),
      },
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
      ...(tab !== "past"
        ? ([
            {
              id: "actions",
              cell: ({ row }) => {
                const startTime = new Date(row.original.start_time as number);
                const currentTime = new Date();

                const diff = Math.abs(
                  startTime.getTime() - currentTime.getTime(),
                );

                const isLessThan24Hours = diff < 24 * 60 * 60 * 1000;

                return (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isLessThan24Hours && tab === "upcoming"}
                      >
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Only cancel if you are
                          sure you want to cancel this appointment. Appointments
                          can only be cancelled at least 24 hours before the
                          start time.
                        </AlertDialogDescription>
                        <div className="grid grid-cols-3 my-3 border rounded-sm text-muted-foreground text-sm">
                          <div className="p-2">
                            <span className="font-medium">Start Time: </span>
                            <span>
                              {format(row.original.start_time, "h:mma")}
                            </span>
                          </div>
                          <div className="p-2">
                            <span className="font-medium">End Time: </span>
                            <span>
                              {format(row.original.end_time, "h:mma")}
                            </span>
                          </div>
                          <div className="p-2">
                            <span className="font-medium">Date: </span>
                            <span>
                              {format(row.original.start_time, "M/d/yy")}
                            </span>
                          </div>
                          {row.original.student_name && (
                            <div className="p-2">
                              <span className="font-medium">Student: </span>
                              <span>{row.original.student_name}</span>
                            </div>
                          )}
                          {row.original.selected_subject && (
                            <div className="p-2 col-span-2">
                              <span className="font-medium">Subject: </span>
                              <span className="capitalize">
                                {row.original.selected_subject}
                              </span>
                            </div>
                          )}
                        </div>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, go back</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            toast.promise(
                              cancelAppointment(axiosPrivate, row.original.id),
                              {
                                loading: "Cancelling appointment...",
                                success: () => {
                                  fetchAppointments();
                                  return "Appointment cancelled!";
                                },
                                error:
                                  "Error cancelling appointment. Please try again.",
                              },
                            );
                          }}
                        >
                          Yes, cancel
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                );
              },
            },
          ] as ColumnDef<TutorAppointment>[])
        : []),
    ],
    [axiosPrivate, fetchAppointments, tab],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border w-full">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No appointments.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
