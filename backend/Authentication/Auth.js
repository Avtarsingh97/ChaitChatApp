const UserModel = require("../Models/user");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const auth = async(req,res,next)=>{
    const token = req.cookies.token;
    
    if(!token){
        return res.status(401).json({error:"No token, authorization denied!"});
    }
    
    try{
        const decode= jwt.verify(token,process.env.JWT_SECRET);
       
        let loggedInUserId = decode.userId;
        req.user = await UserModel.findById(loggedInUserId).select("-password");
        next();
    }catch(err){
        return res.status(401).json({error:"Token is not valid!"});
    }
}

module.exports = auth;