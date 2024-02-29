import knex from "../config/knex";
import { IAppointment } from "../interfaces/IAppointment";

class Appointment {
  static APPOINTMENT_TABLE = "appointment";

  static findAppoitnmentByTutor(tutor_id: number, start_date: Date) {
    return knex(this.APPOINTMENT_TABLE)
      .select("*")
      .where({ tutor_id, start_time: start_date.getTime() });
  }

  static async createAppointment(newAppointment: Omit<IAppointment, "id">) {
    return await knex<IAppointment>(this.APPOINTMENT_TABLE).insert(
      newAppointment,
    );
  }

  static async isAvailable(start_date: Date, tutor_id?: string) {
    return knex(this.APPOINTMENT_TABLE)
      .select("*")
      .where({ tutor_id, start_time: start_date.getTime(), student_id: null });
  }

  static async findOpenAppointmentsByTutor(tutor_id?: string) {
    return knex(this.APPOINTMENT_TABLE)
      .select("*")
      .where({ tutor_id, student_id: null });
  }

  static async findStudentsAppointments(student_id?: string) {
    return knex(this.APPOINTMENT_TABLE).select("*").where({ student_id });
  }

  static async signUpForAppointment(
    student_id: string,
    selected_subject: string,
    appointment_id?: string,
  ) {
    return knex(this.APPOINTMENT_TABLE)
      .where({ id: appointment_id })
      .update({ student_id, selected_subject });
  }
}

export default Appointment;
