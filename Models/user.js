const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }

})
const userModel = new mongoose.model("user", userSchema)
module.exports = userModel;