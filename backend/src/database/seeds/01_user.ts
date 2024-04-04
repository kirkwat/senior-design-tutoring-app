import { Knex } from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex) {
  await knex("user").del();

  const users = [
    {
      name: "User One",
      email: "user1@gmail.com",
      password: "Password1!",
      role: "user",
    },
    {
      name: "User Two",
      email: "user2@gmail.com",
      password: "Password1!",
      role: "user",
    },
    {
      name: "Tutor One",
      email: "tutor1@gmail.com",
      password: "Password1!",
      role: "tutor",
    },
    {
      name: "Tutor Two",
      email: "tutor2@gmail.com",
      password: "Password1!",
      role: "tutor",
    },
  ];

  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return {
        ...user,
        password: hashedPassword,
      };
    }),
  );

  await knex("user").insert(hashedUsers);
}
