if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport= require('passport')
const LocalStrategy= require('passport-local')
const User = require('./models/user');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(flash());

// Set EJS as the template engine and use ejs-mate for layouts
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files if any

app.use(passport.initialize());
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Importing routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const userRoutes = require('./routes/users');

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.use('/', userRoutes);
app.use('/campgrounds', campgrounds); // Use the campgrounds routes
app.use('/campgrounds/:id/reviews', reviews); // Use the reviews routes

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
