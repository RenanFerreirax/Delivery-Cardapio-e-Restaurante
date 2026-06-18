/**
 * src/config/infisical.js
 * Carrega segredos do Infisical usando Universal Auth (Machine Identity)
 * com INFISICAL_CLIENT_ID / INFISICAL_CLIENT_SECRET.
 */

const { InfisicalSDK } = require("@infisical/sdk");

async function loadSecrets() {
  if (!process.env.INFISICAL_CLIENT_ID || !process.env.INFISICAL_CLIENT_SECRET) {
    console.warn("[Infisical] Chaves ausentes. Usando variáveis locais.");
    return;
  }

  const client = new InfisicalSDK({
    siteUrl: "https://app.infisical.com",
  });

  try {
    await client.auth().universalAuth.login({
      clientId: process.env.INFISICAL_CLIENT_ID,
      clientSecret: process.env.INFISICAL_CLIENT_SECRET,
    });

    const { secrets } = await client.secrets().listSecrets({
      projectId: process.env.INFISICAL_PROJECT_ID,
      environment: process.env.INFISICAL_ENV || "prod",
      secretPath: process.env.INFISICAL_SECRET_PATH || "/",
    });

    let count = 0;
    for (const secret of secrets) {
      process.env[secret.secretKey] = secret.secretValue;
      count++;
    }

    console.log(`[Infisical] ✅ ${count} secret(s) carregado(s).`);
  } catch (erro) {
    console.error("[Infisical] ❌ Erro crítico ao buscar as senhas no Infisical:", erro.message);
    process.exit(1);
  }
}

module.exports = { loadSecrets };
