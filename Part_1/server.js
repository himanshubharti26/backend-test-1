const express = require('express');
const router = require('./routes');
const app = express();

const PORT = process.env.PORT || 9000;


app.use((req,res,next)=>{
    console.log(req.method, req.url, new Date().toLocaleDateString());
    next();
})

app.use('/api',router);

app.listen(PORT,()=>{
    console.log("server is running on port:",PORT);
})