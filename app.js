'use strict'

//Cargar modulos para cargar el servidor 
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express (http)
var app = express();

//Cargar fichers (rutas)
var article_routes = require('./routes/article')

//Middlewares

//Cargar el bodyparser
app.use(express.urlencoded({ extended: false }));
//Cualquier tipo de peticion convertir a JSON
app.use(express.json());


//Activar el cors para peticiones del frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Anadir prefijos a rutas / Cargar rutas
app.use('/api', article_routes)


//Exportar moduli (fichero actual)
module.exports = app;