/*
    controlador de las rutas de ../routes/usuarios.js
*/
const { response } = require('express');
const bcript = require('bcryptjs');

const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde || 0);

    // la const usuarios contiene la data del usurio y se desglosa 
    const [usuarios, totalUser] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
        .skip(desde)
        .limit(5),

        Usuario.countDocuments()

    ])

    res.json({
        ok: true,
        usuarios,
        uid: req.uid,
        totalUser
    })
};

const crearUsuarios = async(req, res = response) => {

    const { email, password } = req.body;

    // entrando ala query de create user
    try {
        // la const usuarios contiene la data del usurio y se desglosa 
        //validacion para verificar si el correo existe.
        const existeEmail = await Usuario.findOne({ email })

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }
        // crear usuario new 
        const usuario = new Usuario(req.body);

        //encriptar password
        const salt = bcript.genSaltSync();
        usuario.password = bcript.hashSync(password, salt);


        //guardar usuario
        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })
    } catch (error) {
        // en caso de que suceda algo malo aqui entra 
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.. revisar logs'
        })
    }

};

const actualizarUsuario = async(req, res = response) => {
    // TODO: validar token y comprobar si es el usuario correcto.
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id '
            });
        }

        // Actualizaciones 
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email '
                })
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuarios: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id '
            });
        }

        await Usuario.findByIdAndDelete(uid)

        res.json({
            ok: true,
            msg: 'Usuario Eliminado.'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}