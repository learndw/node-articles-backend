'use strict'

var express = require('express')

var ArticleController = require('../controllers/article')

var router = express.Router()

//Para subir ficheros
var multipart = require('connect-multiparty')
//Donde se va a guardar las img
var md_upload = multipart({ uploadDir: './uploads/articles' })

router.post('/save', ArticleController.save)
//Todos los articulos o solo los 2 ultimos
router.get('/articles/:last?', ArticleController.getArticles)

router.get('/article/:id', ArticleController.getArticle)
router.put('/article/:id', ArticleController.update)
router.delete('/article/:id', ArticleController.delete)

//Asigar middlerware md_upload para procesar archivos
router.post('/uploadimg/:id?', md_upload, ArticleController.uploadImg)

//Obtener imagen
router.get('/get-img/:img',ArticleController.getImage)
module.exports = router

//Buscar un articulo
router.get('/search/:search',ArticleController.search)