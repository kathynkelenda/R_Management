const express = require('express');
const connection = require('../connection');
const router = express.Router(); //Création du router
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');

//Inscription
router.post('/signUp', (req, res) => {
    let user = req.body;
    query = "select email, password,role,status from user_ where email=?"

    connexion.query(query, [user.email], (error, results) => {
        if (!error) {
            if (results.length <= 0) {
                //status ---> true:user is able to log in, false:user isn't able to log in
                query = "insert into user_(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (error, results) => {
                    if (!error) {
                        return res.status(200).json({ message: "successfully registerered" });
                    } else {
                        return res.status(500).json({ error });
                    }
                })
            } else {
                return res.status(400).json({ message: "Email already exist." })
            }
        } else {
            return res.status(500).json(error);
        }
    })

})

//Login
router.post('/login', (req, res) => {
    const user = req.body;
    query = "select email,password,role,status from user_ where email=?";

    connection.query(query, [user.email], (error, results) => {
        if (!error) {
            //email not find,dc non inscrit (result[0].length <= 0)
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect username or password" });
            } else if (results[0].status == 'false') {
                return res.status(401).json({ message: "Wait for admin approval" });
            } else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jsonwebtoken.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken })
            } else {
                return res.status(400).json({ message: "Something went wrong, try again later!" });
            }
        }
        else {
            return res.status(500).json({ error })
        }
    })
})



//Forget password : Create transporter
var transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD    
   }
});


router.post('/forgotPassword',(req,res)=>{
    const user = req.body;
    query = "select email,password from user_ where email=?"

    connection.query(query,[user.email],(error,results)=>{
        if(!error){
            /*L'email n'existe pas ds la bdd et pr ne pas pouvoir se rendre compte de l'exterieur
             qu'il en est ainsi, on écrit le message à l'utilisateur.*/
            if(results.length <=0){
                return res.status(200).json({message:"If you've this email adress, you'll receive a password"})
            }else{
                var mailOptions = {
                    from:process.env.EMAIL,
                    to:results[0].email,
                    subject:'Password send by R_Management',
                    html:'<p> <b>Your Login details for R_Management System</b><br><b>Email:</b>'+results[0].email
                    +'<br><b>Password: </b>'+results[0].password
                    +'<a href=" http://localhost:4200/ ">Click here to login</a> </p>'
                };

                transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Email sent'+ info.response);
                    }
                });
                return res.status(200).json({message:"Password send!"})
            }
        }else{
            return res.status(500).json({error})
        }
    })
})


module.exports = router;