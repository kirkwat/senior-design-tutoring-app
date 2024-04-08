import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("appointment", (table) => {
    table.increments("id").primary();
    table.integer("tutor_id").notNullable();
    table.foreign("tutor_id").references("user.id");
    table.integer("student_id");
    table.foreign("student_id").references("user.id");
    table.string("selected_subject");
    table.timestamp("start_time").notNullable();
    table.timestamp("end_time").notNullable();
    table.string("zoom_link").notNullable();
    table.string("status").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("appointment");
}
