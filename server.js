const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 5000;
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoute');
//middleware

app.use(cors());
app.use(bodyParser());

app.use('/api/', userRouter);
//db connection
// mongoose.set('strictQuery', false);
mongoose.connect(
    process.env.DB_URL,
    {},
    () => {
        console.log('DB connection established');
    },
    (e) => console.log(e),
);

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
