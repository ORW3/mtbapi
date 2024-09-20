const express = require("express");
const desafioRoute = express.Router();
const asyncHandler = require("express-async-handler");
const Desafio = require("../models/Desafio");

desafioRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const desafios = await Desafio.find({});
    res.json(desafios);
  })
);

desafioRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const desafio = await Desafio.findById(req.params.id);
    if (desafio) {
      res.json(desafio);
    } else {
      res.status(404);
      throw new Error("Desafío no encontrado");
    }
  })
);

module.exports = desafioRoute;
