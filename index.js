"use strict";

let express = require('express');

const session = require('express-session');

let app = express();

const routes = require('./routes'); //import the routes


const exphbs = require('express-handlebars');

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: './views',
  layoutsDir: './views/layouts'
});

const bodyParser = require('body-parser');

// const helpers = require('handlebars-helpers')();


const cookieParser = require('cookie-parser');


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cookieParser('secret'));

app.use(session({
  secret: "<a string sessions in javaScript>",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: null },

}));

app.use((req, res, next) => {
  res.locals.message = req.session.message
  res.locals.messages = req.session.messages

  delete req.session.message
  delete req.session.messages
  next()
});


const pg = require('pg');
const Pool = pg.Pool;

// use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = { rejectUnauthorized: false }
}

// database connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:moddy123@localhost:5432/registrationWeb';

const pool = new Pool({
  connectionString,
  ssl: useSSL

});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

//routes

app.use('/', routes);

app.use('/addReg', routes);

app.use('/showReg', routes);

app.use('/clear', routes);

//start the server
let PORT = process.env.PORT || 3004;

app.listen(PORT, function () {
  console.log('App starting at port:', PORT);
});
