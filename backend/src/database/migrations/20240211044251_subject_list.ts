import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("subject_list", (table) => {
    table.increments("id").primary();
    table.integer("subject_id").notNullable();
    table.foreign("subject_id").references("subject.id");
    table.string("name").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("subject_list");
}
