const { response } = require('express');
const bcript = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

const { googleVerify } = require('../helpers/google_verify');


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
            token
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


    res.json({
        ok: true,
        token
    });

}


module.exports = {
    login,
    googleSingIn,
    renewToken
}