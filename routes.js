'use strict';

let express = require('express');
let router = express.Router();

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


//database factory function
const regDbLogic = require('./regDB');

const regFun = require('./registrationFun');

const registerFun = regFun(pool);

router.get('/', async function (req, res) {
    var id = req.session.users
    try {
  
      if (id) {
  
        var show = await registerFun.showRegs(id)
        
        res.render('index', { regs: show })
  
      } else {
  
        var regs = await registerFun.getRegs()
        res.render('index', { regs })
  
      }
  
    } catch (e) {
  
      console.log('Catch an error: ', e)
    }

  });
  
  router.post('/addReg', async function (req, res) {
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
          var con = await registerFun.getCondition()
          if (con == "not data") {

            req.session.message = {
              type: 'Invalid Input!',
              intro: 'Empty field',
              message: 'Please add a valid registration number i.e CA 123-123 or CJ 123-123 or CL 123-123!'
            }
            
          } else {

            req.session.messages = {
              types: 'SUCCESS!',
              intro: 'Empty field',
              messages: 'Registration number added!'
            }
            
          }
  
          res.redirect('/')
  
        }
  
  
      } catch (e) {

        req.session.message = {
          type: 'Invalid Input!',
          intro: 'Empty field',
          message: 'Please add a valid registration number i.e CA 123-123 or CJ 123-123 or CL 123-123!'
        }
        res.redirect('/')
  
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
  
  
  router.post('/showReg', async function (req, res) {
  
    var stored = req.body.townBtn
  
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
      // storing id in session, in order to check if it exists- filtering purpose
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
      res.redirect('/')
    }
  
  });
  
  
  router.get('/clear', async function (req, res) {
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

  module.exports = router; 
  
