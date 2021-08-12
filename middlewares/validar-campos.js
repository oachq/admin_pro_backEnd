const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {
    // validar campos 
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            erorrs: errores.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos
}