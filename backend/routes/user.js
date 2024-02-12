const express = require('express');
const connexion = require('../connection');
const router = express.Router(); //Création du router

router.post('/signUp',(req,res) => {
    let user = req.body;
    query = "select email, password,role,status from user_ where email=?"

    connexion.query(query,[user.email],(error,results)=>{
        if(!error){
            if(results.length <=0){
                //status ---> true:user is able to log in, false:user isn't able to log in
                query = "insert into user_(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connexion.query(query,[user.name,user.contactNumber,user.email,user.password],(error,results)=>{
                    if(!error){
                        return res.status(200).json({message:"successfully registerered"});
                    }else{
                        return res.status(500).json({error});
                    }
                })
            }else{
                return res.status(400).json({message:"Email already exist."})
            }
        }else{
            return res.status(500).json(error);
        }
    })
    
})



module.exports = router;