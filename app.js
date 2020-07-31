const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressHbs= require('express-handlebars');
const favicon = require('serve-favicon');
const handlebarsStatic = require('handlebars-static');
const express_handlebars_sections = require('express-handlebars-sections');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

require('./passport')(passport);

// mongoose.connect('mongodb+srv://edcnssce:Entrepreneurship@NSSCE@edcnssce-kaboq.mongodb.net/dbedc', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// });
mongoose.connect('mongodb://localhost:27017/dbedc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const auth = require('./routes/auth/auth')(passport);


var app = express();

app.use(session({
  secret: 'happy dog',
  saveUninitialized: false,
  resave: false
}));

app.use(flash());

//view partials setup

// view engine setup
app.engine(
  'hbs',
  expressHbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
      static: handlebarsStatic(`http://${process.env.HOST_ADDR || 'localhost'}:${process.env.PORT || '3000'}/`),
      section: express_handlebars_sections(),
      comparing: function comp(a,b,c){
                if (a==b || a==c)
                {return true}
                else
                {return false}

              }
    },
  })
);

// view engine setup
app.engine('hbs',expressHbs(
  {extname:'hbs',defaultLayout: 'layout', 
  layoutsDir:__dirname + '/views/layouts'
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','assets','favicon.ico')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("404");
  return res.render('pages/error/error',{code:'404',message:'Page not found',layout:false});
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.render('pages/error/error',{code:'500',message:'Internal Server Error',layout:false});
});

module.exports = app;
