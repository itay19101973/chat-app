var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var authenticationRoutes = require('./routes/authRoutes');
var chatRoutes = require('./routes/chatRoutes');
var messagesAPI = require('./routes/messagesAPI');
var app = express();

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



app.use('/', authenticationRoutes);
app.use('/chat', chatRoutes);
app.use('/messages-api', messagesAPI); //  json data

let port = process.env.PORT || 3000;
app.listen(port);
module.exports = app;
