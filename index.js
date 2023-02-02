const express = require('express');
const mongoose = require('mongoose');
const UserRouter = require("./Routes/user")
const TodoTask = require("./Models/TodoTask")
const dotenv = require("dotenv")
const cors = require('cors');
dotenv.config()
const app = express();
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 5000;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log(err);
})

app.use("/", UserRouter);
app.use("/", TodoTask)
app.get("*", (req, res) => {
    res.status(404).send("404 PAGE NOT FOUND")
})

app.listen(port, () => {
    console.log(`server is running at ${port}`);
})