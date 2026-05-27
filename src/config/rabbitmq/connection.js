// src/rabbitmq/connection.js
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://admin:admin@10.136.38.50:5672";
const RECONNECT_DELAY_MS = 5000;

let connection = null;
let channel    = null;

const EXCHANGE_NAME = "delivery_platform";
const EXCHANGE_TYPE = "topic";

const QUEUES = {
  RESTAURANTES: "restaurantes_queue",
  PRATOS:       "pratos_queue",
  DEAD_LETTER:  "dead_letter_queue",
};

const ROUTING_KEYS = {
  RESTAURANTE_CRIADO:     "restaurante.criado",
  RESTAURANTE_ATUALIZADO: "restaurante.atualizado",
  RESTAURANTE_REMOVIDO:   "restaurante.removido",
  PRATO_CRIADO:           "prato.criado",
  PRATO_ATUALIZADO:       "prato.atualizado",
  PRATO_REMOVIDO:         "prato.removido",
};

async function connect() {
  try {
    console.log("[RabbitMQ] 🔌 Conectando em:", RABBITMQ_URL);

    connection = await amqp.connect(RABBITMQ_URL);
    channel    = await connection.createChannel();

    await channel.prefetch(1);

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
    await channel.assertExchange("dead_letter_exchange", "direct", { durable: true });

    await channel.assertQueue(QUEUES.RESTAURANTES, {
      durable: true,
      arguments: { "x-dead-letter-exchange": "dead_letter_exchange" },
    });
    await channel.bindQueue(QUEUES.RESTAURANTES, EXCHANGE_NAME, "restaurante.#");

    await channel.assertQueue(QUEUES.PRATOS, {
      durable: true,
      arguments: { "x-dead-letter-exchange": "dead_letter_exchange" },
    });
    await channel.bindQueue(QUEUES.PRATOS, EXCHANGE_NAME, "prato.#");

    await channel.assertQueue(QUEUES.DEAD_LETTER, { durable: true });
    await channel.bindQueue(QUEUES.DEAD_LETTER, "dead_letter_exchange", "");

    connection.on("error", (err) => {
      console.error("[RabbitMQ] ❌ Erro na conexão:", err.message);
    });

    connection.on("close", () => {
      console.warn("[RabbitMQ] ⚠️  Conexão encerrada. Reconectando em", RECONNECT_DELAY_MS / 1000, "s...");
      connection = null;
      channel    = null;
      setTimeout(connect, RECONNECT_DELAY_MS);
    });

    console.log("[RabbitMQ] ✅ Conectado com sucesso!");
    console.log("[RabbitMQ] 📦 Exchange:", EXCHANGE_NAME);
    console.log("[RabbitMQ] 📬 Queues:", Object.values(QUEUES).join(", "));

  } catch (error) {
    console.error("[RabbitMQ] ❌ Falha ao conectar:", error.message);
    console.log("[RabbitMQ] 🔄 Reconectando em", RECONNECT_DELAY_MS / 1000, "s...");
    setTimeout(connect, RECONNECT_DELAY_MS);
  }
}

function getChannel() {
  if (!channel) {
    throw new Error("[RabbitMQ] Channel não disponível.");
  }
  return channel;
}

async function closeConnection() {
  try {
    if (channel)    await channel.close();
    if (connection) await connection.close();
    console.log("[RabbitMQ] 🔒 Conexão encerrada.");
  } catch (error) {
    console.error("[RabbitMQ] Erro ao encerrar:", error.message);
  }
}

module.exports = {
  connect,
  getChannel,
  closeConnection,
  EXCHANGE_NAME,
  QUEUES,
  ROUTING_KEYS,
};