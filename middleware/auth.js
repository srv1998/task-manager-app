const jwt= require('jsonwebtoken')
const User= require('../models/user')

const auth= async(req,res,next)=>{
    
    try{
        
        const token= req.headers['authorization'].replace('Bearer ','')
       
        const payload= jwt.verify(token,process.env.JWT_SECRET)
        //console.log(payload)
        const user= await User.findOne({_id:payload._id,'tokens.token':token})
        //console.log(user)
        if(!user)
         throw new Error()
         req.user= user
         req.token= token
        next()

    }catch(e){
        res.status(401).json({error:'not an authorized user!!'})
    }
}

module.exports= auth