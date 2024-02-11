import knex from "../config/knex";
import { IUser } from "../interfaces/IUser";

class User {
  static USER_TABLE = "users";

  static async findUserByUsername(username: string) {
    return knex<IUser>(this.USER_TABLE).where({ username }).first();
  }

  static async findUserByRefreshToken(refreshToken: string) {
    return knex<IUser>(this.USER_TABLE).where({ refreshToken }).first();
  }

  static async updateUserRefreshToken(username: string, refreshToken: string) {
    await knex<IUser>(this.USER_TABLE)
      .where({ username })
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
