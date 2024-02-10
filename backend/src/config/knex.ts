import knex from "knex";
import knexConfig from "../knexfile";

const environment = process.env.NODE_ENV || "development";
const config = knexConfig[environment];
const db = knex(config);

// Create the user table
// Stores the data of each user
// Columns: id, first_name, last_name, email, password, profile_picture
db.schema.hasTable("user").then((exists) => {
  if (!exists) {
    db.schema
      .createTable("user", (table) => {
        table.increments("id").primary();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.integer("profile_picture").notNullable();
      })
      .then(() => {
        // Log success message
        console.log("Table 'users' created");
      });
  }
});

// Create the admin table
// Stores the data of the admin user
// Columns: id, user_id
db.schema.hasTable("admin").then((exists) => {
  if (!exists) {
    db.schema
      .createTable("admin", (table) => {
        table.increments("id").primary();
        table.integer("user_id").notNullable();
        table.foreign("user_id").references("user.id");
      })
      .then(() => {
        // Log success message
        console.log("Table 'admin' created");
      });
  }
});

// Create the tutor table
// Stores the data of the tutor user
// Columns: id, user_id, bio
db.schema.hasTable("tutor").then((exists) => {
  if (!exists) {
    db.schema
      .createTable("tutor", (table) => {
        table.increments("id").primary();
        table.integer("user_id").notNullable();
        table.foreign("user_id").references("user.id");
        table.string("bio");
      })
      .then(() => {
        // Log success message
        console.log("Table 'tutor' created");
      });
  }
});

// Create the subjects table
// Stores the data of the subjects for every tutor
// Columns: id, tutor_id
db.schema.hasTable("subjects").then((exists) => {
  if (!exists) {
    db.schema
      .createTable("subjects", (table) => {
        table.increments("id").primary();
        table.integer("tutor_id").notNullable();
        table.foreign("tutor_id").references("tutor.id");
      })
      .then(() => {
        // Log success message
        console.log("Table 'subjects' created");
      });
  }
});

// Create the subject list table
// Stores the data of the name of each subject
// Columns: id, subject_id, name
db.schema.hasTable("subject_list").then((exists) => {
  if (!exists) {
    db.schema
      .createTable("subject_list", (table) => {
        table.increments("id").primary();
        table.integer("subject_id").notNullable();
        table.foreign("subject_id").references("subjects.id");
        table.string("name").notNullable();
      })
      .then(() => {
        // Log success message
        console.log("Table 'subject_list' created");
      });
  }
});

// Create the appointment table
// Stores the data of the appointments between a normal user (student) and the tutor user
// Columns: id, tutor_id, student_id, selected_subject, start_time, end_time, zoom_link
db.schema.hasTable("appointment").then((exists) => {
  if (!exists) {
    db.schema
      .createTable("appointment", (table) => {
        table.increments("id").primary();
        table.integer("tutor_id").notNullable();
        table.foreign("tutor_id").references("tutor.id");
        table.integer("student_id");
        table.foreign("student_id").references("user.id");
        table.integer("selected_subject");
        table.foreign("selected_subject").references("subjects.id");
        table.timestamp("start_time").notNullable();
        table.timestamp("end_time").notNullable();
        table.string("zoom_link").notNullable();
      })
      .then(() => {
        // Log success message
        console.log("Table 'appointment' created");
      });
  }
});

export default db;
