import knex from "../config/knex";
import { IUser } from "../interfaces/IUser";

class User {
  static USER_TABLE = "user";

  static async findUserByEmail(email: string) {
    return knex<IUser>(this.USER_TABLE).where({ email }).first();
  }

  static async findUserByRefreshToken(refreshToken: string) {
    return knex<IUser>(this.USER_TABLE).where({ refreshToken }).first();
  }

  static async updateUserRefreshToken(email: string, refreshToken: string) {
    await knex<IUser>(this.USER_TABLE)
      .where({ email })
      .update({ refreshToken });
  }

  static async clearRefreshToken(id: number) {
    await knex<IUser>(this.USER_TABLE)
      .where({ id })
      .update({ refreshToken: "" });
  }

  static async createUser(newUser: Omit<IUser, "id">) {
    return knex<IUser>(this.USER_TABLE).insert(newUser);
  }
}

export default User;
