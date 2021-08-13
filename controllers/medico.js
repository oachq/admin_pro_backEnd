const { response } = require("express");

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {
    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img')

    res.json({
        ok: true,
        msg: 'getMedicos',
        medicos
    })
}

const crearMedicos = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            msg: 'Medico creado',
            medico: medicoDB
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarMedicos = (req, res = response) => {
    res.json({
        ok: false,
        msg: 'Actualizar Medicos',
    })
}

const borrarMedicos = (req, res = response) => {
    res.json({
        ok: false,
        msg: 'borrar Medicos',
    })
}
module.exports = {
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    borrarMedicos
}