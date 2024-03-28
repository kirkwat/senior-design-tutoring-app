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

export type Appointment = {
  tutor: string;
  student_id: number;
  selected_subject: string;
  start_time: Date;
  end_time: Date;
  zoom_link: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
  onRemove: (row: TValue) => void;
}

export default function AppointmentsTable<TData, TValue>({
  data,
  onRemove,
}: DataTableProps<TData, TValue>) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "tutor",
        header: "Tutor",
      },
      {
        accessorKey: "selected_subject",
        header: "Subject",
      },
      {
        accessorKey: "time",
        header: "Time",
        cell: ({ row }: { row: any }) => (
          <div>
            {format(row.original.start_time, "h:mma")}
            {" - "}
            {format(row.original.end_time, "h:mma")}
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }: { row: any }) =>
          format(row.original.start_time, "M/d/yy"),
      },
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
                  This action cannot be undone. Only cancel if you are sure you
                  want to cancel this appointment.
                  <div className="grid grid-cols-3 my-3 border rounded-sm divide-x">
                    <div className="p-2">
                      <span className="font-medium">Tutor: </span>
                      <span>{row.original.tutor}</span>
                    </div>
                    <div className="p-2">
                      <span className="font-medium">Date: </span>
                      <span>{format(row.original.start_time, "M/d/yy")}</span>
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
                <AlertDialogAction onClick={() => onRemove(row.original.id)}>
                  Yes, cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
    ],
    [onRemove],
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
