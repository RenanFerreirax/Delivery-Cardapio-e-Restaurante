const {
  getChannel,
  EXCHANGE_NAME,
  ROUTING_KEYS,
} = require("./connection");

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLICADOR GENÉRICO
// ═══════════════════════════════════════════════════════════════════════════════

async function publish(routingKey, payload) {

  const channel = getChannel();

  const message = {
    event: routingKey,
    timestamp: new Date().toISOString(),
    data: payload,
  };

  const buffer =
    Buffer.from(JSON.stringify(message));

  const options = {
    persistent: true,

    contentType: "application/json",

    headers: {
      source: "api-restaurante-cardapio",
      version: "1.0.0",
    },
  };

  const ok = channel.publish(
    EXCHANGE_NAME,
    routingKey,
    buffer,
    options
  );

  if (!ok) {

    console.warn(
      `[Producer] ⚠️ Buffer cheio: ${routingKey}`
    );

  }

  console.log(
    `[Producer] 📤 Evento publicado: ${routingKey}`
  );

  return ok;

}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTOS RESTAURANTE
// ═══════════════════════════════════════════════════════════════════════════════

async function publishRestauranteCriado(
  restaurante
) {

  return publish(
    ROUTING_KEYS.RESTAURANTE_CRIADO,
    restaurante
  );

}

async function publishRestauranteAtualizado(
  restaurante
) {

  return publish(
    ROUTING_KEYS.RESTAURANTE_ATUALIZADO,
    restaurante
  );

}

async function publishRestauranteRemovido(
  id
) {

  return publish(
    ROUTING_KEYS.RESTAURANTE_REMOVIDO,
    {
      restaurante_id: Number(id),
    }
  );

}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTOS PRATO
// ═══════════════════════════════════════════════════════════════════════════════

async function publishPratoCriado(prato) {

  return publish(
    ROUTING_KEYS.PRATO_CRIADO,
    prato
  );

}

async function publishPratoAtualizado(
  prato
) {

  return publish(
    ROUTING_KEYS.PRATO_ATUALIZADO,
    prato
  );

}

async function publishPratoRemovido(id) {

  return publish(
    ROUTING_KEYS.PRATO_REMOVIDO,
    {
      prato_id: Number(id),
    }
  );

}

module.exports = {

  // Restaurante
  publishRestauranteCriado,
  publishRestauranteAtualizado,
  publishRestauranteRemovido,

  // Prato
  publishPratoCriado,
  publishPratoAtualizado,
  publishPratoRemovido,

};