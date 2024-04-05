import knex from "../config/knex";
import { IUser } from "../interfaces/IUser";

class Tutor {
  static USER_TABLE = "user";
  static APPOINTMENT_TABLE = "appointment";

  static async findTutorByID(tutor_id?: string) {
    return await knex(this.USER_TABLE)
      .join(this.USER_TABLE, "tutor.user_id", "=", "user.id")
      .select("*")
      .where({ user_id: tutor_id });
  }

  static async getTutorAndTheirSubjects(tutor_id: number) {
    const results = await knex(this.USER_TABLE)
      .where("user.id", tutor_id)
      .leftJoin("subject", "user.id", "=", "subject.tutor_id")
      .leftJoin("subject_list", "subject.subject_id", "=", "subject_list.id")
      .select(
        "user.id",
        "user.name",
        "user.email",
        "user.profile_picture",
        "user.bio",
        "subject_list.name as subject_name",
      );

    const formattedResult = results.reduce((acc, current) => {
      if (acc[current.id]) {
        acc[current.id].subjects.push(current.subject_name);
      } else {
        acc[current.id] = {
          id: current.id,
          name: current.name,
          email: current.email,
          role: current.role,
          refreshToken: current.refreshToken,
          profile_picture: current.profile_picture,
          bio: current.bio,
          subjects: [current.subject_name],
        };
      }
      return acc;
    }, {});

    return Object.values(formattedResult);
  }

  static async getAllTutorsWithSubjects() {
    const results = await knex("user")
      .where("user.role", "tutor")
      .leftJoin("subject", "user.id", "=", "subject.tutor_id")
      .leftJoin("subject_list", "subject.subject_id", "=", "subject_list.id")
      .select(
        "user.id",
        "user.name",
        "user.email",
        "user.profile_picture",
        "user.bio",
        "subject_list.name as subject_name",
      );

    const formattedResult = results.reduce((acc, current) => {
      if (!acc[current.id]) {
        acc[current.id] = {
          id: current.id,
          name: current.name,
          email: current.email,
          profile_picture: current.profile_picture,
          bio: current.bio,
          subjects: [],
        };
      }
      if (current.subject_name) {
        acc[current.id].subjects.push(current.subject_name);
      }
      return acc;
    }, {});

    return Object.values(formattedResult);
  }

  static async updateTutorProfile(tutor_id: number, bio: string, name: string) {
    await knex(this.USER_TABLE).where({ id: tutor_id }).update({
      bio,
      name,
    });
  }

  static async updateTutorProfilePicture(
    tutor_id: number,
    picture_url: string,
  ) {
    await knex("user").where("id", tutor_id).update({
      profile_picture: picture_url,
    });
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

  static async updateTutorBio(tutor_id: number, bio: string) {
    return knex(this.USER_TABLE).where({ id: tutor_id }).update({ bio });
  }
}

export default Tutor;
