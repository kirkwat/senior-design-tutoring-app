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
import { Button } from "src/components/ui/button";
import { TutorAppointment } from "src/types/tutor-appointment";

interface DataTableProps {
  tab: "upcoming" | "available" | "past";
  data: TutorAppointment[];
}

export default function TutorAppointmentsTable({ tab, data }: DataTableProps) {
  const columns: ColumnDef<TutorAppointment>[] = useMemo(
    () => [
      ...(tab !== "available"
        ? [
            {
              accessorKey: "student_name",
              header: "Student Name",
            },
            {
              accessorKey: "selected_subject",
              header: "Subject",
            },
          ]
        : []),
      {
        accessorKey: "zoom_link",
        header: "Zoom Link",
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
        ? [
            {
              id: "actions",
              cell: ({ row }: { row: any }) => (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Only cancel if you are
                        sure you want to cancel this appointment.
                        <div className="grid grid-cols-3 my-3 border rounded-sm divide-x">
                          <div className="p-2">
                            <span className="font-medium">Tutor: </span>
                            <span>{row.original.tutor}</span>
                          </div>
                          <div className="p-2">
                            <span className="font-medium">Date: </span>
                            <span>
                              {format(row.original.start_time, "M/d/yy")}
                            </span>
                          </div>
                          <div className="p-2">
                            <span className="font-medium">Subject: </span>
                            <span>{row.original.selected_subject}</span>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, go back</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => console.log("cancel", row.original.id)}
                      >
                        Yes, cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ),
            },
          ]
        : []),
    ],
    [tab],
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
