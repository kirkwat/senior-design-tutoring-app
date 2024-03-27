import knex from "../config/knex";
import { IAppointment } from "../interfaces/IAppointment";

class Appointment {
  static USER_TABLE = "user";
  static TUTOR_TABLE = "tutor";
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

  static async isAvailable(day: number, tutor_id?: string) {
    const subquery = knex(this.APPOINTMENT_TABLE)
      .select("id")
      .whereBetween("start_time", [day, day + 86400000]); // adding number of milliseconds in a day
    return await knex(this.APPOINTMENT_TABLE)
      .select("*")
      .whereIn("id", subquery)
      .where({ tutor_id, student_id: null });
  }

  static async findOpenAppointmentsByTutor(tutor_id?: string) {
    return knex(this.APPOINTMENT_TABLE)
      .select("*")
      .where({ tutor_id, student_id: null });
  }

  static async findStudentsAppointments(student_id?: string) {
    return knex(this.APPOINTMENT_TABLE).join(this.USER_TABLE,"appointment.tutor_id","=","user.id")
    .select("appointment.*","user.name")
    .where({ student_id });
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
