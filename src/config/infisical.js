/**
 * src/config/infisical.js
 * SDK @infisical/sdk v5 — autenticação via accessToken (Service Token)
 */
 
const { InfisicalSDK } = require('@infisical/sdk');
 
const INFISICAL_TOKEN      = process.env.INFISICAL_TOKEN      || 'st.a8d4efd8-4227-44c5-8952-2f14d0b90c77.3046c98d130b4f4c9aadbfab811161a2.87431cc662cbadacbd0ecea2442426a0';
const INFISICAL_PROJECT_ID = process.env.INFISICAL_PROJECT_ID || '75293cd1-53c5-4a7c-860e-c515f97de341';
const INFISICAL_ENV        = process.env.INFISICAL_ENV        || 'prod';
 
async function loadSecrets() {
  // if (process.env.NODE_ENV !== 'production') {
  //   console.log('[Infisical] NODE_ENV !== production — usando variáveis locais (.env)');
  //   return;
  // }
 
  try {
    console.log(`[Infisical] Conectando... projeto: ${INFISICAL_PROJECT_ID} | ambiente: ${INFISICAL_ENV}`);
 
    const client = new InfisicalSDK({ siteUrl: 'https://app.infisical.com' });
 
    // SDK v5: Service Token usa accessToken() diretamente
    await client.auth().accessToken(INFISICAL_TOKEN);
 
    const { secrets } = await client.secrets().listSecrets({
      projectId:   INFISICAL_PROJECT_ID,
      environment: INFISICAL_ENV,
      secretPath:  '/',
    });
 
    let count = 0;
    for (const secret of secrets) {
      if (!process.env[secret.secretKey]) {
        process.env[secret.secretKey] = secret.secretValue;
        count++;
      }
    }
 
    console.log(`[Infisical] ✅ ${count} secret(s) carregado(s).`);
  } catch (err) {
    console.error('[Infisical] ❌ Erro ao carregar secrets:', err.message);
    process.exit(1);
  }
}
 
module.exports = { loadSecrets };