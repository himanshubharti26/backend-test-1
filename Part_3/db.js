const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async()=>{
    try{
        const url = process.env.DATABASE_URL;
        console.log("url ==>", url);
        const conn = await mongoose.connect(url,{ useUnifiedTopology:true, useNewUrlParser:true});
        console.log("DB connected successfully:", conn.connection.host);
        return conn;
    }catch(err){
        console.log("Error:",err.message);
        process.exit();
    }
}

module.exports = connectDB;