import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("subject", (table) => {
    table.increments("id").primary();
    table.integer("tutor_id").notNullable();
    table.foreign("tutor_id").references("tutor.id");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("subject");
}
