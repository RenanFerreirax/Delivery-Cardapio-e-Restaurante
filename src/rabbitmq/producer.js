// src/rabbitmq/producer.js
const { getChannel, EXCHANGE_NAME, ROUTING_KEYS } = require("./connection");

async function publish(routingKey, payload) {
  try {
    const channel = getChannel();

    const message = {
      event:     routingKey,
      timestamp: new Date().toISOString(),
      data:      payload,
    };

    const buffer  = Buffer.from(JSON.stringify(message));
    const options = {
      persistent:  true,
      contentType: "application/json",
      headers: { source: "api-restaurante-cardapio" },
    };

    channel.publish(EXCHANGE_NAME, routingKey, buffer, options);
    console.log(`[Producer] 📤 Evento publicado: "${routingKey}"`);

  } catch (error) {
    console.error(`[Producer] ❌ Falha ao publicar "${routingKey}":`, error.message);
  }
}

// ── Restaurante ───────────────────────────────────────────────────────────────
async function publishRestauranteCriado(data)     { await publish(ROUTING_KEYS.RESTAURANTE_CRIADO, data); }
async function publishRestauranteAtualizado(data) { await publish(ROUTING_KEYS.RESTAURANTE_ATUALIZADO, data); }
async function publishRestauranteRemovido(id)     { await publish(ROUTING_KEYS.RESTAURANTE_REMOVIDO, { restaurante_id: Number(id) }); }

// ── Prato ─────────────────────────────────────────────────────────────────────
async function publishPratoCriado(data)     { await publish(ROUTING_KEYS.PRATO_CRIADO, data); }
async function publishPratoAtualizado(data) { await publish(ROUTING_KEYS.PRATO_ATUALIZADO, data); }
async function publishPratoRemovido(id)     { await publish(ROUTING_KEYS.PRATO_REMOVIDO, { prato_id: Number(id) }); }

module.exports = {
  publishRestauranteCriado,
  publishRestauranteAtualizado,
  publishRestauranteRemovido,
  publishPratoCriado,
  publishPratoAtualizado,
  publishPratoRemovido,
};