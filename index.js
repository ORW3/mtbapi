const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());

const PORT = process.env.PORT;

const mongoose = require("mongoose");

// Conectar base de datos
mongoose.connect(process.env.MONGOOSEDB_RUL).then(() => console.log("BD conectada")).catch((err) => {
    console.log(err);
});

const usuarioRoute = require('./routes/Usuario');
const desafioRoute = require('./routes/Desafio');
const ordenRoute = require('./routes/Orden');
const kitRoute = require('./routes/Kit');

app.use(express.json());

// Rutas para usuarios
app.use('/api/usuarios', usuarioRoute);

// Rutas para desafíos
app.use('/api/desafios', desafioRoute);

// Rutas para órdenes
app.use("/api/ordenes", ordenRoute);

// Rutas para órdenes
app.use("/api/kits", kitRoute);

app.listen(PORT || 9000, () => {
    console.log(`Escuchando en el puerto ${PORT}!`);
});
