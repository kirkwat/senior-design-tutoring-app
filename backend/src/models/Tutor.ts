import knex from "../config/knex";
import { IUser } from "../interfaces/IUser";

class Tutor {
  static USER_TABLE = "user";
  static APPOINTMENT_TABLE = "appointment";

  static async findAllTutors() {
    return await knex(this.USER_TABLE)
      .join(this.USER_TABLE, "tutor.user_id", "=", "user.id")
      .select("*");
  }

  static async findTutorByID(tutor_id?: string) {
    return await knex(this.USER_TABLE)
      .join(this.USER_TABLE, "tutor.user_id", "=", "user.id")
      .select("*")
      .where({ user_id: tutor_id });
  }

  static async findAvailableTutorsByTime(time?: number) {
    const subquery = knex(this.APPOINTMENT_TABLE)
      .select("tutor_id")
      .where({ start_time: time, student_id: !null });
    return await knex<IUser>(this.USER_TABLE)
      .select("*")
      .whereIn("id", subquery);
  }

  static async findAvailableTutorsByDay(day: number) {
    const subquery = knex(this.APPOINTMENT_TABLE)
      .select("tutor_id")
      .whereBetween("start_time", [day, day + 86400000]); // adding number of milliseconds in a day
    return await knex<IUser>(this.USER_TABLE)
      .select("*")
      .whereIn("id", subquery);
  }

  static async findAvailableTutorsByWeek(week: number) {
    const subquery = knex(this.APPOINTMENT_TABLE)
      .select("tutor_id")
      .whereBetween("start_time", [week, week + 604800000]); // adding number of milliseconds in a week
    return await knex<IUser>(this.USER_TABLE)
      .select("*")
      .whereIn("id", subquery);
  }

  static async updateTutorProfilePicture(
    tutor_id: number,
    profile_picture: number,
  ) {
    const subquery = knex(this.USER_TABLE)
      .select("user_id")
      .where({ id: tutor_id });
    return await knex(this.USER_TABLE)
      .whereIn("id", subquery)
      .update({ profile_picture });
  }

  static async updateTutorBio(tutor_id: number, bio: string) {
    return knex(this.USER_TABLE).where({ id: tutor_id }).update({ bio });
  }
}

export default Tutor;
