const express = require('express')
const db = require('./database')
const app = express()
const port = 3000
const cars = require('./routes/cars');
const home = require('./routes/home');

//Middleware: must precede routes in order to work as expected. 
app.use(express.json());
app.use(express.urlencoded({extended: false})); //Parse URL-encoded bodies

app.use('/', home);
app.use('/cars', cars);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))