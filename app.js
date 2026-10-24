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

app.use(session({
    secret: process.env.SESSION_SECRET || "mySecretKey123456",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.messages = req.flash();
    next();
});

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    course: String,
    phone: String
});

const Student = mongoose.model('Student', studentSchema);

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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), function (req, res) {
    res.redirect('/students');
});

app.post('/logout', function (req, res) {
    req.logout(function () {
        res.redirect('/login');
    });
});

app.get('/', function (req, res) {
    res.redirect('/students');
});

app.get('/students', isLoggedIn, async function (req, res) {
    const students = await Student.find().sort({ name: 1 });

    res.render('students', {
        students: students,
        stats: {
            total: students.length
        }
    });
});

app.get('/students/add', isLoggedIn, function (req, res) {
    res.render('add', { student: {} });
});

app.post('/students/add', isLoggedIn, async function (req, res) {
    const student = new Student(req.body);
    const saved = await student.save();
    req.flash('success', saved.name + ' was added');
    res.redirect('/students');
});

app.get('/students/edit/:id', isLoggedIn, async function (req, res) {
    const student = await Student.findOne({ _id: req.params.id });
    res.render('edit', { student: student });
});

app.post('/students/edit/:id', isLoggedIn, async function (req, res) {
    await Student.updateOne({ _id: req.params.id }, req.body);
    req.flash('success', 'Student was updated');
    res.redirect('/students');
});

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
