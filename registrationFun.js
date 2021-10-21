const registerDB = require('./regDB');


module.exports = function registration(pool) {

    const regD = registerDB(pool);
    var condition;

    var pattern = /^[A-Z]{2}\s[0-9]{3}-[0-9]{3}$/

   

    async function pushRegister(input) {
        var validate = pattern.test(input)

        if (validate){
           var id = await regD.getID(input)
            if (id !== "not data") {
                
                await regD.setData(input, id)
                condition = " "
            }else{

                condition = "not data"
            }

        }else{

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



    function filterC() {
        let getFilter1 = list.filter(function (radio) {
            return radio.startsWith("CA");
        });

        return getFilter1;


    }

    function filterP() {
        let getFilter2 = list.filter(function (radio) {
            return radio.startsWith("CL");
        });

        return getFilter2;
    }

    function filterS() {
        let getFilter3 = list.filter(function (radio) {
            return radio.startsWith("CJ");


        });

        return getFilter3;

    }

    function filterA() {
        return list;

    }

    function getReg() {
        return list;
    }

    function conditional(list, radio) {

        if (list === "" && radio === "CA") {
            return "No registration numbers entered for Cape Town";
        }


        if (list === "" && radio === "CJ") {
            return "No registration numbers entered for Paarl";
        }

        if (list === "" && radio === "CL") {
            return "No registration numbers entered for Stellenbosch";

        }

        if (list === "" && radio === "All") {
            return "No Registration Numbers entered";

        }

    }


    return {
        pushRegister,
        getReg,
        conditional,
        filterC,
        filterP,
        filterS,
        filterA,
        getRegs,
        showRegs,
        gettingID,
        checkingRegNum,
        getCondition,
        resetting

    }
}