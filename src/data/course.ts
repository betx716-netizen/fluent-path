// Programme ZAZOU « Anglais général » (fr → en), version 1.0 du 30/10/2026.
// Les exercices de chaque leçon suivent toujours le même schéma (voir buildLessonExercises) :
// 5 découvertes, 3 « que veut dire… », 2 phrases à remettre en ordre après écoute,
// 4 phrases à dire, 1 phrase à traduire à l'oral.

export const COURSE_SETTINGS = {
  lessonMinutes: "5-7",
  dailyGoalMinutes: [5, 10, 15, 20] as const,
  hearts: 5,
  freeAiMinutesPerDay: 2,
  scoreColors: { perfect: 85, almost: 60 }
};

export interface Word { en: string; fr: string; say: string }
export interface Phrase { en: string; fr: string }
export interface RoleplayDef {
  title: string;
  zazou_role: string;
  user_goal: string;
  opening: string;
  targets: string[];
  max_turns: number;
  free_minutes: number;
  system_prompt: string;
}
export interface CourseLesson {
  id: string;
  title: string;
  goal: string;
  xp: number;
  type: "standard" | "conversation";
  words: Word[];
  phrases: Phrase[];
  roleplay?: RoleplayDef;
  // Leçons de grammaire : règles affichées avant les exercices et phrases à compléter.
  rules?: string[];
  drills?: { sentence: string; options: string[]; answer: string; explain: string }[];
}
export interface CourseUnit {
  id: string;
  number: number;
  title: string;
  title_en: string;
  goal: string;
  grammar: string;
  lessons: CourseLesson[];
}
export interface PlanUnit { id: string; number: number; title: string; situations: string; grammar: string; status: "ready" | "planned" }
export interface PlanChapter { id: string; number: number; title: string; level: string; units: PlanUnit[] }

const w = (en: string, fr: string, say: string): Word => ({ en, fr, say });
const p = (en: string, fr: string): Phrase => ({ en, fr });
const rp = (title: string, zazou_role: string, user_goal: string, opening: string, targets: string[], unit: string, level = "A1"): RoleplayDef => ({
  title,
  zazou_role,
  user_goal,
  opening,
  targets,
  max_turns: 8,
  free_minutes: 2,
  system_prompt: `Tu es Zazou, le tuteur d'anglais de l'application ZAZOU. Joue le rôle suivant : ${zazou_role}. Scène : ${title}. L'élève est un francophone de niveau ${level} ; son objectif : ${user_goal}. Parle UNIQUEMENT en anglais très simple (phrases de 4 à 10 mots, vocabulaire de l'unité « ${unit} »). Pose une seule question à la fois. Si l'élève fait une erreur, reformule correctement sa phrase dans ta réponse sans le gronder. Si l'élève écrit en français ou dit qu'il ne comprend pas, donne une courte aide en français entre crochets puis reviens à l'anglais. Essaie de lui faire utiliser : ${targets.join(", ")}. Termine après 6 à 8 échanges par une phrase d'au revoir.`
});

export const PLAN: PlanChapter[] = [
  { id: "c1", number: 1, title: "Les bases", level: "A1.1", units: [
    { id: "c1-u1", number: 1, title: "Bonjour !", situations: "Saluer, se présenter, dire d'où on vient", grammar: "to be, I / you / he / she", status: "ready" },
    { id: "c1-u2", number: 2, title: "Les chiffres", situations: "Nombres, âge, téléphone, prix en FCFA", grammar: "how much / how old", status: "ready" },
    { id: "c1-u3", number: 3, title: "Ma famille", situations: "Présenter sa famille et ses amis", grammar: "my / your, have got, pluriel", status: "ready" },
    { id: "c1-u4", number: 4, title: "Au maquis", situations: "Commander à manger et à boire, payer", grammar: "I'd like, can I have…?", status: "ready" },
    { id: "c1-u5", number: 5, title: "En ville", situations: "Prendre un taxi, demander son chemin", grammar: "there is / are, impératif", status: "ready" }
  ] },
  { id: "c2", number: 2, title: "La vie de tous les jours", level: "A1.2", units: [
    { id: "c2-u1", number: 6, title: "Ma journée", situations: "Routine, dire l'heure", grammar: "présent simple", status: "planned" },
    { id: "c2-u2", number: 7, title: "Au marché", situations: "Acheter, couleurs, tailles, négocier un peu", grammar: "this / that, too + adjectif", status: "planned" },
    { id: "c2-u3", number: 8, title: "La maison", situations: "Pièces, objets, chercher un logement", grammar: "prépositions de lieu", status: "planned" },
    { id: "c2-u4", number: 9, title: "Météo et habits", situations: "Saisons, temps qu'il fait, s'habiller", grammar: "présent continu", status: "planned" },
    { id: "c2-u5", number: 10, title: "Santé", situations: "Pharmacie, docteur, dire où on a mal", grammar: "have + symptôme, should", status: "planned" }
  ] },
  { id: "c3", number: 3, title: "Communiquer", level: "A2.1", units: [
    { id: "c3-u1", number: 11, title: "Au téléphone", situations: "Appels, WhatsApp, laisser un message", grammar: "can / could", status: "planned" },
    { id: "c3-u2", number: 12, title: "Le week-end dernier", situations: "Raconter ce qu'on a fait", grammar: "prétérit", status: "ready" },
    { id: "c3-u3", number: 13, title: "Loisirs", situations: "Foot, musique, sorties, goûts", grammar: "like + -ing, fréquence", status: "planned" },
    { id: "c3-u4", number: 14, title: "En voyage", situations: "Aéroport, hôtel, réservation", grammar: "going to", status: "planned" },
    { id: "c3-u5", number: 15, title: "Invitations", situations: "Inviter, accepter, refuser poliment", grammar: "will, let's", status: "planned" }
  ] },
  { id: "c4", number: 4, title: "Le monde du travail", level: "A2.2", units: [
    { id: "c4-u1", number: 16, title: "Mon métier", situations: "Présenter son poste et son entreprise", grammar: "présent simple vs continu", status: "planned" },
    { id: "c4-u2", number: 17, title: "Emails et messages", situations: "Écrire et lire des messages pro", grammar: "formules de politesse", status: "planned" },
    { id: "c4-u3", number: 18, title: "En réunion", situations: "Donner une info, demander de répéter", grammar: "questions indirectes", status: "planned" },
    { id: "c4-u4", number: 19, title: "Le client", situations: "Accueillir, renseigner, servir un client", grammar: "would you like, could you", status: "planned" },
    { id: "c4-u5", number: 20, title: "L'entretien d'embauche", situations: "Parler de son parcours et de ses qualités", grammar: "present perfect", status: "planned" }
  ] },
  { id: "c5", number: 5, title: "Commerce et métiers", level: "B1.1", units: [
    { id: "c5-u1", number: 21, title: "Acheter et vendre", situations: "Devis, prix, négociation", grammar: "comparatifs, superlatifs", status: "planned" },
    { id: "c5-u2", number: 22, title: "Au port", situations: "Conteneurs, documents, délais, douane", grammar: "passif simple", status: "planned" },
    { id: "c5-u3", number: 23, title: "Argent et mobile money", situations: "Banque, transferts, paiements", grammar: "conditionnel type 1", status: "planned" },
    { id: "c5-u4", number: 24, title: "Numérique", situations: "Applis, réseaux sociaux, vendre en ligne", grammar: "must, have to", status: "planned" },
    { id: "c5-u5", number: 25, title: "Un problème à régler", situations: "Réclamation, excuses, solution", grammar: "past continuous", status: "planned" }
  ] },
  { id: "c6", number: 6, title: "S'exprimer avec aisance", level: "B1.2", units: [
    { id: "c6-u1", number: 26, title: "Mon avis", situations: "Donner et défendre son opinion", grammar: "I think, connecteurs", status: "planned" },
    { id: "c6-u2", number: 27, title: "Raconter une histoire", situations: "Narration, souvenirs", grammar: "used to", status: "planned" },
    { id: "c6-u3", number: 28, title: "L'actualité", situations: "Comprendre et résumer une info", grammar: "discours rapporté", status: "planned" },
    { id: "c6-u4", number: 29, title: "Conseiller", situations: "Comparer, recommander, convaincre", grammar: "conditionnel type 2", status: "planned" },
    { id: "c6-u5", number: 30, title: "Ma présentation", situations: "Présenter un projet à l'oral (test final B1)", grammar: "révision générale", status: "planned" }
  ] }
];

export const CHAPTER1: CourseUnit[] = [
  {
    id: "c1-u1", number: 1, title: "Bonjour !", title_en: "Hello!", goal: "Saluer, se présenter et dire d'où on vient.", grammar: "to be : I am / you are / he is / she is",
    lessons: [
      { id: "c1-u1-l1", title: "Saluer", goal: "Dire bonjour et au revoir selon le moment de la journée.", xp: 10, type: "standard",
        words: [w("hello", "salut", "hè-LO"), w("good morning", "bonjour (le matin)", "goud MOR-ning"), w("good evening", "bonsoir", "goud ÏV-ning"), w("goodbye", "au revoir", "goud-BAÏ"), w("see you", "à plus tard", "SI-you")],
        phrases: [p("Hello! How are you?", "Salut ! Comment ça va ?"), p("I'm fine, thank you.", "Je vais bien, merci."), p("Good morning, sir.", "Bonjour, monsieur."), p("See you tomorrow!", "À demain !")] },
      { id: "c1-u1-l2", title: "Se présenter", goal: "Dire son nom et demander celui de l'autre.", xp: 10, type: "standard",
        words: [w("name", "nom", "NÉÏM"), w("my", "mon / ma", "MAÏ"), w("your", "ton / ta / votre", "YOR"), w("nice to meet you", "enchanté(e)", "NAÏS tou MÏT you"), w("I am", "je suis", "AÏ èm")],
        phrases: [p("My name is Awa.", "Je m'appelle Awa."), p("What's your name?", "Comment tu t'appelles ?"), p("I'm Kofi.", "Je suis Kofi."), p("Nice to meet you!", "Enchanté !")] },
      { id: "c1-u1-l3", title: "D'où viens-tu ?", goal: "Dire son pays et sa ville.", xp: 10, type: "standard",
        words: [w("from", "de (origine)", "FROM"), w("country", "pays", "KAN-tri"), w("city", "ville", "SI-ti"), w("Ivory Coast", "Côte d'Ivoire", "AÏ-vo-ri KOST"), w("live", "habiter", "LIV")],
        phrases: [p("Where are you from?", "D'où viens-tu ?"), p("I'm from Ivory Coast.", "Je viens de Côte d'Ivoire."), p("I live in Abidjan.", "J'habite à Abidjan."), p("She is from Ghana.", "Elle vient du Ghana.")] },
      { id: "c1-u1-l4", title: "Il, elle, nous", goal: "Présenter quelqu'un d'autre avec he / she / we.", xp: 10, type: "standard",
        words: [w("he", "il", "HI"), w("she", "elle", "CHI"), w("we", "nous", "OUI"), w("they", "ils / elles", "ZÉÏ"), w("friend", "ami(e)", "FRÈND")],
        phrases: [p("This is my friend Moussa.", "Voici mon ami Moussa."), p("He is a student.", "Il est étudiant."), p("She is a teacher.", "Elle est professeure."), p("We are happy.", "Nous sommes contents.")] },
      { id: "c1-u1-l5", title: "Conversation : premier contact", goal: "Tenir une première conversation complète avec Zazou.", xp: 20, type: "conversation",
        words: [w("welcome", "bienvenue", "OUÈL-keum"), w("please", "s'il te plaît", "PLÏZ"), w("thank you", "merci", "THÈNK you"), w("sorry", "pardon / désolé", "SO-ri"), w("excuse me", "excusez-moi", "eks-KIOUZ mi")],
        phrases: [p("Excuse me, are you Mr. Mensah?", "Excusez-moi, êtes-vous M. Mensah ?"), p("Welcome to Abidjan!", "Bienvenue à Abidjan !"), p("Sorry, can you repeat?", "Pardon, vous pouvez répéter ?"), p("Thank you very much.", "Merci beaucoup.")],
        roleplay: rp("À l'aéroport Félix Houphouët-Boigny", "Mr. Mensah, un visiteur ghanéen qui arrive à Abidjan", "Accueillir le visiteur, te présenter et lui demander d'où il vient", "Hello! Excuse me, are you from the welcome team?", ["Hello! / Good morning", "My name is…", "Where are you from?", "Welcome to Abidjan!", "Nice to meet you"], "Bonjour !") }
    ]
  },
  {
    id: "c1-u2", number: 2, title: "Les chiffres", title_en: "Numbers", goal: "Compter, donner son âge, son numéro et un prix.", grammar: "How much…? / How old…?",
    lessons: [
      { id: "c1-u2-l1", title: "De 1 à 10", goal: "Compter de 1 à 10.", xp: 10, type: "standard",
        words: [w("one", "un", "OUANE"), w("two", "deux", "TOU"), w("three", "trois", "THRÏ"), w("five", "cinq", "FAÏV"), w("ten", "dix", "TÈN")],
        phrases: [p("I have two brothers.", "J'ai deux frères."), p("Three coffees, please.", "Trois cafés, s'il vous plaît."), p("Room number five.", "Chambre numéro cinq."), p("Count to ten.", "Compte jusqu'à dix.")] },
      { id: "c1-u2-l2", title: "Mon âge", goal: "Demander et dire son âge.", xp: 10, type: "standard",
        words: [w("twenty", "vingt", "TOUÈN-ti"), w("thirty", "trente", "THEUR-ti"), w("old", "vieux / âgé", "OLD"), w("year", "année / an", "YIR"), w("age", "âge", "ÉÏDJ")],
        phrases: [p("How old are you?", "Quel âge as-tu ?"), p("I'm twenty-two years old.", "J'ai vingt-deux ans."), p("My sister is thirty.", "Ma sœur a trente ans."), p("He is ten.", "Il a dix ans.")] },
      { id: "c1-u2-l3", title: "Mon numéro", goal: "Donner un numéro de téléphone chiffre par chiffre.", xp: 10, type: "standard",
        words: [w("phone number", "numéro de téléphone", "FONE NAM-beur"), w("zero", "zéro", "ZI-ro"), w("double", "deux fois le même chiffre", "DA-beul"), w("call", "appeler", "KOL"), w("message", "message", "MÈ-sidj")],
        phrases: [p("What's your phone number?", "Quel est ton numéro ?"), p("It's zero seven, double five…", "C'est zéro sept, cinq cinq…"), p("Call me tomorrow.", "Appelle-moi demain."), p("Send me a message.", "Envoie-moi un message.")] },
      { id: "c1-u2-l4", title: "Les prix", goal: "Demander et comprendre un prix en francs CFA.", xp: 10, type: "standard",
        words: [w("hundred", "cent", "HAN-dred"), w("thousand", "mille", "THAOU-zeund"), w("price", "prix", "PRAÏS"), w("cheap", "pas cher", "TCHÏP"), w("expensive", "cher", "eks-PÈN-siv")],
        phrases: [p("How much is it?", "C'est combien ?"), p("It's two thousand francs.", "C'est deux mille francs."), p("That's too expensive!", "C'est trop cher !"), p("Is it cheap?", "C'est pas cher ?")] },
      { id: "c1-u2-l5", title: "Conversation : au kiosque", goal: "Acheter du crédit téléphonique et payer.", xp: 20, type: "conversation",
        words: [w("credit", "crédit (téléphone)", "KRÈ-dit"), w("change", "monnaie (rendue)", "TCHÉÏNDJ"), w("pay", "payer", "PÉÏ"), w("total", "total", "TO-teul"), w("here you are", "tenez / voilà", "HIR you AR")],
        phrases: [p("I'd like two thousand francs of credit.", "Je voudrais deux mille francs de crédit."), p("Here you are.", "Tenez."), p("Do you have change?", "Vous avez la monnaie ?"), p("Can I pay with Wave?", "Je peux payer avec Wave ?")],
        roleplay: rp("Au kiosque de transfert", "Fatou, la vendeuse du kiosque", "Acheter du crédit, comprendre le prix et donner ton numéro", "Good afternoon! What can I do for you?", ["How much is it?", "I'd like…", "My number is…", "Here you are", "Thank you"], "Les chiffres") }
    ]
  },
  {
    id: "c1-u3", number: 3, title: "Ma famille", title_en: "My family", goal: "Présenter sa famille et ses amis.", grammar: "my / your / his / her, have got, pluriel en -s",
    lessons: [
      { id: "c1-u3-l1", title: "Les parents", goal: "Nommer les membres proches de la famille.", xp: 10, type: "standard",
        words: [w("mother", "mère", "MA-zeur"), w("father", "père", "FA-zeur"), w("parents", "parents", "PÈ-rènts"), w("brother", "frère", "BRA-zeur"), w("sister", "sœur", "SIS-teur")],
        phrases: [p("This is my mother.", "Voici ma mère."), p("My father is a driver.", "Mon père est chauffeur."), p("I have one brother.", "J'ai un frère."), p("My sister lives in Bouaké.", "Ma sœur habite à Bouaké.")] },
      { id: "c1-u3-l2", title: "La grande famille", goal: "Parler des cousins, oncles et grands-parents.", xp: 10, type: "standard",
        words: [w("cousin", "cousin(e)", "KA-zeun"), w("uncle", "oncle", "ANG-keul"), w("aunt", "tante", "ANT"), w("grandmother", "grand-mère", "GRAND-ma-zeur"), w("children", "enfants", "TCHIL-dreun")],
        phrases: [p("David is my cousin.", "David est mon cousin."), p("My uncle has three children.", "Mon oncle a trois enfants."), p("I love my grandmother.", "J'adore ma grand-mère."), p("We are a big family.", "Nous sommes une grande famille.")] },
      { id: "c1-u3-l3", title: "Son, sa, leur", goal: "Utiliser his / her / their.", xp: 10, type: "standard",
        words: [w("his", "son / sa (à lui)", "HIZ"), w("her", "son / sa (à elle)", "HEUR"), w("their", "leur", "ZÈR"), w("husband", "mari", "HAZ-beund"), w("wife", "épouse", "OUAÏF")],
        phrases: [p("Her husband is a doctor.", "Son mari est médecin."), p("His wife is from Senegal.", "Sa femme vient du Sénégal."), p("Their house is big.", "Leur maison est grande."), p("What's her name?", "Comment elle s'appelle ?")] },
      { id: "c1-u3-l4", title: "Décrire quelqu'un", goal: "Dire comment est une personne.", xp: 10, type: "standard",
        words: [w("tall", "grand", "TOL"), w("short", "petit", "CHORT"), w("kind", "gentil", "KAÏND"), w("funny", "drôle", "FA-ni"), w("young", "jeune", "YANG")],
        phrases: [p("My brother is tall and funny.", "Mon frère est grand et drôle."), p("She is very kind.", "Elle est très gentille."), p("My cousins are young.", "Mes cousins sont jeunes."), p("He has got a beard.", "Il a une barbe.")] },
      { id: "c1-u3-l5", title: "Conversation : photo de famille", goal: "Présenter une photo de famille à un ami.", xp: 20, type: "conversation",
        words: [w("photo", "photo", "FO-to"), w("next to", "à côté de", "NÈKST tou"), w("who", "qui", "HOU"), w("older", "plus âgé", "OL-deur"), w("married", "marié(e)", "MÈ-rid")],
        phrases: [p("Who is this?", "C'est qui ?"), p("This is my older sister.", "C'est ma grande sœur."), p("She is married.", "Elle est mariée."), p("He is next to my father.", "Il est à côté de mon père.")],
        roleplay: rp("Photos de famille", "Emma, une amie anglaise curieuse", "Présenter ta famille à partir d'une photo", "Wow, nice photo! Who are all these people?", ["This is my…", "He / She is…", "I have got…", "Who is…?", "next to"], "Ma famille") }
    ]
  },
  {
    id: "c1-u4", number: 4, title: "Au maquis", title_en: "At the restaurant", goal: "Commander à manger et à boire, puis payer.", grammar: "I'd like… / Can I have…? / some, a, an",
    lessons: [
      { id: "c1-u4-l1", title: "À boire", goal: "Commander une boisson.", xp: 10, type: "standard",
        words: [w("water", "eau", "OUO-teur"), w("juice", "jus", "DJOUS"), w("coffee", "café", "KO-fi"), w("cold", "froid", "KOLD"), w("bottle", "bouteille", "BO-teul")],
        phrases: [p("I'd like a cold water, please.", "Je voudrais une eau fraîche, s'il vous plaît."), p("A bottle of juice.", "Une bouteille de jus."), p("Can I have a coffee?", "Je peux avoir un café ?"), p("Without sugar, please.", "Sans sucre, s'il vous plaît.")] },
      { id: "c1-u4-l2", title: "À manger", goal: "Nommer des plats et dire ce qu'on veut.", xp: 10, type: "standard",
        words: [w("chicken", "poulet", "TCHI-kine"), w("fish", "poisson", "FICH"), w("rice", "riz", "RAÏS"), w("plantain", "banane plantain", "PLÈN-tine"), w("spicy", "pimenté", "SPAÏ-si")],
        phrases: [p("I'd like grilled fish with attiéké.", "Je voudrais du poisson braisé avec de l'attiéké."), p("Is it spicy?", "C'est pimenté ?"), p("Chicken and rice, please.", "Poulet et riz, s'il vous plaît."), p("Not too spicy!", "Pas trop pimenté !")] },
      { id: "c1-u4-l3", title: "Le serveur", goal: "Comprendre les questions du serveur.", xp: 10, type: "standard",
        words: [w("menu", "carte / menu", "MÈ-niou"), w("table", "table", "TÉÏ-beul"), w("ready", "prêt", "RÈ-di"), w("order", "commander / commande", "OR-deur"), w("anything else", "autre chose", "È-ni-thing ÈLS")],
        phrases: [p("Are you ready to order?", "Vous êtes prêts à commander ?"), p("Anything else?", "Autre chose ?"), p("Can I see the menu?", "Je peux voir la carte ?"), p("A table for two, please.", "Une table pour deux, s'il vous plaît.")] },
      { id: "c1-u4-l4", title: "Payer", goal: "Demander l'addition et payer.", xp: 10, type: "standard",
        words: [w("bill", "addition", "BIL"), w("cash", "espèces", "KÈCH"), w("tip", "pourboire", "TIP"), w("delicious", "délicieux", "di-LI-cheus"), w("together", "ensemble", "tou-GUÈ-zeur")],
        phrases: [p("Can I have the bill, please?", "L'addition, s'il vous plaît."), p("Can I pay in cash?", "Je peux payer en espèces ?"), p("It was delicious!", "C'était délicieux !"), p("Keep the change.", "Gardez la monnaie.")] },
      { id: "c1-u4-l5", title: "Conversation : au maquis", goal: "Commander un repas complet du début à la fin.", xp: 20, type: "conversation",
        words: [w("starter", "entrée", "STAR-teur"), w("main course", "plat principal", "MÉÏN KORS"), w("dessert", "dessert", "di-ZEURT"), w("hungry", "avoir faim", "HANG-gri"), w("thirsty", "avoir soif", "THEURS-ti")],
        phrases: [p("I'm very hungry!", "J'ai très faim !"), p("What do you recommend?", "Qu'est-ce que vous conseillez ?"), p("For dessert, a fruit salad.", "En dessert, une salade de fruits."), p("Two cold drinks, please.", "Deux boissons fraîches, s'il vous plaît.")],
        roleplay: rp("Au maquis de Yopougon", "Koffi, le serveur du maquis", "Commander une boisson et un plat, demander si c'est pimenté, puis payer", "Good evening! Welcome. Are you ready to order?", ["I'd like…", "Can I have…?", "Is it spicy?", "The bill, please", "It was delicious"], "Au maquis") }
    ]
  },
  {
    id: "c1-u5", number: 5, title: "En ville", title_en: "In town", goal: "Prendre un taxi et demander son chemin.", grammar: "there is / there are, impératif (turn, go, stop)",
    lessons: [
      { id: "c1-u5-l1", title: "Les lieux", goal: "Nommer les lieux de la ville.", xp: 10, type: "standard",
        words: [w("bank", "banque", "BÈNK"), w("market", "marché", "MAR-kit"), w("pharmacy", "pharmacie", "FAR-ma-si"), w("bus station", "gare routière", "BAS STÉÏ-cheun"), w("hospital", "hôpital", "HOS-pi-teul")],
        phrases: [p("There is a bank near here.", "Il y a une banque près d'ici."), p("Is there a pharmacy?", "Il y a une pharmacie ?"), p("The market is big.", "Le marché est grand."), p("There are two hospitals.", "Il y a deux hôpitaux.")] },
      { id: "c1-u5-l2", title: "Demander son chemin", goal: "Demander où se trouve un lieu.", xp: 10, type: "standard",
        words: [w("where", "où", "OUÈR"), w("near", "près", "NIR"), w("far", "loin", "FAR"), w("street", "rue", "STRÏT"), w("here", "ici", "HIR")],
        phrases: [p("Excuse me, where is the bank?", "Excusez-moi, où est la banque ?"), p("Is it far?", "C'est loin ?"), p("It's near the market.", "C'est près du marché."), p("It's on this street.", "C'est dans cette rue.")] },
      { id: "c1-u5-l3", title: "Les directions", goal: "Comprendre et donner des directions.", xp: 10, type: "standard",
        words: [w("left", "gauche", "LÈFT"), w("right", "droite", "RAÏT"), w("straight on", "tout droit", "STRÉÏT ON"), w("turn", "tourner", "TEURN"), w("corner", "coin / angle", "KOR-neur")],
        phrases: [p("Go straight on.", "Allez tout droit."), p("Turn left at the corner.", "Tournez à gauche au coin."), p("It's on your right.", "C'est sur votre droite."), p("Cross the road.", "Traversez la route.")] },
      { id: "c1-u5-l4", title: "En taxi", goal: "Dire où on va et négocier le prix.", xp: 10, type: "standard",
        words: [w("taxi", "taxi", "TAK-si"), w("stop", "arrêter / arrêt", "STOP"), w("how long", "combien de temps", "HAOU LONG"), w("traffic", "embouteillages", "TRÈ-fik"), w("airport", "aéroport", "ÈR-port")],
        phrases: [p("To the airport, please.", "À l'aéroport, s'il vous plaît."), p("How much to Plateau?", "C'est combien pour le Plateau ?"), p("Stop here, please.", "Arrêtez-vous ici, s'il vous plaît."), p("There is a lot of traffic.", "Il y a beaucoup d'embouteillages.")] },
      { id: "c1-u5-l5", title: "Conversation : perdu en ville", goal: "Aider un touriste perdu à trouver son chemin.", xp: 20, type: "conversation",
        words: [w("lost", "perdu", "LOST"), w("map", "carte / plan", "MÈP"), w("walk", "marcher / à pied", "OUOK"), w("minutes", "minutes", "MI-nits"), w("follow me", "suivez-moi", "FO-lo mi")],
        phrases: [p("I'm lost. Can you help me?", "Je suis perdu. Vous pouvez m'aider ?"), p("It's a five-minute walk.", "C'est à cinq minutes à pied."), p("Take a taxi, it's far.", "Prenez un taxi, c'est loin."), p("Follow me!", "Suivez-moi !")],
        roleplay: rp("Un touriste perdu au Plateau", "Sarah, une touriste américaine perdue", "Lui expliquer comment aller à la pharmacie, puis l'aider à prendre un taxi", "Excuse me! I'm lost. Is there a pharmacy near here?", ["Go straight on", "Turn left / right", "It's near…", "It's a … minute walk", "How much to…?"], "En ville") }
    ]
  }
];

// Chapitre 3, unité 12 : le prétérit (raconter ce qu'on a fait).
const d = (sentence: string, options: string[], answer: string, explain: string) => ({ sentence, options, answer, explain });

export const PRETERIT: CourseUnit = {
  id: "c3-u2", number: 12, title: "Le week-end dernier", title_en: "Last weekend", goal: "Raconter ce qu'on a fait : hier, le week-end dernier, il y a deux jours.", grammar: "prétérit : -ed, verbes irréguliers, was / were, did / didn't",
  lessons: [
    { id: "c3-u2-l1", title: "Hier, j'ai travaillé", goal: "Former le prétérit des verbes réguliers avec -ed.", xp: 10, type: "standard",
      rules: [
        "Le prétérit raconte une action finie dans le passé : yesterday, last week, in 2020. Il traduit le passé composé (j'ai travaillé) et souvent l'imparfait (je travaillais).",
        "Verbes réguliers : on ajoute -ed. work → worked, watch → watched. La forme est la même pour I, you, he, she, we, they.",
        "Prononciation de -ed : « t » après p, k, ch, sh (worked ≈ « weurkt ») ; « d » après une voyelle ou un son doux (called ≈ « kold ») ; « id » seulement après t ou d (visited ≈ « vi-zi-tid »)."
      ],
      words: [w("yesterday", "hier", "YÈS-teur-déï"), w("worked", "a travaillé", "WEURKT"), w("watched", "a regardé", "WOTCHT"), w("visited", "a rendu visite", "VI-zi-tid"), w("called", "a appelé", "KOLD")],
      phrases: [p("I worked all day yesterday.", "J'ai travaillé toute la journée hier."), p("We watched the match on TV.", "Nous avons regardé le match à la télé."), p("She visited her mother in Bouaké.", "Elle a rendu visite à sa mère à Bouaké."), p("He called me last night.", "Il m'a appelé hier soir.")],
      drills: [
        d("Yesterday I ___ at the market.", ["work", "worked", "working"], "worked", "Action finie (yesterday) : verbe + -ed."),
        d("Last night we ___ a film.", ["watched", "watch", "watches"], "watched", "last night = passé : watch → watched."),
        d("She ___ her friend on Sunday.", ["call", "calls", "called"], "called", "Même forme avec she : called, sans -s.")
      ] },
    { id: "c3-u2-l2", title: "Je suis allé…", goal: "Utiliser les verbes irréguliers les plus courants.", xp: 10, type: "standard",
      rules: [
        "Les verbes les plus utilisés sont irréguliers : leur prétérit s'apprend par cœur.",
        "go → went, eat → ate, see → saw, buy → bought, have → had, make → made, get → got, come → came.",
        "Comme pour -ed, une seule forme pour toutes les personnes : I went, she went, they went."
      ],
      words: [w("went", "est allé / suis allé", "OUÈNT"), w("ate", "a mangé", "ÉÏT"), w("saw", "a vu", "SO"), w("bought", "a acheté", "BOT"), w("had", "a eu / avait", "HÈD")],
      phrases: [p("I went to the beach on Saturday.", "Je suis allé à la plage samedi."), p("We ate attiéké and fish.", "Nous avons mangé de l'attiéké et du poisson."), p("I saw my cousin at the market.", "J'ai vu mon cousin au marché."), p("She bought a new dress.", "Elle a acheté une nouvelle robe.")],
      drills: [
        d("On Sunday, we ___ to church.", ["go", "goed", "went"], "went", "go est irrégulier : go → went (jamais « goed »)."),
        d("I ___ rice for lunch.", ["ate", "eated", "eat"], "ate", "eat → ate."),
        d("He ___ a phone at the market.", ["buyed", "bought", "buy"], "bought", "buy → bought, prononcé « bot ».")
      ] },
    { id: "c3-u2-l3", title: "C'était bien !", goal: "Dire comment c'était et où on était avec was / were.", xp: 10, type: "standard",
      rules: [
        "Le verbe to be au prétérit : I / he / she / it was ; you / we / they were.",
        "ago se place après la durée : two days ago = il y a deux jours.",
        "Être né se dit avec be : I was born in Daloa (jamais « I born »)."
      ],
      words: [w("was", "était / étais", "OUOZ"), w("were", "étaient / étions", "OUEUR"), w("last week", "la semaine dernière", "LAST OUÏK"), w("ago", "il y a (durée)", "eu-GO"), w("born", "né(e)", "BORN")],
      phrases: [p("The party was great!", "La fête était super !"), p("We were tired after the trip.", "Nous étions fatigués après le voyage."), p("I was born in Daloa.", "Je suis né à Daloa."), p("I was in Accra two weeks ago.", "J'étais à Accra il y a deux semaines.")],
      drills: [
        d("The weather ___ hot yesterday.", ["were", "was", "is"], "was", "the weather = it → was."),
        d("My friends ___ at the maquis.", ["were", "was", "are"], "were", "my friends = they → were."),
        d("I came to Abidjan three years ___.", ["last", "before", "ago"], "ago", "Durée + ago = il y a trois ans.")
      ] },
    { id: "c3-u2-l4", title: "Did you…? I didn't…", goal: "Poser une question et dire non au prétérit avec did.", xp: 10, type: "standard",
      rules: [
        "Question : Did + sujet + verbe de base. Did you go? (jamais « Did you went? »).",
        "Négation : didn't + verbe de base. I didn't eat (jamais « I didn't ate »). did porte déjà le passé.",
        "Réponses courtes : Yes, I did. / No, I didn't. Avec un mot interrogatif : What did you do? Where did you go?"
      ],
      words: [w("did", "auxiliaire du passé (questions)", "DID"), w("didn't", "ne … pas (passé)", "DI-deunt"), w("what did", "qu'est-ce que … (passé)", "OUOT did"), w("where did", "où … (passé)", "OUÈR did"), w("when did", "quand … (passé)", "OUÈN did")],
      phrases: [p("Did you go out last night?", "Tu es sorti hier soir ?"), p("No, I didn't.", "Non."), p("What did you do on Sunday?", "Qu'as-tu fait dimanche ?"), p("I didn't see the message.", "Je n'ai pas vu le message.")],
      drills: [
        d("___ you watch the match?", ["Do", "Did", "Were"], "Did", "Question au passé : Did + sujet + verbe."),
        d("I didn't ___ to work yesterday.", ["went", "goes", "go"], "go", "Après didn't, verbe de base : didn't go."),
        d("What did she ___ at the market?", ["buy", "bought", "buys"], "buy", "Après did, verbe de base : did she buy.")
      ] },
    { id: "c3-u2-l5", title: "Conversation : lundi au bureau", goal: "Raconter ton week-end à une collègue et lui poser la question.", xp: 20, type: "conversation",
      words: [w("weekend", "week-end", "OUÏK-ènd"), w("great", "super", "GRÉÏT"), w("fun", "amusant", "FAN"), w("boring", "ennuyeux", "BO-ring"), w("tired", "fatigué", "TAÏ-eurd")],
      phrases: [p("How was your weekend?", "C'était comment, ton week-end ?"), p("It was great, thanks!", "C'était super, merci !"), p("I went to a wedding in Grand-Bassam.", "Je suis allé à un mariage à Grand-Bassam."), p("What did you do?", "Et toi, qu'est-ce que tu as fait ?")],
      roleplay: rp("Lundi matin au bureau", "Mrs. Johnson, une collègue américaine curieuse", "Raconter ton week-end (où tu es allé, ce que tu as fait, si c'était bien) puis lui poser la question", "Good morning! How was your weekend?", ["It was…", "I went to…", "I ate / I saw / I bought…", "I didn't…", "What did you do?"], "Le week-end dernier", "A2") }
  ]
};

// Unités du programme déjà rédigées.
export const READY_UNITS: CourseUnit[] = [...CHAPTER1, PRETERIT];
