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
  var id = req.session.userid

  if (id) {

    var show = await registerFun.showRegs(id)

    if(show.length == 0) {

      req.session.message = {
        type: 'ERROR!',
        intro: 'Empty field',
        message: 'No Registration Numbers entered for this town!'
      }
    }
// console.log(show)
      res.render('index', { regs:show })


    // }else{
    //   res.render('index', { regs: show })

    // }


  } else {

    var regs = await registerFun.getRegs()

    // var len = regs.length
    if (len == 0) {

      req.session.message = {
        type: 'ERROR!',
        intro: 'Empty field',
        message: 'No Registration Numbers entered!'
      }
    }
    //   console.log(regs)

      res.render('index', { regs })


    // }else{
    //   res.render('index', { regs })

    // }


  }


});

app.post('/addReg', async function (req, res) {
  var input = req.body.name
  var checkingRegs = await registerFun.checkingRegNum(input)
  // await registerFun.pushRegister(input)
  req.session.userid = null

  if (checkingRegs.length > 0) {

    req.session.message = {
      type: 'ERROR!',
      intro: 'Empty field',
      message: 'Registration Number Already Exists!'
    }

    res.redirect('/')


  } else {

    await registerFun.pushRegister(input)

    req.session.messages = {
      types: 'SUCCESS!',
      intro: 'Empty field',
      messages: 'Registration number added!'
    }

    res.redirect('/')


  }

});

app.post('/showReg', async function (req, res) {
  var stored = req.body.townBtn


  if (stored == "All") {
    // no id stored and equates to null
    req.session.userid = null
    res.redirect('/')

  }
  
  
  else {

    var id = await registerFun.gettingID(stored)

    // storing id in session, in order to check if it exists- filtering purpose
    req.session.userid = id
    console.log(req.session.userid)

    res.redirect('/')

  }

  // if (stored == "") {

  //   req.session.message = {
  //     type: 'ERROR!',
  //     intro: 'Empty field',
  //     message: 'No Registration Numbers entered!'
  //   }
  //   res.redirect('/');

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
