<<<<<<< HEAD
// src/server.js
require("dotenv").config();

const restify = require("restify");
const { connect, closeConnection } = require("./rabbitmq/connection");
const { startAllConsumers }        = require("./rabbitmq/consumer");
=======
require("dotenv").config();

const restify = require("restify");
const { connect }          = require("./config/rabbitmq/connection");
const { startAllConsumers } = require("./config/rabbitmq/consumer");
>>>>>>> bf57a41 (Atualização)

const RestauranteController    = require("./controllers/restaurante.controller");
const PratoController          = require("./controllers/prato.controller");
const CategoriaPratoController = require("./controllers/categoriaPrato.controller");

<<<<<<< HEAD
const server = restify.createServer({ name: "api-restaurante-cardapio" });
=======
const server = restify.createServer({
  name: "api-restaurante-cardapio",
});
>>>>>>> bf57a41 (Atualização)

// ── CORS ──────────────────────────────────────────────────────────────────────
server.pre((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  return next();
});

server.opts("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.send(200);
  return next();
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// ── Restaurantes ──────────────────────────────────────────────────────────────
server.get("/restaurantes",       RestauranteController.getRestaurantes);
server.get("/restaurantes/:id",   RestauranteController.getRestauranteById);
server.post("/restaurantes",      RestauranteController.createRestaurante);
server.put("/restaurantes/:id",   RestauranteController.updateRestaurante);
server.patch("/restaurantes/:id", RestauranteController.patchRestaurante);
server.del("/restaurantes/:id",   RestauranteController.deleteRestaurante);

// ── Pratos ────────────────────────────────────────────────────────────────────
server.get("/pratos",                 PratoController.getPratos);
<<<<<<< HEAD
server.get("/pratos/:id",             PratoController.getPratoById);
server.post("/pratos",                PratoController.createPrato);
server.put("/pratos/:id",             PratoController.updatePrato);
server.patch("/pratos/:id",           PratoController.patchPrato);
server.del("/pratos/:id",             PratoController.deletePrato);
server.get("/pratos/restaurante/:id", PratoController.getPratosByRestaurante);
server.get("/pratos/categoria/:id",   PratoController.getPratosByCategoria);
=======
server.get("/pratos/restaurante/:id", PratoController.getPratosByRestaurante);
server.get("/pratos/categoria/:id",   PratoController.getPratosByCategoria);
server.get("/pratos/:id",             PratoController.getPratoById);
server.post("/pratos",                PratoController.createPrato);
server.put("/pratos/:id",             PratoController.updatePrato);
server.patch("/pratos/:id",           PratoController.patchPrato);
server.del("/pratos/:id",             PratoController.deletePrato);
>>>>>>> bf57a41 (Atualização)

// ── Categorias ────────────────────────────────────────────────────────────────
server.get("/categorias",       CategoriaPratoController.getCategorias);
server.get("/categorias/:id",   CategoriaPratoController.getCategoriaById);
server.post("/categorias",      CategoriaPratoController.createCategoria);
server.put("/categorias/:id",   CategoriaPratoController.updateCategoria);
server.patch("/categorias/:id", CategoriaPratoController.patchCategoria);
server.del("/categorias/:id",   CategoriaPratoController.deleteCategoria);

// ── Inicialização ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 9521;

async function bootstrap() {
<<<<<<< HEAD
  // RabbitMQ em background — API sobe mesmo sem ele disponível
=======
  console.log("🚀 Iniciando aplicação...");

  // RabbitMQ em background — API sobe mesmo sem ele
>>>>>>> bf57a41 (Atualização)
  connect()
    .then(() => startAllConsumers())
    .catch((err) => {
      console.warn("[RabbitMQ] ⚠️  Rodando sem RabbitMQ:", err.message);
    });

  // API sobe independente do RabbitMQ
  server.listen(PORT, () => {
<<<<<<< HEAD
    console.log(`\n✅ ${server.name} rodando em ${server.url}`);
    console.log(`🐇 RabbitMQ: ${process.env.RABBITMQ_URL || "amqp://localhost:5672"}`);
    console.log(`🗄️  Banco:    ${process.env.DATABASE_URL}\n`);
  });
}

process.on("SIGINT",  shutdown);
process.on("SIGTERM", shutdown);

async function shutdown() {
  console.log("\n🛑 Encerrando servidor...");
  server.close(async () => {
    await closeConnection();
    console.log("👋 Servidor encerrado.");
    process.exit(0);
  });
}
=======
    console.log(`✅ API rodando na porta ${PORT}`);
    console.log(`🐇 RabbitMQ: ${process.env.RABBITMQ_URL || "amqp://localhost:5672"}`);
    console.log(`🗄️  Banco:    ${process.env.DATABASE_URL}`);
  });
}

process.on("SIGINT",  () => { server.close(() => process.exit(0)); });
process.on("SIGTERM", () => { server.close(() => process.exit(0)); });
>>>>>>> bf57a41 (Atualização)

bootstrap();