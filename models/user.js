const mongoose = require("mongoose")
const mongooseLocals = require("passport-local-mongoose")
const passport = require("passport");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
    },
    orders :[{
        type:Schema.Types.ObjectId,
        ref:"Listing"
    }]
})

userSchema.plugin(mongooseLocals);

module.exports = mongoose.model("User",userSchema);

