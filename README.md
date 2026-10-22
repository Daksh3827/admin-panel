# Admin Panel — Student CRUD

A student management admin panel built with Express, EJS, MongoDB and Mongoose, with admin login through Passport.js.

All backend logic — the Mongoose model, the Passport strategy, the auth middleware and every route — lives in one `app.js` file. The pages are EJS templates in `views/` and the stylesheet is in `public/style.css`.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Login](#login)
- [Routes](#routes)
- [Student Fields](#student-fields)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- Admin login and logout with Passport.js and sessions
- Add, edit and delete student records
- Student list in a table with an avatar, name, email, course and phone
- Dashboard stat tile showing the total number of students
- Delete confirmation popup before a record is removed
- Flash messages after adding, updating and deleting a record
- Empty state shown when there are no students
- Sidebar navigation with an active-page indicator
- Responsive layout that stacks the sidebar on small screens

## Tech Stack

| Package | Version | Used for |
| --- | --- | --- |
| `express` | ^5.3.0 | Server and routing |
| `ejs` | ^7.0.1 | Page templates |
| `mongoose` | ^9.11.2 | MongoDB models |
| `passport` | ^0.7.0 | Login handling |
| `passport-local` | ^1.0.0 | Username / password strategy |
| `express-session` | ^1.19.0 | Keeps the admin logged in |
| `connect-flash` | ^0.1.1 | Success messages |
| `dotenv` | ^18.0.8 | Reads the `.env` file |
| `css` | — | All styling in `public/style.css` |

## Installation

**1. Install the dependencies**

```bash
npm install
```

**2. Make sure MongoDB is running** on port `27017`. The app uses the `adminDB` database and creates the collection automatically.

**3. Create your `.env` file**

Copy `.env.example` to `.env` and fill in your own values:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/adminDB
SESSION_SECRET=your secret key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Running the App

```bash
npm start
```

`npm run dev` does exactly the same thing — both scripts run `node app.js`.

Then open [http://localhost:3000](http://localhost:3000) in your browser. If you changed `PORT` in `.env`, use that port instead.

## Login

Use the admin username and password from your `.env` file. The values in the included `.env` are `admin` / `admin123`.

- Wrong credentials send you back to the login page.
- Every other page sits behind the `isLoggedIn` check, so a visitor who is not logged in is redirected to `/login`.

## Routes

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Redirects to `/students` |
| `GET` | `/login` | Public | Show the login page |
| `POST` | `/login` | Public | Check the admin credentials and log in |
| `POST` | `/logout` | Public | Log out and go back to the login page |
| `GET` | `/students` | Login required | Student list with the total-students tile |
| `GET` | `/students/add` | Login required | Show the add form |
| `POST` | `/students/add` | Login required | Save a new student |
| `GET` | `/students/edit/:id` | Login required | Show the edit form |
| `POST` | `/students/edit/:id` | Login required | Save the changes |
| `POST` | `/students/delete/:id` | Login required | Delete a student |

## Student Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | String | Yes | Shown with the first letter as an avatar |
| `email` | String | Yes | Saved in lowercase |
| `course` | String | No | Shown as a badge, or `—` when empty |
| `phone` | String | No | Shown as `—` when empty |

## Project Structure

```text
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

1. **Model** — `studentSchema` in `app.js` defines the student fields, and `Student` is the Mongoose model.
2. **Login** — a Passport local strategy compares the submitted details with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env`. The username is stored in the session.
3. **Protection** — `isLoggedIn` checks `req.isAuthenticated()` and redirects to `/login` when nobody is logged in.
4. **Messages** — `req.flash('success', ...)` runs after each write, and the message is printed in `header.ejs` above the page content.
5. **Pages** — `header.ejs` and `footer.ejs` are included by the other templates, so the sidebar and footer are written only once.

## Environment Variables

| Variable | What it is |
| --- | --- |
| `PORT` | Port the server runs on |
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret key used to sign the session cookie |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |

Keep `.env` out of version control. Use `.env.example` as the template on a new machine and never push real passwords.

## License

MIT — free to use and modify. Add a `LICENSE` file in the project root if you publish it.
