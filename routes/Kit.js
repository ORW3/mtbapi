const express = require("express");
const kitRoute = express.Router();
const asyncHandler = require("express-async-handler");
const Kit = require("../models/Kit");

kitRoute.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const kits = await Kit.find({ desafio: req.params.id }).sort({ _id: -1 });
        if (kits) {
            res.status(200).json(kits);
        } else {
            res.status(404);
            throw new Error("Kits No Encontrados");
        }
    })
);

kitRoute.post(
    "/",
    asyncHandler(async (req, res, next) => {
        if (req.body.llave == process.env.LIFE) {
            next();
        } else {
            res.status(401);
            throw new Error("¡No autorizado!");
        }
    }),
    asyncHandler(async (req, res) => {
        const { desafio, precio, existencia, imagen, nombre, llave } = req.body;

        if (!desafio) {
            res.status(400);
            throw new Error("No se encontró el desafio");
        } else {
            const kit = new Kit({
                desafio,
                precio,
                existencia,
                imagen,
                nombre,
            });

            const createdKit = await kit.save();
            res.status(201).json(createdKit);
        }
    })
);

module.exports = kitRoute;
