const express = require('express');
var cors = require('cors');
const connection=require('./connection');
const userRoute = require('./routes/user')
const app = express();


app.use(cors());
app.use(express.urlencoded({extended: true}));//?NC
app.use(express.json()); //?NC
app.use('/user',userRoute);

module.exports = app;