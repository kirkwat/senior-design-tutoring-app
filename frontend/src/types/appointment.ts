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

export interface StudentAppointment {
  id: number;
  tutor_id: number;
  student_id?: number;
  tutor_name?: string;
  tutor_profile_picture?: string;
  selected_subject?: number;
  start_time: number;
  end_time: number;
  zoom_link: string;
  status: "available" | "booked" | "cancelled";
}

export interface Appointment {
  end_time: number;
  id: number;
  selected_subject: number | null;
  start_time: number;
  status: "available" | "booked" | "cancelled";
  student_id: number | null;
  tutor_id: number;
  zoom_link: string;
}
