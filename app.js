var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var authenticationRoutes = require('./routes/authRoutes');
var chatRoutes = require('./routes/chatRoutes');
var messagesAPI = require('./routes/messagesAPI');
var app = express();
const { syncDatabase } = require('./models');
const createError = require('http-errors');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret:"somesecretkey",

    resave: false, // Force save of session for each request
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {maxAge: 10*60*1000 } // milliseconds!
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Sync database

// In your app startup
syncDatabase().then(() => {
    console.log('Database ready');
});


app.use('/', authenticationRoutes);
app.use('/chat', chatRoutes);
app.use('/messages-api', messagesAPI); //  json data


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    console.error(err.stack);  // Log the error stack for debugging (optional in production)

    res.status(err.status || 500);
    if (err.status === 404) {
        res.render('404', { message: 'Page Not Found' });
    } else if (err.status === 400) {
        res.render('error', { message: 'Bad Request', error: err });
    } else {
        res.render('error', { message: 'Something went wrong!', error: err });
    }
});


let port = process.env.PORT || 3000;
app.listen(port);
module.exports = app;
