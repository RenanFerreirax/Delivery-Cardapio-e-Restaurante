// src/controllers/restaurante.controller.js
const prisma = require("../config/prisma");

const {
  publishRestauranteCriado,
  publishRestauranteAtualizado,
  publishRestauranteRemovido,
} = require("../rabbitmq/producer");

module.exports = {

  // GET /restaurantes
  async getRestaurantes(req, res) {
    try {
      const restaurantes = await prisma.restaurante.findMany();
      return res.send(200, restaurantes);
    } catch (error) {
      console.error("[Restaurante] Erro ao buscar:", error.message);
      return res.send(500, { error: "Erro ao buscar restaurantes." });
    }
  },

  // GET /restaurantes/:id
  async getRestauranteById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const restaurante = await prisma.restaurante.findUnique({
        where: { restaurante_id: Number(id) },
      });
      if (!restaurante) return res.send(404, { error: "Restaurante não encontrado." });
      return res.send(200, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao buscar por ID:", error.message);
      return res.send(500, { error: "Erro ao buscar restaurante." });
    }
  },

  // POST /restaurantes
  async createRestaurante(req, res) {
    try {
      const restaurante = await prisma.restaurante.create({ data: req.body });
      await publishRestauranteCriado(restaurante);
      return res.send(201, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao criar:", error.message);
      return res.send(500, { error: "Erro ao criar restaurante." });
    }
  },

  // PUT /restaurantes/:id
  async updateRestaurante(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.restaurante.findUnique({
        where: { restaurante_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Restaurante não encontrado." });

      const restaurante = await prisma.restaurante.update({
        where: { restaurante_id: Number(id) },
        data: req.body,
      });
      await publishRestauranteAtualizado(restaurante);
      return res.send(200, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao atualizar:", error.message);
      return res.send(500, { error: "Erro ao atualizar restaurante." });
    }
  },

  // PATCH /restaurantes/:id
  async patchRestaurante(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.restaurante.findUnique({
        where: { restaurante_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Restaurante não encontrado." });

      const restaurante = await prisma.restaurante.update({
        where: { restaurante_id: Number(id) },
        data: req.body,
      });
      await publishRestauranteAtualizado(restaurante);
      return res.send(200, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao atualizar parcialmente:", error.message);
      return res.send(500, { error: "Erro ao atualizar restaurante." });
    }
  },

  // DELETE /restaurantes/:id
  async deleteRestaurante(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.restaurante.findUnique({
        where: { restaurante_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Restaurante não encontrado." });

      await prisma.restaurante.delete({ where: { restaurante_id: Number(id) } });
      await publishRestauranteRemovido(id);
      return res.send(200, { message: "Restaurante removido com sucesso." });
    } catch (error) {
      console.error("[Restaurante] Erro ao remover:", error.message);
      return res.send(500, { error: "Erro ao remover restaurante." });
    }
  },
};