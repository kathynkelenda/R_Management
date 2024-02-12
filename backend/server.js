
require('dotenv').config(); //Importe le fichier .env ds le serveur
const http = require("http");
const app = require('./index');
const server = http.createServer(app);
server.listen(process.env.PORT);