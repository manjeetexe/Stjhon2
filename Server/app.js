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
const chaptainMessageRoute = require('./Routes/captainmessage.route')






connectToDB();
app.use(cors({
  origin: "http://localhost:5173", // Replace with frontend URL
  credentials: true,  // ✅ Allow cookies
}));
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
app.use('/api', chaptainMessageRoute);

module.exports = app;