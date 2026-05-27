<<<<<<< HEAD
// src/controllers/prato.controller.js
const prisma   = require("../config/prisma");
const producer = require("../rabbitmq/producer");

module.exports = {

  // GET /pratos
  async getPratos(req, res) {
    try {
      const pratos = await prisma.prato.findMany({
        include: { restaurante: true, categoria: true },
      });
      return res.send(200, pratos);
    } catch (error) {
      console.error("[Prato] Erro ao buscar pratos:", error.message);
      return res.send(500, { error: "Erro ao buscar pratos." });
    }
  },

  // GET /pratos/:id
  async getPratoById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const prato = await prisma.prato.findUnique({
        where: { prato_id: Number(id) },
        include: { restaurante: true, categoria: true },
      });
      if (!prato) return res.send(404, { error: "Prato não encontrado." });
      return res.send(200, prato);
    } catch (error) {
      console.error("[Prato] Erro ao buscar por ID:", error.message);
      return res.send(500, { error: "Erro ao buscar prato." });
    }
  },

  // POST /pratos
  async createPrato(req, res) {
    try {
      const prato = await prisma.prato.create({ data: req.body });
      await producer.publishPratoCriado(prato); // 📤 RabbitMQ
      return res.send(201, prato);
    } catch (error) {
      console.error("[Prato] Erro ao criar:", error.message);
      return res.send(500, { error: "Erro ao criar prato." });
    }
  },

  // PUT /pratos/:id
  async updatePrato(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.prato.findUnique({
        where: { prato_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Prato não encontrado." });

      const prato = await prisma.prato.update({
        where: { prato_id: Number(id) },
        data: req.body,
      });
      await producer.publishPratoAtualizado(prato); // 📤 RabbitMQ
      return res.send(200, prato);
    } catch (error) {
      console.error("[Prato] Erro ao atualizar:", error.message);
      return res.send(500, { error: "Erro ao atualizar prato." });
    }
  },

  // PATCH /pratos/:id
  async patchPrato(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.prato.findUnique({
        where: { prato_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Prato não encontrado." });

      const prato = await prisma.prato.update({
        where: { prato_id: Number(id) },
        data: req.body,
      });
      await producer.publishPratoAtualizado(prato); // 📤 RabbitMQ
      return res.send(200, prato);
    } catch (error) {
      console.error("[Prato] Erro ao atualizar parcialmente:", error.message);
      return res.send(500, { error: "Erro ao atualizar prato." });
    }
  },

  // DELETE /pratos/:id
  async deletePrato(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.prato.findUnique({
        where: { prato_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Prato não encontrado." });

      await prisma.prato.delete({ where: { prato_id: Number(id) } });
      await producer.publishPratoRemovido(id); // 📤 RabbitMQ
      return res.send(200, { message: "Prato removido com sucesso." });
    } catch (error) {
      console.error("[Prato] Erro ao remover:", error.message);
      return res.send(500, { error: "Erro ao remover prato." });
    }
=======
const prisma = require("../config/prisma");

const {
  publishPratoCriado,
  publishPratoAtualizado,
  publishPratoRemovido,
} = require("../config/rabbitmq/producer");

module.exports = {

  async getPratos(req, res) {

    try {

      const pratos = await prisma.prato.findMany();

      res.send(pratos);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao buscar pratos",
      });

    }

  },

  async getPratoById(req, res) {

    try {

      const id = Number(req.params.id);

      const prato = await prisma.prato.findUnique({
        where: {
          prato_id: id,
        },
      });

      if (!prato) {

        return res.send(404, {
          error: "Prato não encontrado",
        });

      }

      res.send(prato);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao buscar prato",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // GET /pratos/restaurante/:id
  async getPratosByRestaurante(req, res) {
<<<<<<< HEAD
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const pratos = await prisma.prato.findMany({
        where: { restaurante_id: Number(id) },
        include: { categoria: true },
      });
      return res.send(200, pratos);
    } catch (error) {
      console.error("[Prato] Erro ao buscar por restaurante:", error.message);
      return res.send(500, { error: "Erro ao buscar pratos do restaurante." });
    }
=======

    try {

      const id = Number(req.params.id);

      const pratos = await prisma.prato.findMany({
        where: {
          restaurante_restaurante_id: id,
        },
      });

      res.send(pratos);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao buscar pratos do restaurante",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // GET /pratos/categoria/:id
  async getPratosByCategoria(req, res) {
<<<<<<< HEAD
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const pratos = await prisma.prato.findMany({
        where: { categoria_prato_id: Number(id) },
        include: { restaurante: true },
      });
      return res.send(200, pratos);
    } catch (error) {
      console.error("[Prato] Erro ao buscar por categoria:", error.message);
      return res.send(500, { error: "Erro ao buscar pratos da categoria." });
    }
  },
=======

    try {

      const id = Number(req.params.id);

      const pratos = await prisma.prato.findMany({
        where: {
          categoria_prato_id: id,
        },
      });

      res.send(pratos);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao buscar pratos da categoria",
      });

    }

  },

  async createPrato(req, res) {

    try {

      const prato = await prisma.prato.create({
        data: req.body,
      });

      await publishPratoCriado(prato);

      res.send(201, prato);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao criar prato",
      });

    }

  },

  async updatePrato(req, res) {

    try {

      const id = Number(req.params.id);

      const prato = await prisma.prato.update({
        where: {
          prato_id: id,
        },
        data: req.body,
      });

      await publishPratoAtualizado(prato);

      res.send(prato);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao atualizar prato",
      });

    }

  },

  async patchPrato(req, res) {

    try {

      const id = Number(req.params.id);

      const prato = await prisma.prato.update({
        where: {
          prato_id: id,
        },
        data: req.body,
      });

      await publishPratoAtualizado(prato);

      res.send(prato);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao atualizar prato",
      });

    }

  },

  async deletePrato(req, res) {

    try {

      const id = Number(req.params.id);

      await prisma.prato.delete({
        where: {
          prato_id: id,
        },
      });

      await publishPratoRemovido(id);

      res.send(204);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao remover prato",
      });

    }

  },

>>>>>>> bf57a41 (Atualização)
};