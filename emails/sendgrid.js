const sgMail= require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to:'srvdhiman1998@gmail.com',
//     from:'srvdhiman1998@gmail.com',
//     subject:'task-app-mail',
//     html:'<h1>This is first Mail</h1>'  
// })
// .then(res=>console.log(res)).catch(err=>console.log(err))

const welcomeMail= (email,name)=>{
    sgMail.send({
        to:email,
        from:'srvdhiman1998@gmail.com',
        subject:'welcome',
        html:`<h1>Welcome ${name}. your account has been created..</h1>` 
    })
}
const cancelMail=(name,email)=>{
    sgMail.send({
          to:email,
          from:'srvdhiman1998@gmail.com',
          subject:'Account Cancellation',
          html:`<h1><strong>${name} we have deleted your account.</strong> We Would love to hear the reason for cancellation from you.</h1>`
    })
}
module.exports={
    welcomeMail,
    cancelMail
}