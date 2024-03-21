# Senior Design S24 Tutoring App

## Frontend - React

### How to Run

- Create `.env` file based on the [example](/frontend/.env.example).
- Run `npm install` to install dependencies.
- Run `npm run start` to start the React client.

## Backend - Express

### How to Run

- Create `.env` file based on the [example](/backend/.env.example).
- Run `npm install` to install dependencies.
- Run `npm run db:migrate` to create the local database using migrations.
- Run `npm run dev` to start the Express server.

### Migrations

- Run `npm run db:migrate:make -- MIGRATION_NAME` to create a database migration where `MIGRATION_NAME` is the name of your migration.

### API Routes

The API routes below can be tested using this [Postman collection](/backend/api.postman_collection.json).

| Action | Method | Endpoint | Body | Description |
| --- | --- | --- | --- | --- |
| Register | POST | /register | `user` (string), `pwd` (string), `name` (string), `role` (`user` or `tutor`) | Creates a new user. |
| Login | POST | /auth | `user` (string), `pwd` (string) | Authenticates a user and returns JWT token. |
| Logout | GET | /logout |  | Logs out the current user. |
| Handle Refresh | GET | /refresh |  | Handles refresh token and provides new access token. |
| Create Appointment | POST | /appointment | `tutor_id` (number), `start` (string), `end` (string), `zoom_link` (string) | Creates a new appointment for a given tutor |
| Check if Appointment is Available | GET | /appointment/available?day&tutor_id |  | Returns true if the appointment for the specified tutor at the specified time is available |
| Fetch Available Appointments | GET | /appointment?tutor_id |  | Fetches all of the available appointments for a tutor |
| Fetch a Students Appointments | GET | /appointment/student?student_id |  | Finds all of a students current appointments they have signed up for |
| Register for Appointment | PUT | /appointment?appointment_id | `student_id` (number), `selected_subject` (number) | Registers a student under an appointment with a selected subject to be tutored on |
| Fetch Tutor | GET | /tutor/:tutorID |  | Finds and returns the information about the tutor given the tutorID |
| Fetch Tutors | GET | /tutor |  | Retrieves all of the current tutors |
| Fetch Available Tutors for a Time | GET | /tutor/available?time |  | Finds all of the available tutors for a given start time |
| Fetch Available Tutors for the Day | GET | /tutor/available/day?time |  | Finds all of the available tutors for the entire day given any time of the day |
| Fetch Available Tutors for the Week | GET | /tutor/available/week?time |  | Finds all of the available tutors for the entire week (starting Sunday) given any time of any day in the week |
| Fetch a student | GET | /student/:studentID |  | Finds and returns the information about a student given the students user id |
| Update student profile | PUT | /student/profile/:studentID | `profile_picture` (number) | Updates the profile for a student given the students user id and the information (body) to update|
| Update tutor profile | PUT | /tutor/profile/:tutorID | `profile_picture` (number), `bio` (string), `subjects` (string[]) | Updates the profile for a tutor given the tutor id and the information (body) to update|