const UserModel = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET || "It's my secret key";

const cookieOptions = {
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:'Lax'
}

// Register User
exports.register = async(req, res)=>{
    try{
        let {name,mobileNumber,password,profilePic} = req.body;

        // check is user exist
        const isExist = await UserModel.findOne({mobileNumber});
        if(isExist){
            return res.status(409).json({error:"User already exist! Try another mobile number"})
        }

        // hashing password
        let hashedpassword = await bcrypt.hash(password,10);

        // Create and save new user
        const newUser = new UserModel({name, mobileNumber, password:hashedpassword, profilePic});
        await newUser.save();

        // Removing password before sending
        newUser.password=undefined;
        res.status(201).json({
            message:"User Registered Successfully..",
            newUser,
        })

    }catch(err){
        console.log("Register Error:", err);
        res.status(500).json({error: "Server Error! Please try again later."});
    }
}


// Login User
exports.login = async(req,res)=>{
    try{
        const {mobileNumber,password} = req.body;
        
        //check if user exist
        const userExist = await UserModel.findOne({mobileNumber});
        if(!userExist){
            return res.status(404).json({error:"User Not Found!!"});
        }

        // Verify password
        if(userExist && await bcrypt.compare(password,userExist.password)){

            const token = jwt.sign({userId:userExist._id},JWT_SECRET_KEY);
            res.cookie(
                "token",token,cookieOptions);

            userExist.password = undefined;

            res.status(200).json({
                message:"Login Successful",
                user:userExist
            })
        }else{
            return res.status(400).json({error:"Invalid credentials"});  
        }
    }catch(err){
        return res.status(500).json({error: "Server Error! Please try again later."});
    }
}


exports.searchMember = async(req,res)=>{
    try{
        let {queryParam} = req.query;

        const users = await UserModel.find({
            $and:[
                {_id:{$ne:req.user._id}},
                {
                    $or:[
                        {name:{$regex : new RegExp(`^${queryParam}`, 'i')}},
                        {mobileNumber:{$regex : new RegExp(`^${queryParam}`, 'i')}},

                    ]
                }
            ]
        }).select("-password");

        return res.status(201).json(users);
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: "Server Error! Please try again later." });
    }
}

// Logout user
exports.logout = async(req,res)=>{
    res.clearCookie('token',cookieOptions);
    return res.json({message:'Logged out successfully!'})
    
}