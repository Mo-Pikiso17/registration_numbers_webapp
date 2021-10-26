const registerDB = require('./regDB');


module.exports = function registration(pool) {

    const regD = registerDB(pool);
    var condition;

    var pattern = /^[CcAa]{2}\s[0-9]{3}-[0-9]{3}$/
    var pattern1 = /^[CcLl]{2}\s[0-9]{3}-[0-9]{3}$/
    var pattern2 = /^[CcJj]{2}\s[0-9]{3}-[0-9]{3}$/

    async function pushRegister(input) {
        var validate = pattern.test(input)
        var validate1 = pattern1.test(input)
        var validate2 = pattern2.test(input)

        if (validate){
           var id = await regD.getID(input)
            if (id !== "not data") {
                
                await regD.setData(input, id)
                condition = " "
            }else{

                condition = "not data"
            }

        }

        if (validate1){
            var id = await regD.getID(input)
             if (id !== "not data") {
                 
                 await regD.setData(input, id)
                 condition = " "
             }else{
 
                 condition = "not data"
             }
 
        }

        if (validate2){
            var id = await regD.getID(input)
             if (id !== "not data") {
                 
                 await regD.setData(input, id)
                 condition = " "
             }else{
 
                 condition = "not data"
             }
 
        }
        
        
        else{

            return "please a valid registration number"
        }

    }

    async function getCondition(){
         return condition
    }

    async function getRegs(){
        return (await regD.getAddedReg())
    }

    async function showRegs(id){

        return (await regD.showAddedReg(id)).rows

    }

    async function gettingID(regCode){

        return (await regD.getID(regCode))

    }

    async function checkingRegNum(regCode){

        return (await regD.seekExistance(regCode))

    }

    
    async function resetting(){
        return await regD.reset()
    }

    return {
        pushRegister,
        getRegs,
        showRegs,
        gettingID,
        checkingRegNum,
        getCondition,
        resetting

    }
}