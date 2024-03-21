import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "src/components/ui/button";

export type Appointment = {
  tutor: string;
  student_id: number;
  selected_subject: string;
  start_time: Date;
  end_time: Date;
  zoom_link: string;
};

export const columns: ColumnDef<Appointment>[] = [
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
    cell: ({ row }) => (
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
    cell: ({ row }) => format(row.original.start_time, "M/d/yy"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="destructive" size="sm">
        Cancel
      </Button>
    ),
  },
];
