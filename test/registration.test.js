'use strict';

const assert = require('assert');
const register = require('../registrationFun');
const pg = require("pg");
const Pool = pg.Pool;


let useSSL = false;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:moddy123@localhost:5432/registrationWeb';

const pool = new Pool({
    connectionString,
    ssl: useSSL

});

// DATABASE TEST
describe('The basic database registration app', function () {

    let regDatabase = register(pool);


    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("DELETE FROM registration_numbers;");
        // await pool.query("delete from categories;");
    });

    
    it('should be able to set registration numbers into Database', async function () {

        await regDatabase.pushRegister("CA 231-234");
        await regDatabase.pushRegister("CL 231-234");
        await regDatabase.pushRegister("CJ 231-234");
        await regDatabase.pushRegister("CA 231-234");

        var data = await regDatabase.getRegs()
        assert.equal(3, data.length);

    });

    it('should be able display registration numbers for Paarl', async function () {

        await regDatabase.pushRegister("CA 231-234");
        await regDatabase.pushRegister("CL 231-234");
        await regDatabase.pushRegister("CJ 231-234");
        await regDatabase.pushRegister("CA 231-234");

        var data = await regDatabase.gettingID("CL")
        assert.equal(1, data.length);

    });

    it('should be able display registration numbers Stellenbosch', async function () {

        await regDatabase.pushRegister("CA 231-234");
        await regDatabase.pushRegister("CL 231-234");
        await regDatabase.pushRegister("CJ 231-234");
        await regDatabase.pushRegister("CA 231-234");

        var data = await regDatabase.gettingID("CJ")
        assert.equal(1, data.length);

    });

    it('should be able display registration numbers Cape Town', async function () {

        await regDatabase.pushRegister("CA 231-234");
        await regDatabase.pushRegister("CL 231-234");
        await regDatabase.pushRegister("CJ 231-234");
        await regDatabase.pushRegister("CA 231-236");

        var data = await regDatabase.gettingID("CA")
        assert.equal(1, data.length);

    });



    it('should not duplicate registration numbers input', async function () {

        await regDatabase.pushRegister("CA 231-234");
        await regDatabase.pushRegister("Ca 231-234");
        await regDatabase.pushRegister("ca 231-234");
        await regDatabase.pushRegister("CA 231-234");

        var data = await regDatabase.getRegs()
        assert.equal(1, data.length);

    });

    it('should clear data in database', async function () {

        // input into database
        await regDatabase.pushRegister("CA 123-123");
        await regDatabase.pushRegister("CA 123-123");
        await regDatabase.pushRegister("CA 123-123");

        // clearing my database
        await regDatabase.resetting();


        var data = await regDatabase.getRegs()

        // return the index of zero
        assert.equal(0, data.length);

    });


    it('should return a registration number using the database', async function () {

        await regDatabase.pushRegister("CA 123-123");

        var data = "CA 123-123"
        

        let categories = await regDatabase.showRegs()
        var msg = categories.rows

        assert.deepEqual(data.rows, msg);
    });



    after(function () {
        pool.end();
    })

});

