# CyberScore — Site Web Vitrine

## Objectif
Landing page premium pour présenter CyberScore et générer
des contacts. Inclut une démo interactive simulée et un chatbot FAQ.

## Stack
- HTML + CSS + JavaScript vanilla
- Tailwind CSS via CDN
- Alpine.js via CDN
- Aucun framework, aucun npm, aucun build

## Sections de la page (dans l'ordre)
1. Navbar — logo + liens ancres + bouton CTA sticky
2. Hero — titre fort + score animé 0→73 + CTA "Voir la démo"
3. Problème — 4 réalités terrain en cards
4. Démo interactive — simulation du scan en direct
5. Solution — 3 étapes simples
6. Fonctionnalités — checks techniques + IA
7. Témoignages — 3 cards placeholder
8. Tarifs — 3 cards Starter / PME / Pro en FCFA
9. Contact — formulaire Formspree
10. Footer
11. Chatbot FAQ flottant

## Section démo interactive
- Bouton "Lancer le scan" déclenche l'animation
- Les checks apparaissent un par un avec délai (300ms entre chaque)
- Chaque check affiche : icône ✓ ou ✗ + nom + statut
- Checks conformes : Pare-feu ✓, Antivirus ✓, UAC ✓, RDP ✓
- Checks échoués : BitLocker ✗, Mises à jour ✗, Mot de passe ✗
- Score global monte progressivement de 0 à 73 (animation compteur)
- Score technique : 60/100, Score usage : 100/100
- Après le scan : dashboard mini avec score coloré +
  bouton "Demander un vrai diagnostic"
- Reset possible pour relancer la démo

## Formulaire de contact
- Provider : Formspree
- Action : https://formspree.io/f/mrervglo
- Champs : Nom complet, Email, Téléphone (optionnel), Message
- Soumission AJAX via fetch() — pas de rechargement de page
- Message de confirmation visuel après envoi réussi
- Message d'erreur si échec

## Chatbot FAQ
- Bulle flottante en bas à droite (icône message)
- S'ouvre au clic en petit panneau chat
- 100% JavaScript vanilla — aucune API externe
- Questions suggérées cliquables en chips

### Questions/Réponses
Q: C'est quoi CyberScore ?
R: CyberScore analyse la sécurité de vos postes Windows
   en 3 minutes et vous donne un score de 0 à 100 avec
   des recommandations concrètes en français.

Q: Combien ça coûte ?
R: À partir de 25 000 FCFA/mois pour jusqu'à 10 postes.
   Pas d'engagement, pas d'infrastructure requise.

Q: Faut-il un expert pour l'utiliser ?
R: Non. L'employé double-clique sur un fichier,
   voit son score en 3 minutes. Aucune compétence requise.

Q: Mes données sont-elles en sécurité ?
R: Oui. Toutes les communications sont chiffrées.
   Pour les institutions sensibles, un mode 100% local
   est disponible — aucune donnée ne quitte votre réseau.

Q: Ça fonctionne sur quel système ?
R: Windows 10 et Windows 11, domaine AD ou workgroup.

Q: Comment vous contacter ?
R: Via le formulaire sur cette page ou à
   teemaabdoulaye@gmail.com

### Design chatbot
- Bouton flottant : orange #E8620A
- Panneau : blanc avec header bleu #1A3A6B
- Animation d'ouverture fluide
- Fonctionne parfaitement sur mobile

## SEO & Meta
- Title : "CyberScore — Cyberhygiène pour les entreprises
  d'Afrique francophone"
- Description : "Analysez la sécurité de vos postes Windows
  en 3 minutes. Score clair, recommandations IA en français."
- Open Graph tags pour partage LinkedIn et WhatsApp
  (og:title, og:description, og:image, og:url)

## Analytics
- Intégrer Google Analytics via gtag.js
- Placeholder ID : G-C11WXW9KLR
- Tracker les clics sur "Lancer le scan" et "Demander un diagnostic"

## Section témoignages
- 3 cards avec photo placeholder, nom, poste, entreprise
- Texte placeholder crédible à remplacer après les premiers clients
- Design sobre et professionnel

## Design global
- Couleurs : bleu #1A3A6B, orange #E8620A, blanc
- Fond hero : gradient bleu foncé
- Moderne, épuré, premium
- Mobile-first responsive
- Animations fluides (pas agressives)
- Inspiré des meilleures landing pages SaaS 2025

## Règles
- Tout dans un seul fichier index.html
- Textes en français
- Ne pas utiliser Bootstrap
- Démo 100% JavaScript vanilla
- Formulaire via fetch() vers Formspree — pas mailto
- Chatbot 100% JavaScript vanilla — pas d'API externe

## Règles de comportement Claude Code

### 1. Plan Mode Default
- Entrer en plan mode pour toute tâche non triviale
- Si quelque chose déraille : STOP et re-planifier immédiatement

### 2. Subagent Strategy
- Utiliser des subagents pour garder le contexte propre
- Une tâche par subagent pour une exécution focalisée

### 3. Self-Improvement Loop
- Après toute correction : mettre à jour tasks/lessons.md
- Écrire des règles pour éviter la même erreur
- Relire lessons.md au début de chaque session

### 4. Verification Before Done
- Ne jamais marquer une tâche terminée sans prouver
  que ça fonctionne
- Se demander : "Un senior developer approuverait-il ça ?"

## Core Principles
- No Laziness : causes racines, pas de correctifs temporaires
- Impact : toucher uniquement ce qui est nécessaire,
  éviter d'introduire des bugs

## Progress

### Implémenté et testé

| Section | Statut | Notes |
|---|---|---|
| Navbar | ✅ | Logo réel, liens ancres, menu mobile Alpine.js, sticky |
| Hero | ✅ | Titre, CTA, browser frame + screenshot `cyberscore5.PNG` |
| Problème | ✅ | 4 cards (Visibilité, Conformité, Humain, Temps) |
| Démo interactive | ✅ | 7 checks séquentiels 300ms, compteur 0→73, scores technique/usage, reset, screenshots `cyberscore6.PNG` + `cyberscore1.PNG`, GA event `lancer_scan` |
| Solution | ✅ | 3 étapes numérotées |
| Fonctionnalités | ✅ | Bug couleurs corrigé (Tailwind config order + CSS fallbacks + inline style), screenshot `cyberscore4.PNG` |
| Témoignages | ✅ | 3 cards placeholder crédibles |
| Tarifs | ✅ | 3 plans Starter/PME/Pro en FCFA |
| Contact | ✅ | Formspree AJAX fetch(), confirmation/erreur visuels, Alpine.js |
| Footer | ✅ | Logo réel, liens, copyright |
| Chatbot FAQ | ✅ | 6 Q&As, chips cliquables, animation ouverture/fermeture, mobile |
| SEO & Open Graph | ✅ | title, description, og:title, og:description, og:image, og:url |
| Google Analytics | ✅ | gtag.js G-C11WXW9KLR, events `lancer_scan` + `demander_diagnostic` |
| Logo réel | ✅ | `logo.png` dans navbar, footer, chatbot |
| Scroll animations | ✅ | IntersectionObserver fade-in sur toutes les sections |
| Mobile responsive | ✅ | Mobile-first, menu hamburger, grilles adaptatives |

### Bugs corrigés

| Bug | Cause racine | Correctif |
|---|---|---|
| Fonctionnalités section blanche | `tailwind.config` défini AVANT le CDN script — le CDN écrasait la config | CDN d'abord, puis config ; + CSS fallbacks + inline `style=` |
| Dashboard n'animait pas au 2ème scan | `animation: forwards` sur règle CSS statique → pas de replay | Class `.dashboard-show` + `void el.offsetWidth` (force reflow) avant re-ajout |

### Reste à faire (post-déploiement)

- [ ] Remplacer `og:image` placeholder par URL image réelle après déploiement
- [ ] Mettre le vrai domaine dans `og:url` et balises meta
- [ ] Tester formulaire Formspree en production (vrai envoi email)
- [ ] Remplacer témoignages placeholder par vrais clients
- [ ] Optimiser images (convertir PNG → WebP, compresser)
- [ ] Ajouter pages légales (CGU, Politique de confidentialité)
- [ ] Vérifier performance Lighthouse (score cible > 90)