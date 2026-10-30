# Fluent Path — ZAZOU

Application d'anglais personnelle, gamifiée, centrée sur le commerce, le transit et l'usage professionnel.
Mascotte : Zazou le calao. Version **phase 4** (contenu complet), coût : **0 €**.

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

## Ce qu'ajoute la phase 3 (premium)

- **Studio des accents** : une même phrase de travail en 6 accents (américain, britannique, nigérian, ghanéen, indien, sud-africain), 3 vitesses, les traits de chaque accent expliqués en français, shadowing au micro
- **Paires minimales** : jeu de 10 manches sur les sons qui piègent les francophones (ship/sheep, think/sink, hat/at…)
- **Dictée** : une phrase lue dans un accent au hasard, correction mot à mot
- **Atelier d'écriture** (onglet Réviser → Écriture) : 8 sujets d'e-mails pros (commerce, transit), note, erreurs soulignées et expliquées, version professionnelle à écouter
- **Garde-robe de Zazou** : 5 tenues à acheter avec tes gemmes (casquette, cravate, écharpe kente, lunettes, couronne)
- Zazou réagit à chaque réponse dans les leçons, « +10 XP » animé, 6 nouveaux trophées

Note : les animations de Zazou sont en SVG et CSS. Rive demanderait de dessiner Zazou dans l'éditeur Rive ; ce sera possible plus tard sans changer le reste de l'app.

## Deux parcours

- **Anglais général** (programme ZAZOU 1.0, `src/data/course.ts`) : 6 chapitres, 30 unités du A1.1 au B1.2. Le chapitre 1 « Les bases » est prêt : 5 unités × 5 leçons (Bonjour !, Les chiffres, Ma famille, Au maquis, En ville). Chaque leçon : 5 mots à découvrir (avec prononciation à la française), 3 « que veut dire… », 2 phrases à remettre en ordre après écoute, 4 phrases à dire, 1 phrase à traduire à l'oral. La 5ᵉ leçon de chaque unité se termine par une **conversation IA** (aéroport d'Abidjan, kiosque, photo de famille, maquis de Yopougon, touriste perdue au Plateau). Les chapitres 2 à 6 sont affichés « bientôt » avec leurs unités.
- **Anglais pro** (commerce, transit) : les 60 unités ci-dessous.

Réglages repris du programme : leçons de 5 à 7 min, objectif quotidien de 5, 10, 15 ou 20 min, 5 vies, note de prononciation en couleur (≥ 85 parfait, 60–84 presque, < 60 réessaie), seuil de réussite propre à chaque phrase (70, ou 65 pour la traduction à l'oral).

## Écrans ajoutés (inscription, test oral, sons, ligue, profil)

- **Inscription en 3 étapes** : prénom, numéro WhatsApp (+225), objectif (Travail, Voyages, Études, Business), temps par jour, puis test de niveau. La connexion par code SMS passe par Supabase Auth (téléphone) : elle demande la sauvegarde en ligne et un fournisseur SMS branché dans Supabase (payant). Sans eux, le numéro reste sur le téléphone.
- **Test de niveau oral** : 6 questions, 3 minutes, 30 s par réponse, niveau estimé A0 → B1 en direct. Notation hors ligne (longueur de la réponse + structure attendue). Le niveau ouvre le chapitre de départ du parcours général et la section pro du même niveau.
- **Sons** : son de la semaine, 3 onglets (Pièges FR, Voyelles, Consonnes), maîtrise par son ; le Studio des accents est dans cet onglet.
- **Ligue** : 6 ligues (Cauri → Diamant), groupe de 20, 5 montent et 5 descendent chaque lundi. Les 19 autres joueurs sont simulés tant que l'app n'a qu'un utilisateur.
- **Profil** : niveau A0 → B1, série, XP, minutes parlées, ligue, succès avec barre de progression. Les révisions s'ouvrent depuis l'Accueil.

## Ce qu'ajoute la phase 4 (contenu)

- **60 unités** sur 6 sections, du niveau A1 au niveau C2, 600 exercices, toutes tournées vers le commerce, le transit et le travail (douane, Incoterms, crédit documentaire, surestaries, négociation, réunions…)
- **20 jeux de rôle**, dont 10 nouveaux jusqu'au niveau C2 (Incoterms, litige sur surestaries, banquière nigériane, investisseuse londonienne, salon à Lagos)
- **Tests de section** : 15 questions, 80 % pour ouvrir la section suivante ; ils servent aussi à **sauter une section** déjà maîtrisée
- **30 trophées**
- Bouton **« Signaler une erreur »** sous chaque correction ; la liste se retrouve dans Profil, prête à copier

### Comment le contenu est fabriqué

| Étape | Fichier |
| --- | --- |
| Programme pédagogique (titres, grammaire, objectifs) | `content/syllabus.json` |
| Rédaction des unités par Gemini | `content/generate.mjs` |
| Vérifications automatiques (une seule bonne réponse, phrases à construire possibles…) | `content/validate.mjs` |
| Majuscules des phrases à construire | `content/normalize.mjs` |
| Relecture par un « second professeur » IA | `content/review.mjs` → `content/reviews/` |
| Corrections retenues | `content/apply-fixes.mjs` |
| Unités finales chargées par l'app | `content/units/*.json` |

Pour ajouter une unité : l'écrire dans `syllabus.json`, puis lancer `GEMINI_API_KEY=… node content/generate.mjs sXuY`.

## Activer le tuteur IA (gratuit)

Deux possibilités :

- **Simple** : crée une clé sur https://aistudio.google.com (« Get API key », sans carte bancaire) et colle-la dans **Profil → Tuteur IA**. Elle reste sur ton téléphone.
- **Plus sûr, une fois l'app sur Vercel** : dans **Settings → Environment Variables**, ajoute `GEMINI_API_KEY` (ta clé) et `APP_PASSCODE` (un code de ton choix), puis redéploie. Recopie le code dans **Profil → Tuteur IA**. La clé reste sur le serveur (`api/tutor.js`).

Le modèle par défaut est `gemini-flash-lite-latest` (réponse en 3 secondes environ). Si Google ferme un modèle ou s'il est surchargé, l'app essaie automatiquement `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite` puis `gemini-flash-latest`. Tu peux imposer un autre modèle dans Profil, ou avec `GEMINI_MODEL` sur Vercel. Sur l'offre gratuite, Google peut utiliser les échanges : n'écris rien de confidentiel.

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
| `src/data/accents.ts` | Les 6 accents, phrases et paires minimales |
| `src/lib/ai.ts`, `src/lib/tutor.ts` | Le tuteur IA (Gemini gratuit) et ses consignes |
| `src/lib/listen.ts`, `src/lib/score.ts` | Le micro et la note de prononciation |
| `api/tutor.js` | Fonction serveur Vercel qui garde la clé secrète |
| `src/screens/` | Les écrans : accueil, carte, leçon, victoire, profil |
| `src/components/Zazou.tsx` | La mascotte, en SVG animé |
| `supabase/migrations/` | Tables et règles de sécurité de la base |

## Prochaines phases

- ~~Phase 2 — Voix~~ : faite
- ~~Phase 3 — Premium~~ : faite
- ~~Phase 4 — Contenu~~ : faite
