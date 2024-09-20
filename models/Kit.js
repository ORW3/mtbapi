const mongoose = require("mongoose");

const kitSchema = new mongoose.Schema(
    {
        desafio: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Desafio" },
        precio: { type: Number, required: true },
        imagen: { type: String, required: false },
        nombre: { type: String, required: true },
        existencia: { type: Number, default: 0 },
    }
);

module.exports = mongoose.model("Kit", kitSchema);
