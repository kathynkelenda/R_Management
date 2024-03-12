const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//Création d'un produit
router.post('/add',auth.authenticateToken, checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var query = "insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(query,[product.name,product.categoryId,product.description,product.price],(error,results)=>{
        if(!error){
            return res.status(200).json({message:"Product add successfully"});
        }else{
            return res.status(500).json(error);
        }
    })
})

//Read all
router.get('/get',auth.authenticateToken,(req,res,next)=>{
    var query = "select p.id,p.name,p.description,p.status,c.id as categoryId,c.name as categoryName "
                +"from product as p INNER JOIN category as c "
                +"where p.categoryId = c.id ";
    connection.query(query,(error,results)=>{
        if(!error){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(error);
        }
    })
})

//Read tous les produits appartenant à une catégorie
router.get('/getByCategory/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    var query = "select id,name from product where categoryId=? and status ='true' "; //If status=true, on va retourner le status,sinon on ne le retourne pas.
    connection.query(query,[id],(error,results)=>{
        if(!error){
            return res.status(200).json(results[0]);
        }else{
            return res.status(500).json(error);
        }
    })
})

//Read a product by his id
router.get('/getById/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    var query ="select id,name,description,price from product where id=? "
    connection.query(query,[id],(error,results)=>{
        if(!error){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(error);
        }
    })
})

//update product
router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var query = "update product set name=?,categoryId=?,description=?,price=? where id=?"; //Ici on retrouve le produit par son id pr le MAJ.
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.id],
                    (error,results)=>{
                        if(!error){
                            if(results.affectedRows == 0){
                                return res.status(404).json({message:"product doesn't find"});
                            }else{
                                return res.status(200).json({message:"Product updated successfully"});
                            }
                        }else{
                            return res.status(500).json(error);
                        }
                    })
})

//Delete product
router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query,[id],(error,results)=>{
        if(!error){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Product id doesn't find."});
            }else{
                return res.status(200).json({message:"Product deleted successfully!"});
            }
        }else{
            return res.status(500).json(error);
        }
    })
})

//Update le status d'un produit 
router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let user = req.body;
    var query = "update product set status=? where id=?";
    connection.query(query,[user.status,user.id],(error,results)=>{
        if(!error){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Product id does not for!"}); 
            }else{
                return res.status(200).json({message:"Product Status successfully updated!"})
            }
        }else{
            return res.status(500).json(error);
        }
    })
})





module.exports = router;