export interface IAppointment {
  id: number;
  tutor_id: number;
  student_id?: number;
  selected_subject?: string;
  start_time: Date;
  end_time: Date;
  zoom_link: string;
  status: "available" | "booked" | "cancelled";
}
