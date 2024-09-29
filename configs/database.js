//Nhung monggoos

const mongoose = require('mongoose');
module.exports.connect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect database sucess!");
    }catch(error)
    {
        console.log("Connect Error!!");
    }
}