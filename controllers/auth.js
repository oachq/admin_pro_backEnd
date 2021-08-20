const { response } = require('express');
const bcript = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

const { googleVerify } = require('../helpers/google_verify');

const { getMenuFrontEnd } = require('../helpers/menu_frontend')

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
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ' Hable con el administrador de server'
        })
    }
}

const googleSingIn = async(req, res = response) => {

    const googleToken = req.body.token

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            // si no exite el usuario 
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture
            })
        } else {
            //si existe usuario
            usuario = usuarioDB;
            usuario.google = true;

        }

        // guardar en DB 
        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: 'Google SingIn',
            token,
            menu: getMenuFrontEnd(usuario.role)
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: ' Token no es correcto'
        })
    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT(uid);

    // obtener el usuario por UID
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.role)
    });

}


module.exports = {
    login,
    googleSingIn,
    renewToken
}