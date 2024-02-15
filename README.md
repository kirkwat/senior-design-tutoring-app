# Senior Design S24 Tutoring App

## Frontend - React

### How to Run

- Run `npm install` to install dependencies.
- Run `npm run start` to start the React client.

## Backend - Express

### How to Run

- Run `npm install` to install dependencies.
- Run `npm run db:migrate` to create the local database using migrations.
- Run `npm run dev` to start the Express server.

### Migrations

- Run `npm run db:migrate:make -- MIGRATION_NAME` to create a database migration where `MIGRATION_NAME` is the name of your migration.

### API Routes

| Action | Method | Endpoint | Body | Description |
| --- | --- | --- | --- | --- |
| Register | POST | /register | `user` (string), `pwd` (string), `name` (string), `role` (`user` or `tutor`) | Creates a new user. |
| Login | POST | /auth | `user` (string), `pwd` (string) | Authenticates a user and returns JWT token. |
| Logout | GET | /logout |  | Logs out the current user. |
| Handle Refresh | GET | /refresh |  | Handles refresh token and provides new access token. |
| Create Appointment | POST | /appointment | `tutor_id` (number), `start` (string), `end` (string), `zoom_link` (string) | Creates a new appointment for a given tutor |
| Fetch Available Appointments | GET | /appointments?tutor_id |  | Fetches all of the available appointments for a tutor |
| Fetch Tutor | GET | /tutor?tutor_id |  | Finds and returns the information about the tutor given the tutor_id |
| Fetch Tutors | GET | /tutors |  | Retrieves all of the current tutors |
| Fetch Available Tutors for a Time | GET | /available-tutors?time |  | Finds all of the available tutors for a given start time |
| Fetch Available Tutors for the Day | GET | /available-tutors/day?time |  | Finds all of the available tutors for the entire day given any time of the day |
| Fetch Available Tutors for the Week | GET | /available-tutors/week?time |  | Finds all of the available tutors for the entire week (starting Sunday) given any time of any day in the week |
