'use strict'

var validator = require('validator')

//Modelo
var Article = require('../models/article')

//Libreria para eliminar archivos
var fs = require('fs')
//Modulo para obtener el path desde el servidor
var path = require('path')


var controller = {
    save: (req, res) => {
        //Obtener parametros
        var params = req.body
        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title)
            var validate_content = !validator.isEmpty(params.content)
        } catch (error) {
            return res.status(200).send({
                message: 'Faltan datos por enviar',
                status: 'error'
            })
        }
        if (validate_title && validate_content) {

            //Crear el objeto a guardar
            var article = new Article()
            //Asignar valores
            article.title = params.title
            article.content = params.content
            if (params.image) {

                article.image = params.image
            } else {

                article.image = null
            }

            // Guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        message: 'Los datos no son validos',
                        status: 'error'
                    })
                }

                return res.status(200).send({
                    message: 'Articulo guardado correctamente',
                    status: 'success',
                    articleStored
                })
            })

        } else {
            return res.status(404).send({
                message: 'Los datos no son validos',
                status: 'error'
            })
        }
    },
    getArticles: (req, res) => {

        var query = Article.find({})
        //parametro de la url
        var last = req.params.last

        if (last || last != undefined) {
            query.limit(4)
        }

        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return res.status(404).send({
                    message: 'Error al buscar articulos',
                    status: 'error',
                    err
                })

            }
            if (!articles) {
                return res.status(404).send({
                    message: 'No hay articulos disponibles aun',
                    status: 'error'
                })

            }

            return res.status(200).send({
                message: 'Todos los articulos',
                status: 'success',
                articles
            })
        })

    },

    getArticle: (req, res) => {
        //Id de url
        var articleId = req.params.id

        //Comprobar existencia
        if (!articleId || articleId == null) {

            return res.status(404).send({
                status: 'error',
                message: 'Articulo no disponible'
            })
        }

        //Buscar articulo
        Article.findById(articleId, (err, article) => {
            if (err || !article) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver datos'
                })

            }


            return res.status(200).send({
                status: 'success',
                article
            })
        })


    },

    update: (req, res) => {
        //Obtener id en la url
        var articleId = req.params.id

        //Obtener datos mediante el metodo put
        var params = req.body

        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title)
            var validate_content = !validator.isEmpty(params.content)
        } catch (error) {
            return res.status(400).send({
                message: 'Falta datos por enviar',
                status: 'error'
            })
        }

        if (validate_title && validate_content) {
            //Find and Update

            //id,parametrosaActualizar,Para devlver objeto actualizado no el anterior,callback
            Article.findByIdAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err || !articleUpdated) {
                    return res.status(404).send({
                        message: 'Los datos no son validos para actualizar',
                        status: 'error'
                    })
                }

                return res.status(200).send({
                    message: 'Articulo actualizado correctamente',
                    article: articleUpdated
                })
            });

        } else {
            return res.status(404).send({
                message: 'Los datos no son validos',
                status: 'error'
            })
        }


    },

    delete: (req, res) => {
        //Obtener id de url
        var articleId = req.params.id

        if (articleId) {

            //Buscar y eliminar
            Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
                if (err || !articleRemoved) {
                    return res.status(400).send({
                        message: 'Error al eliminar articulo',
                        status: 'error'
                    })
                }

                return res.status(200).send({
                    message: 'Articulo eliminado correctamente',
                    article: articleRemoved
                })
            })
        }

    },

    uploadImg: (req, res) => {
        //Configurar el modulo connect-multiparty en router/article.js

        //Obtener fichero de la peticion
        var file_name = 'Img no encontrada'

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            })
        }

        //Conseguir el nombre o la extension del archivo
        var file_path = req.files.file0.path
        //Separa las palabras mediante \\ en arrays
        var file_split = file_path.split('\\')

        //En linux
        //var file_split = file_path.split('/')

        //Nombre de fichero
        file_name = file_split[2]

        //Comprobar la extension| img, si es valida borra el fichero
        var extension_split = file_name.split('\.')
        var file_ext = extension_split['1']

        //Si es valido
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            fs.unlink(file_path, (err) => {
                return res.status(404).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                })
            })
        } else {
            //Si es valido
            //Id de url 
            var articleId = req.params.id

            if (articleId) {


                //Buscar articulo y asignarle el nombre de la imagen y actualizarlo

                //id, objeto a actualizar,(nombre de archivo a actualizar), obtener version actual, callback
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
                    if (err || !articleUpdated) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al guardar la img del articulo'
                        })
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    })
                })
            } else {
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                })

            }
        }

        //Buscar el articulo y asignarle el nombre de la imagen y actualizarlo


    },

    getImage: (req, res) => {
        //Obtener el valor del parametro :img de la url
        var file = req.params.img

        //ruta completa del arhivo en el servidor
        var path_file = './uploads/articles/' + file

        //Comprobar si el archivo existe
        if (fs.existsSync(path_file)) {
            //Uso del metodo path para obtener la imagen
            return res.sendFile(path.resolve(path_file));
        } else {
            return res.status(404).send({
                status: 'error',
                mesagge: 'No existe la imagen'
            });
        }

    },

    search: (req, res) => {
        //Obtener de la url el parametro search
        var searchString = req.params.search

        //Buscar el articulo de varias maneras es decir title || content
        Article.find({
            "$or": [
                //Si el contenido del parametro search esta relacionado al titulo entonces retorna ese articulo 
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } }
            ]
        }).sort([['date', 'descending']])
            .exec((err, articles) => {
                if (err) {

                    return res.status(500).send({
                        status: 'error',
                        mesagge: 'Error al buscar articulos'
                    })
                }

                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        mesagge: 'No hay articulos relacionados a tu busqueda'
                    })

                }
                return res.status(200).send({
                    status: 'success',
                    articles
                })
            })
    }


}

module.exports = controller