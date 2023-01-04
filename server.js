const express = require('express');
const app = express();
// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoute');
//middleware

app.use(cors());
app.use(bodyParser());
app.use(cookieParser());
app.use(expressValidator());

//routes
app.use('/api/', userRouter);

//db connection
mongoose.set('strictQuery', false);
mongoose.connect(
    process.env.DB_URL,
    {},
    () => {
        console.log('DB connection established');
    },
    (e) => console.log(e),
);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});
