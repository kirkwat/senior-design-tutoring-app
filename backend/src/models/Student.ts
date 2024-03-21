import knex from "../config/knex";
import { IUser } from "../interfaces/IUser";

class Student {
  static USER_TABLE = "user";

  static async findStudentByID(id: number) {
    return knex<IUser>(this.USER_TABLE).where({ id }).first();
  }

  static async updateStudentProfile(id: number, profile_picture: number) {
    return knex(this.USER_TABLE).where({id}).update({profile_picture})
  }

}

export default Student