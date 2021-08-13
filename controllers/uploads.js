const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');

const { actualizarImg } = require('../helpers/actualizar-img');

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    //valiodar tipo
    const tiposValidos = ['hospital', 'medico', 'usuario']

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medico, usuario u hospital (tipo)'
        })
    }

    // validar que existe algun archivo 
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.'
        });
    }

    // procesar la imagen...
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.'); // img_1.png
    const extensionArchvio = nombreCortado[nombreCortado.length - 1];

    //validar extencion
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'jpge'];

    if (!extensionesValidas.includes(extensionArchvio)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        })
    }

    // generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchvio}`;

    // path para cuardar la img 
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar base de datos.
        actualizarImg(tipo, id, nombreArchivo)


        res.json({
            ok: true,
            msg: 'Archvio subido',
            nombreArchivo
        })
    });
}

const retornaImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;
    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // imagen por default 
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        const pathImg = path.join(__dirname, `../uploads/no_img.jpg`);
        res.sendFile(pathImg)
    }

}
module.exports = {
    fileUpload,
    retornaImagen
}