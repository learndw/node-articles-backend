'use strict'

var mongoose = require('mongoose');

//Arreglo de errores de metodos antiguos de node
mongoose.set('useFindAndModify', false);

//Para Trabajar con promesas(funciones de call back: ejecutar una operacion de acuerdo al resultado )
//Para uso de promesas
mongoose.Promise = global.Promise;

//useNewUrlParser: Espara usar las funcionalidades nuevas de mongodb


var app = require('./app');
var port = 3900

mongoose.connect('mongodb://localhost:27017/backend_node', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('La conexion a la base de datos de mongo se ha realizado correctamente');
 
        //Crear servidor y escuchar peticiones http
        app.listen(port,()=>{
            console.log('Servidor corriendo en http://localhost:'+port);
        })


    })
    .catch(error => {
        console.log(error);

    })