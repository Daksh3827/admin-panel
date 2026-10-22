require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const flash = require('connect-flash');

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// keep the user logged in between pages
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// send user and messages to every page
app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.messages = req.flash();
    next();
});

// student data
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    course: String,
    phone: String
});

const Student = mongoose.model('Student', studentSchema);

// admin login check
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

passport.use(new localStrategy(
    { usernameField: 'username', passwordField: 'password' },
    function (username, password, done) {
        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            return done(null, false);
        }
        return done(null, { id: 1, username: ADMIN_USERNAME });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    done(null, { id: 1, username: username });
});

// only logged in users can open these pages
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

// login page
app.get('/login', function (req, res) {
    res.render('login');
});

// check username and password
app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), function (req, res) {
    res.redirect('/students');
});

// logout
app.post('/logout', function (req, res) {
    req.logout(function () {
        res.redirect('/login');
    });
});

app.get('/', function (req, res) {
    res.redirect('/students');
});

// student list page
app.get('/students', isLoggedIn, async function (req, res) {
    const students = await Student.find().sort({ name: 1 });

    // number of students shown in the stat card
    res.render('students', {
        students: students,
        stats: {
            total: students.length
        }
    });
});

// add student form
app.get('/students/add', isLoggedIn, function (req, res) {
    res.render('add', { student: {} });
});

// save new student
app.post('/students/add', isLoggedIn, async function (req, res) {
    const student = new Student(req.body);
    const saved = await student.save();
    req.flash('success', saved.name + ' was added');
    res.redirect('/students');
});

// edit student form
app.get('/students/edit/:id', isLoggedIn, async function (req, res) {
    const student = await Student.findOne({ _id: req.params.id });
    res.render('edit', { student: student });
});

// save changes
app.post('/students/edit/:id', isLoggedIn, async function (req, res) {
    await Student.updateOne({ _id: req.params.id }, req.body);
    req.flash('success', 'Student was updated');
    res.redirect('/students');
});

// delete student
app.post('/students/delete/:id', isLoggedIn, async function (req, res) {
    const student = await Student.findOne({ _id: req.params.id });
    if (student) {
        await Student.deleteOne({ _id: req.params.id });
        req.flash('success', student.name + ' was deleted');
    }
    res.redirect('/students');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Server running on http://localhost:' + PORT);
});
