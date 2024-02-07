const mongoose = require("mongoose")
const mongooseLocals = require("passport-local-mongoose")
const passport = require("passport");
const mongoSchema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
    }
})

userSchema.plugin(mongooseLocals);

module.exports = mongoose.model("User",userSchema);

