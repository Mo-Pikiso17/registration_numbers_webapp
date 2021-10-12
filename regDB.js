module.exports = function registrationDB(pool) {

    async function getID(input) {
        var startOfInput = input[0] + input[1]
        var id = await pool.query("SELECT * FROM towns WHERE regCode = $1", [startOfInput]);
        return await id.rows[0].townid
    }

    async function setData(input, id) {

        var check = await pool.query("SELECT regnumber FROM registration_numbers WHERE regnumber = $1", [input])
        if (check.rowCount < 1) {

            await pool.query("INSERT INTO registration_numbers (regnumber, parentid) VALUES ($1, $2)", [input, id]);
        }
    }

    async function getAddedReg(regs){

        var regs = await pool.query("SELECT * FROM registration_numbers")

        return await regs.rows
    }


    //displaying registration unique to each town
    async function showAddedReg(inputID){

       // The actual registration number with respect to town name
        return await pool.query("SELECT * FROM registration_numbers WHERE parentid = $1", [inputID])
    
    }

    async function seekExistance(regNum){

        // The actual registration number with respect to town name
        var check = await pool.query("SELECT regnumber FROM registration_numbers WHERE regnumber = $1", [regNum])
        
        return await check.rows
     }



    async function reset() {

        return await pool.query("DELETE FROM registration_numbers")
    }


    return {

        getID,
        setData,
        getAddedReg,
        showAddedReg,
        seekExistance,
        reset
    }
}
