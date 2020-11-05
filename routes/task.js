const express= require('express')
const router= express.Router()
const Task = require('../models/task')
const auth= require('../middleware/auth')

//Task routes...
router.post('/task',auth,async(req,res)=>{
    try{
      let task= new Task({
        ...req.body,
        author:req.user._id
      })

        task=await task.save()
       res.status(201).json({task})
    }catch(err){res.status(400).json(err)}
})

router.get('/tasks',auth,async(req,res)=>{
  try
  {
   
    let tasks={}
    let limit = req.query.limit?parseInt( req.query.limit):6
    let skip= req.query.skip?parseInt( req.query.skip):0
    let sort= req.query.sortBy?req.query.sortBy:'createdAt'
    let order= req.query.order?req.query.order:'desc'
    if(req.query.completed)
   {  
    let completed=  req.query.completed==='true'?true:false
     tasks=await Task.find({author:req.user._id,completed}).populate('author','name').limit(limit).skip(skip)
  }
  else{
    tasks=await Task.find({author:req.user._id}).populate('author','name').limit(limit).skip(skip).sort([[sort,order]])
  }
  
   if(!tasks)
    return res.status(404).json({message:'tasks not found'})
   res.status(200).json({tasks}) 
  }catch(err){res.status(500).json({err})}
})
router.get('/task/:id',auth,async(req,res)=>{
  const _id= req.params.id
  console.log(_id) 
     try{
     
       const task=  await Task.findOne({_id,author:req.user._id})
       if(!task)
        res.status(404).json({message:'task not found'})
       res.status(200).json({task}) 

     }catch(err){res.status(500).json({err})}
})
router.put('/update-task/:id',auth,async(req,res)=>{
  let updates=Object.keys(req.body)
  let shouldUpdate= ['desc','completed']
  const isValid= updates.every(update=>shouldUpdate.includes(update))
  if(!isValid)
   return res.status(400).json({error:'invalid fields for update'})
  try{
       let task= await Task.findOneAndUpdate({_id:req.params.id,author:req.user._id},req.body,{new:true,runValidators:true})
       if(!task){
         return res.status(404).json({error:'task not found'})
       }
       res.status(200).json({task})
  } catch(e){
    return res.status(500).json({e})
  }
})
router.delete('/delete-task/:id',auth,async(req,res)=>{
  try{
      let task= await Task.findOneAndDelete({_id:req.params.id,author:req.user._id})
      if(!task)
        return  res.status(404).json({error:'task not found'})
       res.status(200).json({task}) 
  }catch(e){
    return res.status(500).json({error:e})
  }
})

module.exports= router