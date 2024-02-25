export interface IAppointment {
  id: number;
  tutor_id: number;
  student_id?: number;
  selected_subject?: number;
  start_time: Date;
  end_time: Date;
  zoom_link: string;
}