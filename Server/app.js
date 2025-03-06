const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDB = require('./Database/DB');
const cookieParser = require('cookie-parser');
const userRoute = require('./Routes/user.route');
const captainRoute = require('./Routes/captain.route');
const messageRoute = require('./Routes/message.route');






connectToDB();
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/users', userRoute);
app.use('/captains', captainRoute);
app.use('/api', messageRoute);

module.exports = app;