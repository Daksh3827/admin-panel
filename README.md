# Admin Panel — Student CRUD

A student management admin panel built with Express, EJS, MongoDB and Mongoose. A single admin logs in with Passport.js and manages student records from a sidebar dashboard.

All backend logic — the Mongoose model, the Passport strategy, the auth middleware and every route — lives in one `app.js` file. The pages are EJS templates in `views/` and the stylesheet is in `public/style.css`.

## Features

- Admin login and logout with Passport.js and sessions
- Add, edit and delete student records
- Student list shown in a table with an  name, email, course and phone
- Delete confirmation popup before a record is removed
- Flash messages after adding, updating and deleting a record
- Empty state shown when there are no students
- Sidebar navigation with an active-page indicator
- Responsive layout that stacks the sidebar on small screens

## Installation

Install the dependencies:

```
npm install
```

Make sure MongoDB is running on port `27017`. The app uses the `adminDB` database and creates the collection automatically.

Copy `.env.example` to `.env` and fill in your own values:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/adminDB
SESSION_SECRET=your secret key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

## Run the Application

```
npm start
```

`npm run dev` does the same thing — both run `node app.js`.

Open [http://localhost:3000](http://localhost:3000) in your browser. If you changed `PORT` in `.env`, use that port instead.

### Login

Use the admin username and password from your `.env` file. The values in the included `.env` are `admin` / `admin`.

Wrong credentials send you back to the login page. Every other page is behind the `isLoggedIn` check, so a visitor who is not logged in is redirected to `/login`.

## Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Redirects to `/students` |
| GET | `/login` | Show the login page |
| POST | `/login` | Check the admin credentials and log in |
| POST | `/logout` | Log out and go back to the login page |
| GET | `/students` | Student list with the total-students tile |
| GET | `/students/add` | Show the add form |
| POST | `/students/add` | Save a new student |
| GET | `/students/edit/:id` | Show the edit form |
| POST | `/students/edit/:id` | Save the changes |
| POST | `/students/delete/:id` | Delete a student |

## Student Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| name | String | Yes | Shown with the first letter as an avatar |
| email | String | Yes | Saved in lowercase |
| course | String | No | Shown as a badge, or `—` when empty |
| phone | String | No | Shown as `—` when empty |

## Project Structure

```
admin-panel/
├── views/
│   ├── header.ejs      sidebar, navigation and flash message
│   ├── footer.ejs      page footer
│   ├── login.ejs       login card
│   ├── students.ejs    student list, stat tile and table
│   ├── add.ejs         add form
│   └── edit.ejs        edit form
├── public/
│   └── style.css       all the styling
├── .env                your local settings (not in git)
├── .env.example        template for the .env file
├── .gitignore
├── app.js              server, model, auth and all routes
├── package.json
├── package-lock.json
└── README.md
```

## How It Works

- **Model** — `studentSchema` in `app.js` defines the student fields, and `Student` is the Mongoose model.
- **Login** — a Passport local strategy compares the submitted details with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env`. The username is stored in the session.
- **Protection** — `isLoggedIn` checks `req.isAuthenticated()` and redirects to `/login` when nobody is logged in.
- **Messages** — `req.flash('success', ...)` after each write, and the message is printed in `header.ejs` above the page content.
- **Pages** — `header.ejs` and `footer.ejs` are included by the other templates, so the sidebar and footer only need to be written once.

## Environment Variables

| Variable | What it is |
| --- | --- |
| PORT | Port the server runs on |
| MONGO_URI | MongoDB connection string |
| SESSION_SECRET | Secret key used to sign the session cookie |
| ADMIN_USERNAME | Admin login username |
| ADMIN_PASSWORD | Admin login password |
