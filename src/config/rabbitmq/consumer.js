const {
  getChannel,
  QUEUES,
  ROUTING_KEYS,
} = require("./connection");

// ═══════════════════════════════════════════════════════════════════════════════
// HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

const handlers = {

  // ── Restaurante ────────────────────────────────────────────────────────────

  [ROUTING_KEYS.RESTAURANTE_CRIADO]:
    async (data) => {

      console.log(
        "[Consumer] 🏪 Restaurante criado:"
      );

      console.log(
        "ID:",
        data.restaurante_id
      );

      console.log(
        "Nome:",
        data.restaurante_nome
      );

    },

  [ROUTING_KEYS.RESTAURANTE_ATUALIZADO]:
    async (data) => {

      console.log(
        "[Consumer] ✏️ Restaurante atualizado:"
      );

      console.log(
        "ID:",
        data.restaurante_id
      );

    },

  [ROUTING_KEYS.RESTAURANTE_REMOVIDO]:
    async (data) => {

      console.log(
        "[Consumer] 🗑️ Restaurante removido:"
      );

      console.log(
        "ID:",
        data.restaurante_id
      );

    },

  // ── Pratos ─────────────────────────────────────────────────────────────────

  [ROUTING_KEYS.PRATO_CRIADO]:
    async (data) => {

      console.log(
        "[Consumer] 🍽️ Prato criado:"
      );

      console.log(
        "ID:",
        data.prato_id
      );

      console.log(
        "Nome:",
        data.prato_nome
      );

      console.log(
        "Preço:",
        data.prato_preco
      );

      // ✅ corrigido
      console.log(
        "Restaurante ID:",
        data.restaurante_id
      );

    },

  [ROUTING_KEYS.PRATO_ATUALIZADO]:
    async (data) => {

      console.log(
        "[Consumer] ✏️ Prato atualizado:"
      );

      console.log(
        "ID:",
        data.prato_id
      );

    },

  [ROUTING_KEYS.PRATO_REMOVIDO]:
    async (data) => {

      console.log(
        "[Consumer] 🗑️ Prato removido:"
      );

      console.log(
        "ID:",
        data.prato_id
      );

    },

};

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESSAMENTO
// ═══════════════════════════════════════════════════════════════════════════════

async function processMessage(
  channel,
  msg
) {

  if (!msg) return;

  let parsedMessage;

  try {

    parsedMessage =
      JSON.parse(msg.content.toString());

  } catch (error) {

    console.error(
      "[Consumer] ❌ JSON inválido"
    );

    channel.nack(msg, false, false);

    return;

  }

  const {
    event,
    data,
  } = parsedMessage;

  const handler = handlers[event];

  if (!handler) {

    console.warn(
      `[Consumer] ⚠️ Evento não encontrado: ${event}`
    );

    channel.nack(msg, false, false);

    return;

  }

  try {

    await handler(data);

    channel.ack(msg);

    console.log(
      `[Consumer] ✅ Evento processado: ${event}`
    );

  } catch (error) {

    console.error(
      `[Consumer] ❌ Erro: ${error.message}`
    );

    channel.nack(msg, false, true);

  }

}

// ═══════════════════════════════════════════════════════════════════════════════
// START CONSUMERS
// ═══════════════════════════════════════════════════════════════════════════════

async function startRestaurantesConsumer() {

  const channel = getChannel();

  console.log(
    `[Consumer] 👂 Queue: ${QUEUES.RESTAURANTES}`
  );

  await channel.consume(
    QUEUES.RESTAURANTES,
    (msg) => processMessage(channel, msg)
  );

}

async function startPratosConsumer() {

  const channel = getChannel();

  console.log(
    `[Consumer] 👂 Queue: ${QUEUES.PRATOS}`
  );

  await channel.consume(
    QUEUES.PRATOS,
    (msg) => processMessage(channel, msg)
  );

}

async function startAllConsumers() {

  console.log(
    "[Consumer] 🚀 Iniciando consumers..."
  );

  await startRestaurantesConsumer();

  await startPratosConsumer();

  console.log(
    "[Consumer] ✅ Consumers ativos!"
  );

}

module.exports = {
  startAllConsumers,
  startRestaurantesConsumer,
  startPratosConsumer,
};