const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema(
    {
        nombreCompleto: { type: String, required: true },
        contrasena: { type: String, required: true },
        equipoMTB: { type: String },
        correoElectronico: { type: String, required: true, unique: true },
        numeroCelular: { type: String },
        contactoEmergencia: { type: String },
        edad: { type: Number },
        tipoSangre: { type: String },
        sexo: { type: String },
        estado: { type: String },
    },
    { timestamps: true }
);

// Método para validar contraseña
usuarioSchema.methods.matchPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.contrasena);
};

// Hash de contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
    if (!this.isModified("contrasena")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
});

module.exports = mongoose.model("Usuario", usuarioSchema);
