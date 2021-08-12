require('dotenv').config();

const expres = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear el server de express 
const app = expres();

//lectura y parseo del body
app.use(expres.json());

// conectar base de datos
dbConnection();

//configuracion de cors 
app.use(cors());

//rutas 
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));



app.listen(process.env.PORT, () => {
    console.log('Server run en puerto: ' + process.env.PORT)
})