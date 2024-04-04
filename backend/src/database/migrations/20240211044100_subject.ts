import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("subject", (table) => {
    table.integer("tutor_id").notNullable();
    table.foreign("tutor_id").references("user.id");
    table.integer("subject_id").notNullable();
    table.foreign("subject_id").references("subject_list.id");
    table.primary(["tutor_id", "subject_id"]);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("subject");
}
