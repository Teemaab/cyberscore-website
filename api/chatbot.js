const SYSTEM_PROMPT = `Tu es l'assistant officiel de CyberScore.
CyberScore est un outil de diagnostic de sécurité informatique
pour les PMEs d'Afrique francophone.

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

Règles de réponse :
- Toujours en français
- Réponses courtes et claires (max 3 phrases)
- Si question hors sujet : rediriger vers le formulaire de contact
- Ton chaleureux et professionnel
- Ne jamais inventer des fonctionnalités inexistantes`;

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Service indisponible' });
  }

  const body = req.body || {};
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!message) {
    return res.status(400).json({ error: 'Message vide' });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: 'Message trop long' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
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
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!upstream.ok) {
      throw new Error(`DeepSeek ${upstream.status}`);
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) throw new Error('empty reply');

    return res.json({ reply });

  } catch (err) {
    clearTimeout(timeout);
    return res.json({
      reply:
        'Je ne suis pas disponible pour le moment. ' +
        'Contactez-nous à teemaabdoulaye@gmail.com',
    });
  }
};
