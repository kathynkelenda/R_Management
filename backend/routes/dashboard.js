const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//Nbre de category enregistrée
router.get('/details', auth.authenticateToken,(req,res,next)=>{
    var categoryCount;
    var productCount;
    var billCount;

    //Nbre de category
    var query = "select count(id) as categoryCount from category";
    connection.query(query,(error,results)=>{
        if(!error){
            categoryCount = results[0].categoryCount;
        }else{
            return res.status(500).json(error);
        }
    })

    //Nbre de produit
    var query = "select count(id) as productCount from product";
    connection.query(query,(error,results)=>{
        if(!error){
            productCount = results[0].productCount;
        }else{
            return res.status(500).json(error);
        }
    })

    //Nbre de bill
    var query = "select count(id) as billCount from bill";
    connection.query(query,(error,results)=>{
        if(!error){
            billCount = results[0].billCount;

            //Renvoi le nbre de catégorie, produit et factures.
            var data = {
                category : categoryCount,
                product : productCount,
                bill : billCount
            };
            return res.status(200).json(data);
        }else{
            return res.status(500).json(error);
        }
    })
})



module.exports = router;


