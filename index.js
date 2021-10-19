"use strict";

let express = require('express');

const session = require('express-session');

let app = express();

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

const regFun = require('./registrationFun'); //import the routes

const registerFun = regFun(pool);


app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

//routes
app.get('/', async function (req, res) {
  var id = req.session.users
  try {

    if (id) {

      var show = await registerFun.showRegs(id)
      console.log(show.length)

      // res.render('index', { regs: show })

      // if (true) {

      //   req.session.message = {
      //     type: 'ERROR!',
      //     intro: 'Empty field',
      //     message: 'No Registration Numbers entered for this town!'
      //   }
      // }
      res.render('index', { regs: show })

    } else {

      var regs = await registerFun.getRegs()
      res.render('index', { regs })


    }

  } catch (e) {

    console.log('Catch an error: ', e)
  }



});

app.post('/addReg', async function (req, res) {
  var input = req.body.name

  if (input) {

    var upper = (input[0] + input[1]).toUpperCase()
    var fullInput = upper

    for (let index = 0; index < input.length; index++) {
      if (index == 0 || index == 1) {
      } else {

        fullInput = fullInput + input[index];
      }

    }
    console.log(fullInput)
    var checkingRegs = await registerFun.checkingRegNum(fullInput)
    // await registerFun.pushRegister(input)
    req.session.users = null

    try {

      if (checkingRegs.length > 0) {

        req.session.message = {
          type: 'ERROR!',
          intro: 'Empty field',
          message: 'Registration Number Already Exists!'
        }

        res.redirect('/')


      } else {

        await registerFun.pushRegister(fullInput)

        req.session.messages = {
          types: 'SUCCESS!',
          intro: 'Empty field',
          messages: 'Registration number added!'
        }

        res.redirect('/')

      }


    } catch (e) {

      console.log('Catch an error: ', e)
    }

  } else {

    req.session.message = {
      type: 'ERROR!',
      intro: 'Empty field',
      message: 'Invalid Input!'
    }

    res.redirect('/')

  }

});


app.post('/showReg', async function (req, res) {

  var stored = req.body.townBtn


  // try {


  if (stored == "All") {
    // storing id in session, in order to check if it exists- filtering purpose
    // no id stored and equates to null
    req.session.users = null
    var reg = await registerFun.getRegs()

    if (reg.length === 0) {

      req.session.message = {
        type: 'ERROR!',
        intro: 'Empty field',
        message: 'No Registration Numbers entered!'
      }
    }
    res.redirect('/')

  } else {
    var id = await registerFun.gettingID(stored)
    // // storing id in session, in order to check if it exists- filtering purpose
    var userid = id

    req.session.users = userid;

    var show = await registerFun.showRegs(id)

    if (show.length == 0) {

      req.session.message = {
        type: 'ERROR!',
        intro: 'Empty field',
        message: 'No Registration Numbers entered for this town!'
      }
    }
    // console.log(id)
    res.redirect('/')
  }

  // } 

  // catch (e) {
  //   console.log('Catch an error: ', e)
  // }

});


app.get('/clear', async function (req, res) {
  req.session.userid = null

  try {
    await registerFun.resetting()
    req.session.messages = {
      types: 'SUCCESS!',
      intro: 'Empty field',
      messages: 'Page Reloaded!'
    }
    res.redirect('/')

  } catch (e) {

    console.log('Catch an error: ', e)
  }
});


//start the server
let PORT = process.env.PORT || 3004;

app.listen(PORT, function () {
  console.log('App starting at port:', PORT);
});
