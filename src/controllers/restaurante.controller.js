<<<<<<< HEAD
// src/controllers/restaurante.controller.js
const prisma   = require("../config/prisma");
const producer = require("../rabbitmq/producer");
=======
const prisma = require("../config/prisma");

const {
  publishRestauranteCriado,
  publishRestauranteAtualizado,
  publishRestauranteRemovido,
} = require("../config/rabbitmq/producer");
>>>>>>> bf57a41 (Atualização)

module.exports = {

  // GET /restaurantes
  async getRestaurantes(req, res) {
<<<<<<< HEAD
    try {
      const restaurantes = await prisma.restaurante.findMany();
      return res.send(200, restaurantes);
    } catch (error) {
      console.error("[Restaurante] Erro ao buscar:", error.message);
      return res.send(500, { error: "Erro ao buscar restaurantes." });
    }
=======

    try {

      const restaurantes = await prisma.restaurante.findMany();

      res.send(restaurantes);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao buscar restaurantes",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // GET /restaurantes/:id
  async getRestauranteById(req, res) {
<<<<<<< HEAD
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
=======

    try {

      const id = Number(req.params.id);

      const restaurante = await prisma.restaurante.findUnique({
        where: {
          restaurante_id: id,
        },
      });

      if (!restaurante) {

        return res.send(404, {
          error: "Restaurante não encontrado",
        });

      }

      res.send(restaurante);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao buscar restaurante",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // POST /restaurantes
  async createRestaurante(req, res) {
<<<<<<< HEAD
    try {
      const restaurante = await prisma.restaurante.create({ data: req.body });
      await producer.publishRestauranteCriado(restaurante); // 📤 RabbitMQ
      return res.send(201, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao criar:", error.message);
      return res.send(500, { error: "Erro ao criar restaurante." });
    }
=======

    try {

      const restaurante = await prisma.restaurante.create({
        data: req.body,
      });

      await publishRestauranteCriado(restaurante);

      res.send(201, restaurante);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao criar restaurante",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // PUT /restaurantes/:id
  async updateRestaurante(req, res) {
<<<<<<< HEAD
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
      await producer.publishRestauranteAtualizado(restaurante); // 📤 RabbitMQ
      return res.send(200, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao atualizar:", error.message);
      return res.send(500, { error: "Erro ao atualizar restaurante." });
    }
=======

    try {

      const id = Number(req.params.id);

      const restaurante = await prisma.restaurante.update({
        where: {
          restaurante_id: id,
        },
        data: req.body,
      });

      await publishRestauranteAtualizado(restaurante);

      res.send(restaurante);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao atualizar restaurante",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // PATCH /restaurantes/:id
  async patchRestaurante(req, res) {
<<<<<<< HEAD
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
      await producer.publishRestauranteAtualizado(restaurante); // 📤 RabbitMQ
      return res.send(200, restaurante);
    } catch (error) {
      console.error("[Restaurante] Erro ao atualizar parcialmente:", error.message);
      return res.send(500, { error: "Erro ao atualizar restaurante." });
    }
=======

    try {

      const id = Number(req.params.id);

      const restaurante = await prisma.restaurante.update({
        where: {
          restaurante_id: id,
        },
        data: req.body,
      });

      await publishRestauranteAtualizado(restaurante);

      res.send(restaurante);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao atualizar restaurante",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // DELETE /restaurantes/:id
  async deleteRestaurante(req, res) {
<<<<<<< HEAD
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.restaurante.findUnique({
        where: { restaurante_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Restaurante não encontrado." });

      await prisma.restaurante.delete({ where: { restaurante_id: Number(id) } });
      await producer.publishRestauranteRemovido(id); // 📤 RabbitMQ
      return res.send(200, { message: "Restaurante removido com sucesso." });
    } catch (error) {
      console.error("[Restaurante] Erro ao remover:", error.message);
      return res.send(500, { error: "Erro ao remover restaurante." });
    }
  },
=======

    try {

      const id = Number(req.params.id);

      await prisma.restaurante.delete({
        where: {
          restaurante_id: id,
        },
      });

      await publishRestauranteRemovido(id);

      res.send(204);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao remover restaurante",
      });

    }

  },

>>>>>>> bf57a41 (Atualização)
};