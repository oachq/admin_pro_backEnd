const { response } = require('express');
const bcript = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // verificar email 
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'el email no valida'
            })
        }

        //verificar contraseña 
        const validPassword = bcript.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            msg: 'Bienvendio ',
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ' Hable con el administrador de server'
        })
    }
}

module.exports = {
    login,

}