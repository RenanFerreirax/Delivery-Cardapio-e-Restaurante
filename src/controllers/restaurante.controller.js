// src/controllers/restaurante.controller.js
const prisma = require("../config/prisma");

const {
  publishRestauranteCriado,
  publishRestauranteAtualizado,
  publishRestauranteRemovido,
} = require("../rabbitmq/producer");

module.exports = {

  async getRestaurantes(req, res) {
    try {
      const restaurantes = await prisma.restaurante.findMany();
      res.send(200, restaurantes);
    } catch (error) {
      console.error("[Restaurante] Erro ao buscar:", error.message);
      res.send(500, { error: "Erro ao buscar restaurantes." });
    }
  },

  async getRestauranteById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) { res.send(400, { error: "ID inválido." }); return; }

      const restaurante = await prisma.restaurante.findUnique({
        where: { restaurante_id: Number(id) },
      });
      if (!restaurante) { res.send(404, { error: "Restaurante não encontrado." }); return; }
      res.send(200, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao buscar por ID:", error.message);
      res.send(500, { error: "Erro ao buscar restaurante." });
    }
  },

  async createRestaurante(req, res) {
    try {
      const restaurante = await prisma.restaurante.create({ data: req.body });
      await publishRestauranteCriado(restaurante);
      res.send(201, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao criar:", error.message);
      res.send(500, { error: "Erro ao criar restaurante." });
    }
  },

  async updateRestaurante(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) { res.send(400, { error: "ID inválido." }); return; }

      const existe = await prisma.restaurante.findUnique({
        where: { restaurante_id: Number(id) },
      });
      if (!existe) { res.send(404, { error: "Restaurante não encontrado." }); return; }

      const restaurante = await prisma.restaurante.update({
        where: { restaurante_id: Number(id) },
        data: req.body,
      });
      await publishRestauranteAtualizado(restaurante);
      res.send(200, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao atualizar:", error.message);
      res.send(500, { error: "Erro ao atualizar restaurante." });
    }
  },

  async patchRestaurante(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) { res.send(400, { error: "ID inválido." }); return; }

      const existe = await prisma.restaurante.findUnique({
        where: { restaurante_id: Number(id) },
      });
      if (!existe) { res.send(404, { error: "Restaurante não encontrado." }); return; }

      const restaurante = await prisma.restaurante.update({
        where: { restaurante_id: Number(id) },
        data: req.body,
      });
      await publishRestauranteAtualizado(restaurante);
      res.send(200, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao atualizar parcialmente:", error.message);
      res.send(500, { error: "Erro ao atualizar restaurante." });
    }
  },

  async deleteRestaurante(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) { res.send(400, { error: "ID inválido." }); return; }

      const existe = await prisma.restaurante.findUnique({
        where: { restaurante_id: Number(id) },
      });
      if (!existe) { res.send(404, { error: "Restaurante não encontrado." }); return; }

      await prisma.restaurante.delete({ where: { restaurante_id: Number(id) } });
      await publishRestauranteRemovido(id);
      res.send(200, { message: "Restaurante removido com sucesso." });
    } catch (error) {
      console.error("[Restaurante] Erro ao remover:", error.message);
      res.send(500, { error: "Erro ao remover restaurante." });
    }
  },
};