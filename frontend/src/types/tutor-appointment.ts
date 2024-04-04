export interface TutorAppointment {
  id: number;
  tutor_id: number;
  student_id?: number;
  student_name?: string;
  student_profile_picture?: string;
  selected_subject?: number;
  start_time: number;
  end_time: number;
  zoom_link: string;
  status: "available" | "booked" | "cancelled";
}
