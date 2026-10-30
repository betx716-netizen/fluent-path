# Fluent Path

Application d'anglais personnelle, gamifiée, centrée sur le commerce, le transit et l'usage professionnel.
Mascotte : Zazou le calao. Version **phase 2** (voix), coût : **0 €**.

## Ce que contient la phase 1

- Accueil : prénom, objectif, temps par jour
- Carte de progression en zigzag : 6 sections (A1 à C2), unités à débloquer, coffre, test de section
- Section 1 complète : 6 unités, 50 exercices (Se présenter, Mon entreprise, Nombres et prix, Accueillir un client, Conteneur et dossier, Prendre rendez-vous)
- 5 types d'exercices : QCM, phrase à trous, phrase à construire, écoute, paires
- Correction en français après chaque réponse ; les erreurs reviennent en fin de leçon
- XP, étoiles (3 sur 5 pour débloquer la suite), gemmes, série de jours, gels de série, 9 trophées, objectif du jour
- Sons et vibrations, voix anglaise du téléphone (gratuite), thème clair et sombre
- Installable sur Android depuis Chrome (PWA), fonctionne hors ligne une fois chargée
- Sauvegarde sur le téléphone ; sauvegarde en ligne facultative avec Supabase (gratuit)

## Ce qu'ajoute la phase 2 (voix)

- **Parler** : 10 jeux de rôle (client nigérian, agent maritime américain, fournisseuse indienne, client britannique mécontent…). Tu parles au micro, l'interlocuteur répond avec son accent, 3 objectifs à remplir par conversation
- **Bilan** : note sur 100, note de voix, 3 erreurs expliquées en français, nouveaux mots ajoutés aux révisions
- **Répétition notée** : un exercice oral par unité, note mot à mot (mots verts / rouges), bouton « Je ne peux pas parler maintenant »
- **Révisions** : cartes en répétition espacée, alimentées par les unités validées et les bilans
- 4 nouveaux trophées

La voix utilise la reconnaissance vocale gratuite de Chrome (meilleure sur Android). Sans micro, tout se fait au clavier.

## Activer le tuteur IA (gratuit)

Deux possibilités :

- **Simple** : crée une clé sur https://aistudio.google.com (« Get API key », sans carte bancaire) et colle-la dans **Profil → Tuteur IA**. Elle reste sur ton téléphone.
- **Plus sûr, une fois l'app sur Vercel** : dans **Settings → Environment Variables**, ajoute `GEMINI_API_KEY` (ta clé) et `APP_PASSCODE` (un code de ton choix), puis redéploie. Recopie le code dans **Profil → Tuteur IA**. La clé reste sur le serveur (`api/tutor.js`).

Le modèle par défaut est `gemini-2.5-flash` ; s'il n'existe plus, mets le nom d'un modèle « Flash » actuel dans Profil (ou `GEMINI_MODEL` sur Vercel). Sur l'offre gratuite, Google peut utiliser les échanges : n'écris rien de confidentiel.

## Lancer sur ton ordinateur

```bash
npm install
npm run dev
```

Puis ouvre l'adresse affichée (par exemple http://localhost:5173).

## Mettre en ligne gratuitement (Vercel)

1. Mets ce dossier sur GitHub.
2. Sur https://vercel.com, connecte-toi avec GitHub, clique **Add New → Project** et choisis le dépôt.
3. Laisse les réglages par défaut (Vite est détecté) et clique **Deploy**.
4. Ouvre l'adresse `…vercel.app` dans Chrome sur ton téléphone, menu ⋮ → **Ajouter à l'écran d'accueil**.

## Activer la sauvegarde en ligne (facultatif, gratuit)

1. Crée un projet sur https://supabase.com (offre gratuite).
2. Dans **SQL Editor**, colle et exécute le fichier `supabase/migrations/0001_init.sql`.
3. Dans **Authentication → URL Configuration**, ajoute l'adresse de ton site Vercel.
4. Dans **Project Settings → API**, copie l'URL et la clé `anon`.
5. Sur Vercel (**Settings → Environment Variables**), ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`, puis redéploie.
6. Dans l'app, onglet **Profil → Sauvegarde en ligne**, entre ton e-mail et ouvre le lien reçu.

## Structure

| Dossier | Contenu |
| --- | --- |
| `src/data/units.ts` | Le contenu pédagogique (sections, unités, exercices) |
| `src/lib/game.ts` | Règles du jeu : XP, étoiles, déblocage, coffres, trophées |
| `src/lib/store.ts` | État de l'app, sauvegarde locale, série de jours |
| `src/lib/sync.ts` | Sauvegarde en ligne Supabase (facultative) |
| `src/exercises/` | Les 6 types d'exercices (dont l'oral) |
| `src/data/scenarios.ts` | Les 10 jeux de rôle |
| `src/lib/ai.ts`, `src/lib/tutor.ts` | Le tuteur IA (Gemini gratuit) et ses consignes |
| `src/lib/listen.ts`, `src/lib/score.ts` | Le micro et la note de prononciation |
| `api/tutor.js` | Fonction serveur Vercel qui garde la clé secrète |
| `src/screens/` | Les écrans : accueil, carte, leçon, victoire, profil |
| `src/components/Zazou.tsx` | La mascotte, en SVG animé |
| `supabase/migrations/` | Tables et règles de sécurité de la base |

## Prochaines phases

- ~~Phase 2 — Voix~~ : faite
- **Phase 3 — Premium** : animations Rive de Zazou, studio des accents, atelier d'écriture
- **Phase 4 — Contenu** : 60 unités, 20 scénarios, tests de section
