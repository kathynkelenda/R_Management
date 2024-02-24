require('dotenv').config()

//Sert à vérifier le token de l'user
const jsonwebtoken = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    //On vérifie si le token existe ds le header ou pas
    const authHeader = req.headers['authorization']
    //Séparation du token send par le client en deux
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401);
    }
    //Décodage du token
    jsonwebtoken.verify(token, process.env.ACCESS_TOKEN, (error, response) => {
        if (error) {
            //Données inaccessibles car droits d'accès de l'user is insuffisant
            return res.sendStatus(403);  
        }else{
            //On récupère tous les éléments décodés ds la variable response
            res.locals = response; 
            next();
        }
    })
}

module.exports = { authenticateToken: authenticateToken }