const mongoose = require("mongoose");

const desafioSchema = mongoose.Schema({
    numeroDesafio: { type: Number, required: true },
    nombreDesafio: { type: String, required: true },
    estado: { type: String, required: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    tipoEvento: { type: String, required: true },
    distanciasDisponibles: { type: [Number], required: true }, // Cambiado a un array de números
    precio: { type: Number, required: true },
    coord: { type: [Number], required: true }, // Cambiado a un array de coords (coordenadaXorigen, coordenadaYorigen, coordenadaXdestino, CoordenadaYdestino)
    disponible: { type: Boolean, required: true },
    imagen: { type:String, required: false  }
});

module.exports = mongoose.model("Desafio", desafioSchema);
