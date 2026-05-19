// src/rabbitmq/consumer.js
const { getChannel, QUEUES, ROUTING_KEYS } = require("./connection");

const handlers = {

  [ROUTING_KEYS.RESTAURANTE_CRIADO]: async (data) => {
    console.log("[Consumer] 🏪 Restaurante criado — ID:", data.restaurante_id, "| Nome:", data.restaurante_nome);
  },

  [ROUTING_KEYS.RESTAURANTE_ATUALIZADO]: async (data) => {
    console.log("[Consumer] ✏️  Restaurante atualizado — ID:", data.restaurante_id);
  },

  [ROUTING_KEYS.RESTAURANTE_REMOVIDO]: async (data) => {
    console.log("[Consumer] 🗑️  Restaurante removido — ID:", data.restaurante_id);
  },

  [ROUTING_KEYS.PRATO_CRIADO]: async (data) => {
    console.log("[Consumer] 🍽️  Prato criado — ID:", data.prato_id, "| Nome:", data.prato_nome);
  },

  [ROUTING_KEYS.PRATO_ATUALIZADO]: async (data) => {
    console.log("[Consumer] ✏️  Prato atualizado — ID:", data.prato_id);
  },

  [ROUTING_KEYS.PRATO_REMOVIDO]: async (data) => {
    console.log("[Consumer] 🗑️  Prato removido — ID:", data.prato_id);
  },
};

async function processMessage(channel, msg) {
  if (!msg) return;

  let parsed;

  try {
    parsed = JSON.parse(msg.content.toString());
  } catch {
    console.error("[Consumer] ❌ JSON inválido. Descartando mensagem.");
    channel.nack(msg, false, false);
    return;
  }

  const { event, data } = parsed;
  const handler = handlers[event];

  if (!handler) {
    console.warn(`[Consumer] ⚠️  Sem handler para "${event}". Descartando.`);
    channel.nack(msg, false, false);
    return;
  }

  try {
    await handler(data);
    channel.ack(msg);
    console.log(`[Consumer] ✅ Evento "${event}" processado.`);
  } catch (error) {
    console.error(`[Consumer] ❌ Erro ao processar "${event}":`, error.message);
    channel.nack(msg, false, true);
  }
}

async function startAllConsumers() {
  const channel = getChannel();
  console.log("[Consumer] 🚀 Iniciando consumers...");
  await channel.consume(QUEUES.RESTAURANTES, (msg) => processMessage(channel, msg));
  await channel.consume(QUEUES.PRATOS,       (msg) => processMessage(channel, msg));
  console.log("[Consumer] ✅ Consumers ativos — aguardando mensagens.\n");
}

module.exports = { startAllConsumers };