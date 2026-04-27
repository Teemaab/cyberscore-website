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

exports.handler = async function (event) {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // API key must come from Netlify environment variables — never from code
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return { statusCode: 503, body: JSON.stringify({ error: 'Service indisponible' }) };
  }

  // Parse body safely
  let message;
  try {
    const body = JSON.parse(event.body || '{}');
    message = (body.message || '').trim();
  } catch (_) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Requête invalide' }) };
  }

  if (!message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Message vide' }) };
  }
  if (message.length > 500) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Message trop long' }) };
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error(`DeepSeek ${response.status}`);

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error('empty reply');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };

  } catch (_) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reply: 'Je ne suis pas disponible pour le moment. Contactez-nous à teemaabdoulaye@gmail.com',
      }),
    };
  }
};
