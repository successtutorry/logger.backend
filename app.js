const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport  = require('passport');
const http = require('http');
const requestIp = require('request-ip');
const where = require('node-where');
const iplocation = require('iplocation');
const flash = require('connect-flash');
const session = require('express-session');
require('./config/passport');

mongoose.Promise = global.Promise;

//database connection
mongoose.connect('mongodb://root:root123@ds251362.mlab.com:51362/tutorry', { useNewUrlParser: true}, function(err){
  if(err){
    console.log(err);
  } else {
    console.log('Connected to the database');
  }
});

const app = express();
app.use(morgan('dev'));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: { maxAge: 600000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false,
  //store: new mongoStore({ mongooseConnection: mongoose.connection}),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// new middleware
app.use((req, res, next) => {

  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  res.locals.isAuthenticated = req.user ? true: false;
  next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
// catch 404 and forward to error handler
app.use((req, res, next) => {

  res.render('notFound');
});

app.listen(4000, () => console.log('Server started listening on port 4000!'));
