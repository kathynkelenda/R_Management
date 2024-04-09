const express = require('express');
const connection = require('../connection');
const router = express.Router();

//Import de ces packages installé précédemment
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var uuid = require('uuid')

//Importé par défaut avec node => Pas besoin d'installer un package
var fs = require('fs');

//checkRole non importé car ns ne restreindrons aucune fxion aux admin seuls.
var auth = require('../services/authentication');

router.post('/generateReport',auth.authenticateToken,(req,res,next)=>{
    //Génération du uuid
    const generateUuid =uuid.v1();
    const orderDetails = req.body;

    /*Du front, ns aurons les détails du produits en [{\"id\":1,\name\":\"coffee\",\...}],  Ex: [{\"id\":1,\name\":\"coffee\",\"price\":99, \"total\":99, \"category\":\"coffee\",\"quantity\":\"1\"}]
    d'où ns devons les convertir pr ôter les antislash => used of JON.pasre */
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    var query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy)"
                + "values(?,?,?,?,?,?,?,?)"; //On va récupérer le createdBy du token décodé, doù = res.locals.email.
    connection.query(query,[orderDetails.name, generateUuid, orderDetails.email, orderDetails.contactNumber, 
                orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email,
            (error, results) => {
                console.log("test si access this fxion");
                if(!error){
                    ejs.renderFile(path.join(__dirname,'./routes/',"report.ejs"),
                        {productDetails:productDetailsReport,
                        name: orderDetails.name,
                        email:orderDetails.email,
                        contactNumber:orderDetails.contactNumber,
                        paymentMethod:orderDetails.paymentMethod,
                        totalAmount:orderDetails.totalAmount},
                        (error,results) => {
                            if(!error){
                                
                                pdf.create(results).toFile('./generated_pdf/' + generateUuid + ".pdf", function(error,results){
                                    if(!error){
                                        return res.status(200).json({uuid: generateUuid });
                                    }else{
                                        console.log(error);
                                        return res.status(500).json(error);
                                    }
                                })
                                 //return res.status(200).json({message:"Création réussie"});
                            }else{
                                return res.status(500).json(error); 
                            }
                        }
                    );

                    //return res.status(200).json({message:"Création réussie"});

                }else{
                    return res.status(500).json(error);
                }
            }])
})

router.post('getPdf',auth.authenticateToken,function(req,res){
    const orderDetails = req.body;
    const pdfPath = './generate_pdf/' + orderDetails.uuid + '.pdf';
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails);

        ejs.renderFile(path.join(__dirname,'./routes/',"report.ejs"),
                        {productDetails:productDetailsReport,
                        name: orderDetails.name,
                        email:orderDetails.email,
                        contactNumber:orderDetails.contactNumber,
                        paymentMethod:orderDetails.paymentMethod,
                        totalAmount:orderDetails.totalAmount},
                        (error,results) => {
                            if(!error){
                                
                                pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", function(error,results){
                                    if(!error){
                                        return res.status(200).json({uuid: generateUuid });
                                    }else{
                                        console.log(error);
                                        return res.status(500).json(error);
                                    }
                                })
                                 //return res.status(200).json({message:"Création réussie"});
                            }else{
                                return res.status(500).json(error); 
                            }
                        }
                    );
            }
})

//Get de toutes les factures
router.get('/getBills',auth.authenticateToken,(req,res,next)=>{
    var query = "select *from bill order by id DESC";
    connection.query(query,(error,results)=>{
        if(!error){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(error);
        }
    })
})

//Delete a bill
router.delete('/delete/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    var query = "delete from bill where id=?";
    connection.query(query,[id],(error,results)=>{
        if(!error){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Bill id doesn't found"});
            }else{
                return res.status(200).json({message: "Bill delete successfully!" })
            }
        }else{
            return res.status(500).json(error);
        }
    })
})

module.exports = router;
