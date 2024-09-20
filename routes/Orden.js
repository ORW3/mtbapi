const express = require("express");
const ordenRoute = express.Router();
const protect = require("../middleware/Auth");
const asyncHandler = require("express-async-handler");
const Orden = require("../models/Orden");
const Kit = require("../models/Kit");

ordenRoute.post(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const { desafio, kit, metodoPago, estaPagado, precio } = req.body;
        const ordenRegistrada = await Orden.find({ desafio: desafio, usuario: req.user._id });

        if (ordenRegistrada == "") {
            if (!desafio) {
                res.status(400);
                throw new Error("No se encontró el desafío");
            } else {
                const orden = new Orden({
                    desafio,
                    kit,
                    metodoPago,
                    estaPagado,
                    precio,
                    usuario: req.user._id,
                });

                const createdOrden = await orden.save();
                res.status(201).json(createdOrden);
            }
        } else {
            res.status(404).json("Solo se permite una orden por desafio");
            throw new Error("Solo se permite una orden por desafio");
        }
    })
);

ordenRoute.get(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
        const orden = await Orden.findById(req.params.id).populate("usuario", "correoElectronico");
        if (orden) {
            res.status(200).json(orden);
        } else {
            res.status(404);
            throw new Error("Orden No Encontrada");
        }
    })
);

ordenRoute.get(
    "/:id/available",
    protect,
    asyncHandler(async (req, res) => {
        const orden = await Orden.findById(req.params.id);

        if (orden) {

            if (orden.kit == "Ninguno") {
                res.status(200).json(orden);
            } else {
                const kitOrden = await Kit.find({ nombre: orden.kit });

                if (kitOrden && kitOrden[0].existencia > 0) {
                    res.status(200).json(orden);
                } else {
                    res.status(404);
                    throw new Error("Kit no disponible");
                }
            }
        } else {
            res.status(404);
            throw new Error("Orden No Encontrada");
        }
    })
);

ordenRoute.put(
    "/:id/payment",
    protect,
    asyncHandler(async (req, res) => {
        const orden = await Orden.findById(req.params.id);

        if (orden) {
            orden.estaPagado = true;
            orden.pagadoEnLaFecha = Date.now();
            const updatedOrden = await orden.save();

            res.status(200).json(updatedOrden);

        } else {
            res.status(404);
            throw new Error("Orden No Encontrada");
        }
    })
);

ordenRoute.put(
    "/:id/kit",
    protect,
    asyncHandler(async (req, res) => {
        const orden = await Orden.findById(req.params.id);

        if (orden) {
            if (orden.kit == "Ninguno") {
                res.status(200).json(orden);
            } else {
                const kitOrden = await Kit.find({ nombre: orden.kit });

                if (kitOrden && kitOrden[0].existencia > 0) {
                    
                    kitOrden[0].existencia -= 1;
                    const updatedKit = await kitOrden[0].save()

                    res.status(200).json(orden);
                } else {
                    res.status(404).json("Kit agotado");
                    throw new Error("Kit agotado");
                }
            }

        } else {
            res.status(404);
            throw new Error("Orden No Encontrada");
        }
    })
);

ordenRoute.put(
    "/:id/cancelKit",
    protect,
    asyncHandler(async (req, res) => {
        const orden = await Orden.findById(req.params.id);

        if (orden) {
            if (orden.kit == "Ninguno") {
                res.status(200).json(orden);
            } else {
                const kitOrden = await Kit.find({ nombre: orden.kit });

                if (kitOrden) {
                    
                    kitOrden[0].existencia += 1;
                    const updatedKit = await kitOrden[0].save()

                    res.status(200).json(orden);
                } else {
                    res.status(404).json("Kit inexistente");
                    throw new Error("Kit inexistente");
                }
            }

        } else {
            res.status(404);
            throw new Error("Orden No Encontrada");
        }
    })
);

ordenRoute.get(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const ordenes = await Orden.find({ usuario: req.user._id }).sort({ _id: -1 });
        if (ordenes) {
            res.status(200).json(ordenes);
        } else {
            res.status(404);
            throw new Error("Ordenes No Encontradas");
        }
    })
);

module.exports = ordenRoute;
