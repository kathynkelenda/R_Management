const express = require('express');
const connection = require('../connection');
const router = express.Router(); //Création du router
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

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


module.exports = router;

