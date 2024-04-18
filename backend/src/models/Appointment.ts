import knex from "../config/knex";
import { IAppointment } from "../interfaces/IAppointment";

export default class Appointment {
  static USER_TABLE = "user";
  static APPOINTMENT_TABLE = "appointment";

  static findAppointmentById(appointment: number) {
    return knex<IAppointment>(this.APPOINTMENT_TABLE)
      .select("*")
      .where({ id: appointment })
      .first();
  }

  static findOverlappingAppointments(
    tutor_id: number,
    newStart: Date,
    newEnd: Date,
  ) {
    return knex(this.APPOINTMENT_TABLE)
      .select("*")
      .where({ tutor_id })
      .whereNot({ status: "cancelled" })
      .andWhere(function () {
        this.where(function () {
          this.where("start_time", "<", newEnd.getTime()).andWhere(
            "end_time",
            ">",
            newStart.getTime(),
          );
        });
      });
  }

  static async findTutorAppointments(tutor_id: number) {
    return knex(this.APPOINTMENT_TABLE)
      .select(
        "appointment.*",
        "user.name as student_name",
        "user.profile_picture as student_profile_picture",
      )
      .leftJoin("user", "appointment.student_id", "user.id")
      .where({ tutor_id });
  }

  static async findStudentAppointments(student_id: number) {
    return knex(this.APPOINTMENT_TABLE)
      .select(
        "appointment.*",
        "user.name as tutor_name",
        "user.profile_picture as tutor_profile_picture",
      )
      .leftJoin("user", "appointment.tutor_id", "user.id")
      .where({ student_id });
  }

  static async findAvailableTutorAppointments(tutor_id: number) {
    const currentTime = Date.now();

    return knex(this.APPOINTMENT_TABLE)
      .select("*")
      .where({ tutor_id, student_id: null, status: "available" })
      .andWhere("start_time", ">", currentTime);
  }

  static async cancelAppointment(appointment_id: number) {
    return knex<IAppointment>(this.APPOINTMENT_TABLE)
      .where({ id: appointment_id })
      .update({ status: "cancelled" });
  }

  static async createAppointment(newAppointment: Omit<IAppointment, "id">) {
    return await knex<IAppointment>(this.APPOINTMENT_TABLE).insert(
      newAppointment,
    );
  }

  static async scheduleAppointment(
    appointment_id: number,
    student_id: number,
    selected_subject: string,
    zoom_link: string,
  ) {
    return knex<IAppointment>(this.APPOINTMENT_TABLE)
      .where({ id: appointment_id })
      .update({ student_id, selected_subject, zoom_link, status: "booked" });
  }
}
