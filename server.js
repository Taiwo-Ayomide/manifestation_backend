const express = require("express");
const moongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require("./controller/auth")
const userRoute = require("./controller/users")
const examRoutes = require('./controller/exam.controller');

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());

moongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => {
        console.log("Error connection to the database", err)
    });


app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', examRoutes);


app.listen(5000, () => {
    console.log("Server running");
});