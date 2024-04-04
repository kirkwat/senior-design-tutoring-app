import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("subject_list").del();
  await knex("subject_list").insert([
    { id: 1, name: "mathematics" },
    { id: 2, name: "physics" },
    { id: 3, name: "chemistry" },
  ]);

  await knex("subject").whereIn("tutor_id", [3, 4]).del();
  await knex("subject").insert([
    { tutor_id: 3, subject_id: 1 },
    { tutor_id: 3, subject_id: 2 },
    { tutor_id: 4, subject_id: 2 },
    { tutor_id: 4, subject_id: 3 },
  ]);
}
