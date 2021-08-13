const fs = require('fs');

const Usuarios = require('../models/usuarios');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImgagen = (path) => {
    if (fs.existsSync(path)) {
        //borrar img anterior con unlink
        fs.unlinkSync(path);
    }
}
let pathViejo = '';

const actualizarImg = async(tipo, id, nombreArchivo) => {

    switch (tipo) {
        case 'medico':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No es un medico por id');
                return false;
            }
            pathViejo = `./uploads/medico/${medico.img}`;
            borrarImgagen(pathViejo)

            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;
        case 'hospital':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No es un hospital por id');
                return false;
            }
            pathViejo = `./uploads/hospital/${hospital.img}`;
            borrarImgagen(pathViejo)

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;
        case 'usuario':
            const usuario = await Usuarios.findById(id);
            if (!usuario) {
                console.log('No es un usuario por id');
                return false;
            }
            pathViejo = `./uploads/usuario/${usuario.img}`;
            borrarImgagen(pathViejo)

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;

        default:
            break;
    }

}

module.exports = {
    actualizarImg
}