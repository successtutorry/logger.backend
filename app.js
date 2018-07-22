// this is the main page of our app


const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport  = require('passport');

require('./config/passport'); 



mongoose.Promise = global.Promise;

//database connection 

mongoose.connect('mongodb://root:root123@ds127781.mlab.com:27781/tutorplatform', { useNewUrlParser: true}, function(err){
	if(err){
		console.log(err);
	} else {
		console.log('Connected to the database');
	}
});



const app = express();

// middleware which logs all the details to the console
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
  cookie: { maxAge: 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
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

// to allow to pass the routes through these

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use((req, res, next) => {

  res.render('notFound');
});

app.listen(4000, () => console.log('Server started listening on port 4000!'));