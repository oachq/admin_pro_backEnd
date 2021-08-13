/*
    ruta: api/uploads/usuario/id,
          api/uploads/medico/id,
          api/uploads/hospital/id
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { fileUpload, retornaImagen } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', [
    validarJWT,
], fileUpload)

router.get('/:tipo/:foto', retornaImagen);

module.exports = router