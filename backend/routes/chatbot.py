from flask import Blueprint, request, jsonify
import requests
import os

chatbot_bp = Blueprint('chatbot', __name__)

DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')

SYSTEM_PROMPT = """
Tu es l'assistant officiel de CyberScore.
CyberScore est un outil de diagnostic de cyberhygiène
pour les PMEs d'Afrique francophone.

IMPORTANT — ce que tu dois toujours rappeler si pertinent :
- CyberScore N'EST PAS un antivirus
- CyberScore NE protège PAS contre les attaques
- CyberScore EST un outil de diagnostic qui donne
  un score de sécurité pour savoir où on en est
- C'est une première étape de sensibilisation,
  pas une solution de protection

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
- Ne jamais inventer des fonctionnalités qui n'existent pas
"""


@chatbot_bp.route('/api/chatbot', methods=['POST'])
def chatbot():
    if not DEEPSEEK_API_KEY:
        return jsonify({'error': 'Service indisponible'}), 503

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Requête invalide'}), 400

    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({'error': 'Message vide'}), 400

    if len(user_message) > 500:
        return jsonify({'error': 'Message trop long'}), 400

    try:
        response = requests.post(
            'https://api.deepseek.com/chat/completions',
            headers={
                'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'deepseek-chat',
                'messages': [
                    {'role': 'system', 'content': SYSTEM_PROMPT},
                    {'role': 'user', 'content': user_message}
                ],
                'max_tokens': 150,
                'temperature': 0.7
            },
            timeout=10
        )
        response.raise_for_status()

        result = response.json()
        reply = result['choices'][0]['message']['content']
        return jsonify({'reply': reply})

    except requests.exceptions.Timeout:
        return jsonify({
            'reply': 'La réponse prend trop de temps. '
                     'Contactez-nous directement à teemaabdoulaye@gmail.com'
        }), 200

    except Exception:
        return jsonify({
            'reply': 'Je ne suis pas disponible pour le moment. '
                     'Contactez-nous à teemaabdoulaye@gmail.com'
        }), 200
