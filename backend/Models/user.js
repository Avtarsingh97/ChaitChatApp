const mongoose = require('mongoose');
 const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true,
    },
    mobileNumber:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
        minlength: [6, "Password must be at least 6 characters long"],
    },
    profilePic:{
        type:String,
        default: "https://www.gravatar.com/avatar/?d=mp",
    }
 },{timestamps:true});

 module.exports = mongoose.model("User", UserSchema);