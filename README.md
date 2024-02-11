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

- Run `db:migrate:make -- MIGRATION_NAME` to create a database migration where `MIGRATION_NAME` is the name of your migration.

### API Routes

| Action         | Method | Endpoint  | Body                                                                         | Description                                          |
| -------------- | ------ | --------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| Login          | POST   | /auth     | `user` (string), `pwd` (string)                                              | Authenticates a user and returns JWT token.          |
| Logout         | GET    | /logout   |                                                                              | Logs out the current user.                           |
| Handle Refresh | GET    | /refresh  |                                                                              | Handles refresh token and provides new access token. |
| Register       | POST   | /register | `user` (string), `pwd` (string), `name` (string), `role` (`user` or `tutor`) | Creates a new user.                                  |
