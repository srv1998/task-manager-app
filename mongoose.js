const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true
})



// let user= new User({
//     name:' ria',
//     email:'ravi@gmail.com ',
//     age:7,
//     password:'admfsword'
// })
// user.save().then(user=>console.log(user)).catch(err=>console.log(err))




// let task= new Task({
//     desc:'demo'
// })
// task.save().then(task=>console.log(task)).catch(err=>console.log(err))