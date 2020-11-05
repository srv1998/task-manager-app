const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task= require('./task')


let userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
       
        validate(value){
            if(value.length<3)
             throw new Error('length must b 3 or greater!!')
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
             throw new Error('invalid Email!!')
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0)
            throw new Error('value must be positive')
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(value.length<6)
               throw new Error('min length should be 6')
            if(value.includes('password'))
            throw new Error('must not include "password" ')
        }     
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    avatar:{
        type:Buffer
    }
},{timestamps:true})
//setting Virtual field tasks in User model ...means tasks physically dont exists in User rather it only shows relation b/w User and Task..
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'author'
})

//toJSON is keyword and donot need to be invoked or declared inside router it gets called automatically on Model instance
userSchema.methods.toJSON=function(){
   const user=this
   let userObject = user.toObject()
   delete userObject.password
   delete userObject.tokens
   delete userObject.avatar
   return userObject 
}


//methods are functions that are model instance specific .. i.e they are called for particular instance of Model.
userSchema.methods.getToken= async function(){
    let user= this
   const token= jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
//    console.log(token)
  user.tokens=user.tokens.concat({token})
  await user.save()
   return token
    
}
// statics is used for functions that are Model specific .. i.e they are called using Model name. 
userSchema.statics.authenticate= async function(email,password){ 
    let user= await User.findOne({email})
    //console.log('auth:'+user)
   
    if(!user)
     {
       
         throw new Error('Kindly Singup first!!')
     }
     //console.log(password,user.password)
    let valid= await bcrypt.compare(password,user.password)
    console.log(valid)
    if(!valid)
     throw new Error('email and password doesnot match!!')
    return user   
}

userSchema.pre('save',async function(next){
    let user= this
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)
    }
    //console.log('pre')
    next()
})
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({author:user._id})
    next()
})


let User= mongoose.model('User',userSchema)

module.exports=User