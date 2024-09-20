const express = require('express');
const usuarioRoute = express.Router();
const AsyncHandler = require('express-async-handler')
const Usuario = require("../models/Usuario");
const generateToken = require("../tokenGenerate");
const protect = require("../middleware/Auth");

usuarioRoute.post('/login', AsyncHandler(
    async (req, res) => {
        const { correoElectronico, contrasena } = req.body;
        const usuario = await Usuario.findOne({ correoElectronico });
        if (usuario && (await usuario.matchPassword(contrasena))) {
            res.json({
                _id: usuario.id,
                nombreCompleto: usuario.nombreCompleto,
                correoElectronico: usuario.correoElectronico,
                token: generateToken(usuario._id),
                createdAt: usuario.createdAt,
            });
        } else {
            res.status(401);
            throw new Error("Correo o Contraseña inválidos");
        }
    })
);

usuarioRoute.post("/", AsyncHandler(async (req, res) => {
    const { 
        nombreCompleto, 
        correoElectronico, 
        contrasena, 
        equipoMTB, 
        numeroCelular, 
        contactoEmergencia, 
        edad, 
        tipoSangre, 
        sexo, 
        estado,
        fotoBici,
        logo 
    } = req.body;

    const existUsuario = await Usuario.findOne({ correoElectronico });
    if (existUsuario) {
        res.status(400);
        throw new Error("El usuario ya existe");
    } else {
        const usuario = await Usuario.create({
            nombreCompleto,
            correoElectronico,
            contrasena,
            equipoMTB,
            numeroCelular,
            contactoEmergencia,
            edad,
            tipoSangre,
            sexo,
            estado,
            fotoBici,
            logo
        });

        if (usuario) {
            res.status(201).json({
                _id: usuario._id,
                nombreCompleto: usuario.nombreCompleto,
                correoElectronico: usuario.correoElectronico,
                equipoMTB: usuario.equipoMTB,
                numeroCelular: usuario.numeroCelular,
                contactoEmergencia: usuario.contactoEmergencia,
                edad: usuario.edad,
                tipoSangre: usuario.tipoSangre,
                sexo: usuario.sexo,
                estado: usuario.estado,
                fotoBici: usuario.fotoBici,
                logo: usuario.logo,
                createdAt: usuario.createdAt,
            });
        } else {
            res.status(400);
            throw new Error("Datos de usuario inválidos");
        }
    }
}));


usuarioRoute.get(
    "/profile",
    protect,
    AsyncHandler(async (req, res) => {
        const usuario = await Usuario.findById(req.user._id);
        if (usuario) {
            res.json({
                _id: usuario._id,
                nombreCompleto: usuario.nombreCompleto,
                correoElectronico: usuario.correoElectronico,
                createdAt: usuario.createdAt,
            });
        } else {
            res.status(404);
            throw new Error("Usuario no encontrado");
        }
    })
);

usuarioRoute.put(
    "/profile",
    protect,
    AsyncHandler(async (req, res) => {
        const usuario = await Usuario.findById(req.user._id);
        if (usuario) {
            usuario.nombreCompleto = req.body.nombreCompleto || usuario.nombreCompleto;
            usuario.correoElectronico = req.body.correoElectronico || usuario.correoElectronico;
            usuario.equipoMTB = req.body.equipoMTB || usuario.equipoMTB;
            usuario.numeroCelular = req.body.numeroCelular || usuario.numeroCelular;
            usuario.contactoEmergencia = req.body.contactoEmergencia || usuario.contactoEmergencia;
            usuario.edad = req.body.edad || usuario.edad;
            usuario.tipoSangre = req.body.tipoSangre || usuario.tipoSangre;
            usuario.sexo = req.body.sexo || usuario.sexo;
            usuario.estado = req.body.estado || usuario.estado;

            if (req.body.contrasena) {
                usuario.contrasena = req.body.contrasena;
            }

            const updatedUsuario = await usuario.save();
            res.json({
                _id: updatedUsuario._id,
                nombreCompleto: updatedUsuario.nombreCompleto,
                correoElectronico: updatedUsuario.correoElectronico,
                equipoMTB: updatedUsuario.equipoMTB,
                numeroCelular: updatedUsuario.numeroCelular,
                contactoEmergencia: updatedUsuario.contactoEmergencia,
                edad: updatedUsuario.edad,
                tipoSangre: updatedUsuario.tipoSangre,
                sexo: updatedUsuario.sexo,
                estado: updatedUsuario.estado,
                createdAt: updatedUsuario.createdAt,
                token: generateToken(updatedUsuario._id)
            });

        } else {
            res.status(404);
            throw new Error("Usuario no encontrado");
        }
    })
);


module.exports = usuarioRoute;
