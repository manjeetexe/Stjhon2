const { Password } = require('@mui/icons-material')
const captainModel = require('./../Models/captainModel')

module.exports.createCaptain = async({
    firstname,lastname,email,password,
    
})=> {
    if(!firstname || !email ||  !password ) {
        throw new Error('All fields are required');
    }
    const captain = captainModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password,
        

    })

    return captain;

}
