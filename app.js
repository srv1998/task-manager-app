const express = require('express')
require('./mongoose')
const User= require('./models/user')
const userRoutes= require('./routes/user')
const taskRoutes= require('./routes/task')

const app= express()


app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)

//Default middleware...
app.use((req,res,next)=>{
   res.status(404).send('Page not found..') 
})

let port = process.env.PORT
app.listen(port,()=>console.log('port '+port+' up and running...'))

// const main=async()=>{
//     const user = await User.findById('5f917bd1214bba1f5cb06f6b')
//     //await user.populate('tasks')
//   //  console.log(user.tasks)// not working..
// }
// main()