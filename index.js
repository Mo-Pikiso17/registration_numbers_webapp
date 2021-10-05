"use strict";

let express = require('express');

let app = express();

const exphbs = require('express-handlebars');

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: './views',
  layoutsDir: './views/layouts'
});

const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const pg = require('pg');
const Pool = pg.Pool;

// use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = {rejectUnauthorized:false}
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
app.get('/', async function (req, res){
var regs = await registerFun.getRegs()
console.log(regs)
  res.render('index', {regs})
});

app.post('/addReg', async function (req, res){
var input = req.body.name
  await registerFun.pushRegister(input)
  res.redirect('/')
});

app.get('/clear', async function (req, res){
    await registerFun.resetting()
    res.redirect('/')
  });


//start the server
let PORT = process.env.PORT || 3004;

app.listen(PORT, function () {
  console.log('App starting at port:', PORT);
});
