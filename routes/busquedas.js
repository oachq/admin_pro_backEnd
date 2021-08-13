/*
    ruta: api/todo/oscar
*/

const { Router } = require('express');
const { getTodo, getDocumentosColecion } = require('../controllers/busquedas');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:busqueda', [
    validarJWT,
], getTodo)

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColecion);

module.exports = router