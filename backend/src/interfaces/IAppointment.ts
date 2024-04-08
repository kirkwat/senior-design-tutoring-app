export interface IAppointment {
  id: number;
  tutor_id: number;
  student_id?: number;
  selected_subject?: string;
  start_time: Date | number;
  end_time: Date | number;
  zoom_link: string;
  status: "available" | "booked" | "cancelled";
}
