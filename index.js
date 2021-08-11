require('dotenv').config();

const expres = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear el server de express 
const app = expres();

// conectar base de datos
dbConnection();


//configuracion de cors 
app.use(cors());


//rutas 
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'hola mundo'
    })
});


app.listen(process.env.PORT, () => {
    console.log('Server run en puerto: ' + process.env.PORT)
})