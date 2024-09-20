const mongoose = require("mongoose");

const ordenSchema = new mongoose.Schema(
    {
        usuario: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Usuario" },
        desafio: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Desafio" },
        kit: { type: String, required: true },
        metodoPago: { type: String, required: true },
        estaPagado: { type: Boolean, default: false },
        pagadoEnLaFecha: { type: Date },
        precio: { type:Number, required: true, }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Orden", ordenSchema);
