const express = require('express');
const app = express();
const PORT = 5005;
const router  = require('./router');
const connectDB  = require('./db');

const cors = require('cors');

connectDB();
app.use(cors({
    origin:'*'
}))

app.use('/api',router);

app.listen(PORT,()=>{
    console.log("server is running on port:",PORT);
})

module.exports = app;