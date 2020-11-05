const express= require('express')
const router= express.Router()
const User = require('../models/user')
const auth= require('../middleware/auth')
const multer = require('multer') // for file uploads..
const sharp= require('sharp')
const { welcomeMail,cancelMail } = require('../emails/sendgrid')

const upload= multer({
  'limits':{
    'fileSize':1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
     return cb(new Error('Only JPG,JPEG,PNG allowed!!'))
    cb(undefined,true) 
  }
})
// User routes...
router.post('/user', async(req,res)=>{
    try
    { 
     console.log(req.body.email) 
     let user= await User.findOne({email:req.body.email})
     //console.log(user)
      if(user)
       return res.status(400).json({error:'user with given email already exists!!'}) 
      user= new User(req.body)
      user=await user.save()
      const token = await user.getToken()
      welcomeMail(user.email,user.name)
    res.status(201).json({user,token})
  }catch(e){res.status(400).json(e)}
})


router.post('/signin',async(req,res)=>{
  let {email,password} = req.body
  try{
  let user= await User.authenticate(email,password)
  const token=await user.getToken()
 // console.log(req)
   res.json({user,token})
  }catch(e){
    return res.status(400).json({error:"kindly check email and password"})
  }

})

router.get('/logout',auth,async(req,res)=>{
  try{
        req.user.tokens=  req.user.tokens.filter(token=>token.token!=req.token)
         await req.user.save()
         res.json('logged out successfully!!')
  }catch(e){
    res.status(500).send('cannot logout!!')
  }
})

router.get('/logout-all',auth,async(req,res)=>{
  try{
        req.user.tokens= []
         await req.user.save()
         res.json('logged out All successfully!!')
  }catch(e){
    res.status(500).send('cannot logout!!')
  }
})

router.get('/user/me',auth,async(req,res)=>{
  try{
  res.status(200).json(req.user) 
}catch(err){res.status(500).json(err)}
})
router.get('/user/:id',async(req,res)=>{
const id=req.params.id
try{
  const user=await User.findById(id)
  if(!user)
    return res.status(404).json({error:'user not found'})
    res.status(200).json({user}) 
}catch(err){res.status(500).json(err)}})

router.put('/update-user/me',auth,async(req,res)=>{
  let updates= Object.keys(req.body)
  let shouldUpdate=['name','email','age','password']
  
  const isValid= updates.every(update=>shouldUpdate.includes(update))
  console.log(isValid)
  if(!isValid)
   return res.status(400).json('invalid fields for update') 
  try{
    let user =req.user
    updates.forEach(update=>user[update]=req.body[update]) 
    user= await user.save()
    res.status(200).json({user})
  }catch(e){
   return res.status(500).json(e)
  }
})


router.delete('/delete-user/me',auth,async(req,res)=>{
  try{
       const name= req.user.name
       const email= req.user.email
       await req.user.remove()
       cancelMail(name,email)
       res.status(200).json('user removed succcessdully') 
  }catch(e){
    return res.status(500).json({error:e})
  }
})


router.post('/user/me/avatar',auth,upload.single('avatar'), async (req,res)=>{
  try{
     let buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
     req.user.avatar=buffer
     await req.user.save()
     res.send(req.user)
  }catch(e){ res.json(500).send(e)}
},(err,req,res,next)=>{
  res.status(400).json({error:err.message})
})
router.delete('/user/me/avatar',auth,async (req,res)=>{
  try{
     req.user.avatar=undefined
     await req.user.save()
     res.json(req.user)
  }catch(e){
    res.status(500).json(e)
  }
})
router.get('/user/:id/avatar',async (req,res)=>{
  try{
      const user= await User.findById(req.params.id)
      if(!user || !user.avatar)
       throw new Error('user  not found')  
      res.set('content-type','image/png')  // By default content-type is 'application/json'
      res.send(user.avatar) 
  }catch(e){res.status(500).json(e)}
})
module.exports= router