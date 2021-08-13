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

// Directorio publico
app.use(expres.static('public'));

//configuracion de cors 
app.use(cors());

//rutas 
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medico', require('./routes/medico'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));



app.listen(process.env.PORT, () => {
    console.log('Server run en puerto: ' + process.env.PORT)
})