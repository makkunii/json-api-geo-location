const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


//create express app
const app = express();

//Database

mongoose.connect('');

const  db = mongoose.connection;

db.once('open', () => {
    console.log("Connected to MongoDB database...");
});
 

//middleware
app.use(bodyParser.json());


//routes
app.get('/', (req, res) => {
    res.send("hello, world")
});

const UsersRoute = require('./routes/Users');
app.use('/users', UsersRoute)



//starting server
app.listen(3000, console.log('on port 3000'))


