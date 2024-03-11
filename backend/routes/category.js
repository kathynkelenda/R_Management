const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//Création d'une nouvelle catégorie
router.post('/add',auth.authenticateToken, checkRole.checkRole,(req,res,next)=>{
    let category = req.body;
    query = 'insert into category (name) values(?)';
    connection.query(query,[category.name],(err,results)=>{
        if(!error){
            return res.status(200).json({message:'Category added successfuly'})
        }else{
            return res.status(500).json(error);
        }
    })
})

//Read all
router.get('/get',auth.authenticateToken,(req,res,next)=>{
    var query = "select * from category order by name ";
    connection.query(query,(error,results)=>{
        if(!error){
            return res.status(200).json({results});
        }else{
            return res.status(500).json(error);
        }
    })
})

//Update
router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var query = "update category set name=? where id=?";
    connection.query(query,[product.name,product.id],(error,results)=>{
        if(!error){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Category id does not found"})
            }else{
                return res.status(200).json({message:"Category updated successfully"})
            }
        }else{
            return res.status(500).json(error)
        }
    })
})

module.exports = router;