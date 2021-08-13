const { response } = require("express");

const Hospital = require('../models/hospital');


const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre')

    res.json({
        ok: true,
        msg: 'getHospitales',
        hospitales
    })
}

const crearHospitales = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            msg: 'Hospital creado',
            hospital: hospitalDB
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }

}

const actualizarHospitales = (req, res = response) => {
    res.json({
        ok: false,
        msg: 'Actualizar Hospitales',
    })
}

const borrarHospitales = (req, res = response) => {
    res.json({
        ok: false,
        msg: 'borrar Hospitales',
    })
}
module.exports = {
    getHospitales,
    crearHospitales,
    actualizarHospitales,
    borrarHospitales
}