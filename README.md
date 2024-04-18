# Senior Design S24 Tutoring App

## Transition Note

To run the project locally, follow the directions below. To deploy this project, it can be run on a virtual machine such an AWS EC2 instance. However, I do not recommend this as this is not scalable. For a proper deployment, I recommend using cloud object storage and a CDN such as AWS S3 and Cloudfront rather than storing images locally for storing the tutor's profile picture. I also recommend separating the frontend and backend to separate virtual machines (the frontend can actually deployed in S3/Cloudfront as well). Lastly, the database should be deployed on it's own with a service such as AWS RDS. This should not be a challenge as this project was made with these things in mind.

I have actually deployed a similar project with the same tech stack on AWS while following these guidelines. Here's the [source code with a write-up](https://github.com/kirkwat/mate-match) if you need an example. Also, here is the [documentation](https://developers.zoom.us/docs/integrations/) for setting up the Zoom integration.

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
- Run `npm run db:seed` to seed teh database with testing data.
- Run `npm run dev` to start the Express server.

### Database

- Run `npm run db:migrate:make -- MIGRATION_NAME` to create a database migration where `MIGRATION_NAME` is the name of your migration.
- Run `npm run db:seed:make -- SEED_NAME` to create a database seed file where `SEED_NAME` is the name of your seed file.

### API Routes

The API routes below can be tested using this [Postman collection](/backend/api.postman_collection.json) **(outdated)**.

| Action                          | Method | Endpoint                             | Body                                                                         | Description                                                           |
| ------------------------------- | ------ | ------------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Register                        | POST   | /register                            | `user` (string), `pwd` (string), `name` (string), `role` (`user` or `tutor`) | Creates a new user.                                                   |
| Login                           | POST   | /auth                                | `user` (string), `pwd` (string)                                              | Authenticates a user and returns JWT token.                           |
| Logout                          | GET    | /logout                              |                                                                              | Logs out the current user.                                            |
| Handle Refresh                  | GET    | /refresh                             |                                                                              | Handles refresh token and provides new access token.                  |
| Get Tutor By ID                 | GET    | /tutor/:tutorID                      |                                                                              | Gets tutor and their subjects.                                        |
| Get All Tutors                  | GET    | /tutor                               |                                                                              | Gets all tutors and their subjects.                                   |
| Edit Tutor Profile              | PUT    | /tutor/edit/:tutorID                 | `bio` (string), `name` (string), `subjects` (string[])                       | Edits a tutor's data and their subjects.                              |
| Update Tutor Profile Picture    | PUT    | /tutor/avatar/:tutorID               | `image file`                                                                 | Updates a tutor's profile picture.                                    |
| Get Tutor's Appointments        | GET    | /appointment/tutor/:tutorID          |                                                                              | Gets tutor's appointments and student data.                           |
| Get Students's Appointments     | GET    | /appointment/student/:studentID      |                                                                              | Gets student's appointments and tutor data.                           |
| Get Tutor's Availability Blocks | GET    | /appointment/available/:tutorID      |                                                                              | Gets tutor's open availability blocks.                                |
| Create Availibility Blocks      | POST   | /appointment/:tutorID                | `startDate` (string), `appointmentLength` (number), `weekSpan` (number)      | Creates tutor's availibilty blocks for possible appointments.         |
| Cancel Appointment              | PUT    | /appointment/cancel/:appointmentID   |                                                                              | Cancel's an appointment for student and tutor.                        |
| Schedule Appointment            | PUT    | /appointment/schedule/:appointmentID | `selectedSubject` (string), `studentID` (number)                             | Creates appointment and Zoom meeting using availibility block.        |
| Zoom OAuth                      | GET    | /zoom                                |                                                                              | Connects user with Zoom credentials.                                  |
| Get Tutor's Zoom Connection     | GET    | /zoom/connection/:tutorID            |                                                                              | Returns boolean value if tutor has connected with their Zoom account. |
