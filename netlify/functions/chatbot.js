// Uses Node's built-in https — no fetch, no AbortSignal, works on Node 14/16/18+
const https = require('https');

// ── Simple per-instance rate limiter ──────────────────────────────
// Netlify Functions are stateless; this limits abuse per instance.
// For stronger protection, add Cloudflare or Upstash in front.
var requestLog = new Map();

function isRateLimited(clientIP) {
  var now = Date.now();
  var windowMs = 60 * 1000;   // 1 minute
  var maxReq = 10;            // 10 requests per minute per IP

  var record = requestLog.get(clientIP);
  if (!record || now > record.resetTime) {
    requestLog.set(clientIP, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count++;
  requestLog.set(clientIP, record);
  return record.count > maxReq;
}

// ── Prompt ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Tu es l'assistant officiel de CyberScore.
CyberScore est un outil de diagnostic de sécurité informatique pour les PMEs d'Afrique francophone.

IMPORTANT — rappelle toujours si pertinent :
- CyberScore N'EST PAS un antivirus
- CyberScore NE protège PAS contre les attaques
- CyberScore EST un outil de diagnostic qui donne un score pour savoir où on en est
- C'est une première étape de sensibilisation, pas une solution de protection

Infos produit :
- Prix : à partir de 25 000 FCFA/mois (jusqu'à 10 ordinateurs)
- Plan PME : 60 000 FCFA/mois (jusqu'à 50 ordinateurs)
- Plan Pro : 150 000 FCFA/mois (ordinateurs illimités)
- Fonctionne sur Windows 10 et 11
- Aucune compétence technique requise
- Score de 0 à 100 : 60% technique + 40% comportement
- Mode local disponible (aucune donnée ne quitte le réseau)
- Contact : teemaabdoulaye@gmail.com
- Marché : Afrique francophone (Sénégal, Côte d'Ivoire, Mali, Cameroun)

Règles :
- Toujours en français
- Max 3 phrases par réponse
- Si hors sujet : rediriger vers le formulaire de contact
- Ton chaleureux et professionnel`;

function callDeepSeek(apiKey, userMessage) {
  return new Promise(function (resolve, reject) {
    var payload = JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    var options = {
      hostname: 'api.deepseek.com',
      path: '/chat/completions',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    var req = https.request(options, function (res) {
      var raw = '';
      res.on('data', function (chunk) { raw += chunk; });
      res.on('end', function () {
        try {
          var data = JSON.parse(raw);
          var reply = data && data.choices && data.choices[0] &&
                      data.choices[0].message && data.choices[0].message.content;
          if (reply) resolve(reply);
          else reject(new Error('empty reply: ' + raw));
        } catch (e) {
          reject(e);
        }
      });
    });

    // 10-second timeout
    req.setTimeout(10000, function () {
      req.destroy(new Error('timeout'));
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // ── Rate limiting ───────────────────────────────────────────────
  var clientIP = (event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown').split(',')[0].trim();
  if (isRateLimited(clientIP)) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: 'Trop de messages envoyés. Veuillez patienter une minute ou contactez-nous à teemaabdoulaye@gmail.com' }),
    };
  }

  var apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    // Key not set in Netlify — tell the frontend so it can use static fallback
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'no_key' }),
    };
  }

  var message;
  try {
    var body = JSON.parse(event.body || '{}');
    message = (body.message || '').trim();
  } catch (_) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Requête invalide' }) };
  }

  if (!message)         return { statusCode: 400, body: JSON.stringify({ error: 'Message vide' }) };
  if (message.length > 500) return { statusCode: 400, body: JSON.stringify({ error: 'Message trop long' }) };

  try {
    var reply = await callDeepSeek(apiKey, message);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: reply }),
    };
  } catch (err) {
    // Log for Netlify function logs (visible in dashboard)
    console.error('DeepSeek error:', err.message);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'api_error' }),
    };
  }
};
