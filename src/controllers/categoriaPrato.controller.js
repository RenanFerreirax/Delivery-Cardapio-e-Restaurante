<<<<<<< HEAD
// src/controllers/categoriaPrato.controller.js
=======
>>>>>>> bf57a41 (Atualização)
const prisma = require("../config/prisma");

module.exports = {

  // GET /categorias
  async getCategorias(req, res) {
<<<<<<< HEAD
    try {
      const categorias = await prisma.categoriaPrato.findMany();
      return res.send(200, categorias);
    } catch (error) {
      console.error("[Categoria] Erro ao buscar:", error.message);
      return res.send(500, { error: "Erro ao buscar categorias." });
    }
=======

    try {

      const categorias = await prisma.categoriaPrato.findMany();

      res.send(categorias);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao buscar categorias",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // GET /categorias/:id
  async getCategoriaById(req, res) {
<<<<<<< HEAD
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const categoria = await prisma.categoriaPrato.findUnique({
        where: { categoria_prato_id: Number(id) },
      });
      if (!categoria) return res.send(404, { error: "Categoria não encontrada." });
      return res.send(200, categoria);
    } catch (error) {
      console.error("[Categoria] Erro ao buscar por ID:", error.message);
      return res.send(500, { error: "Erro ao buscar categoria." });
    }
=======

    try {

      const { id } = req.params;

      const categoria = await prisma.categoriaPrato.findUnique({
        where: {
          categoria_prato_id: Number(id),
        },
      });

      if (!categoria) {

        return res.send(404, {
          error: "Categoria não encontrada",
        });

      }

      res.send(categoria);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao buscar categoria",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // POST /categorias
  async createCategoria(req, res) {
<<<<<<< HEAD
    try {
      const categoria = await prisma.categoriaPrato.create({ data: req.body });
      return res.send(201, categoria);
    } catch (error) {
      console.error("[Categoria] Erro ao criar:", error.message);
      return res.send(500, { error: "Erro ao criar categoria." });
    }
=======

    try {

      const categoria = await prisma.categoriaPrato.create({
        data: req.body,
      });

      res.send(201, categoria);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao criar categoria",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // PUT /categorias/:id
  async updateCategoria(req, res) {
<<<<<<< HEAD
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.categoriaPrato.findUnique({
        where: { categoria_prato_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Categoria não encontrada." });

      const categoria = await prisma.categoriaPrato.update({
        where: { categoria_prato_id: Number(id) },
        data: req.body,
      });
      return res.send(200, categoria);
    } catch (error) {
      console.error("[Categoria] Erro ao atualizar:", error.message);
      return res.send(500, { error: "Erro ao atualizar categoria." });
    }
=======

    try {

      const { id } = req.params;

      const categoria = await prisma.categoriaPrato.update({
        where: {
          categoria_prato_id: Number(id),
        },
        data: req.body,
      });

      res.send(categoria);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao atualizar categoria",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // PATCH /categorias/:id
  async patchCategoria(req, res) {
<<<<<<< HEAD
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.categoriaPrato.findUnique({
        where: { categoria_prato_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Categoria não encontrada." });

      const categoria = await prisma.categoriaPrato.update({
        where: { categoria_prato_id: Number(id) },
        data: req.body,
      });
      return res.send(200, categoria);
    } catch (error) {
      console.error("[Categoria] Erro ao atualizar parcialmente:", error.message);
      return res.send(500, { error: "Erro ao atualizar categoria." });
    }
=======

    try {

      const { id } = req.params;

      const categoria = await prisma.categoriaPrato.update({
        where: {
          categoria_prato_id: Number(id),
        },
        data: req.body,
      });

      res.send(categoria);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao atualizar categoria",
      });

    }

>>>>>>> bf57a41 (Atualização)
  },

  // DELETE /categorias/:id
  async deleteCategoria(req, res) {
<<<<<<< HEAD
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.send(400, { error: "ID inválido." });

      const existe = await prisma.categoriaPrato.findUnique({
        where: { categoria_prato_id: Number(id) },
      });
      if (!existe) return res.send(404, { error: "Categoria não encontrada." });

      await prisma.categoriaPrato.delete({
        where: { categoria_prato_id: Number(id) },
      });
      return res.send(200, { message: "Categoria removida com sucesso." });
    } catch (error) {
      console.error("[Categoria] Erro ao remover:", error.message);
      return res.send(500, { error: "Erro ao remover categoria." });
    }
  },
=======

    try {

      const { id } = req.params;

      await prisma.categoriaPrato.delete({
        where: {
          categoria_prato_id: Number(id),
        },
      });

      res.send(204);

    } catch (error) {

      console.error(error);

      res.send(500, {
        error: "Erro ao remover categoria",
      });

    }

  },

>>>>>>> bf57a41 (Atualização)
};