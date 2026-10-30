// Espace « Grammaire », à part du parcours : prétérit, verbes, adjectifs
// qualificatifs et connecteurs logiques. On révise les cartes une par une ;
// toutes les 10 cartes, un mini-exercice vérifie le sens et la prononciation.

export interface GrammarItem {
  en: string;
  fr: string;
  say: string;
  // Phrase d'exemple : elle contient `en` tel quel (sert aussi de phrase à trous).
  ex: string;
  exFr: string;
  // Mauvaises réponses typiques pour la phrase à trous (sinon : autres cartes).
  wrong?: string[];
  note?: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  color: "indigo" | "blue" | "mint" | "sun";
  intro: string;
  rules: string[];
  items: GrammarItem[];
}

export const CARDS_PER_QUIZ = 10;

const g = (en: string, fr: string, say: string, ex: string, exFr: string, wrong?: string[], note?: string): GrammarItem => ({ en, fr, say, ex, exFr, wrong, note });

export const TOPICS: GrammarTopic[] = [
  {
    id: "preterit",
    title: "Le prétérit",
    color: "indigo",
    intro: "Raconter ce qu'on a fait : hier, la semaine dernière, il y a deux jours.",
    rules: [
      "Le prétérit raconte une action finie dans le passé (yesterday, last week, in 2020). Il traduit le passé composé (j'ai travaillé) et souvent l'imparfait.",
      "Verbes réguliers : on ajoute -ed (work → worked). Même forme pour toutes les personnes : I worked, she worked.",
      "-ed se prononce « t » après p, k, ch, sh (worked « weurkt »), « d » après un son doux (called « kold »), « id » seulement après t ou d (visited « vi-zi-tid »).",
      "Les verbes courants sont irréguliers : go → went, eat → ate, see → saw, buy → bought…",
      "Question et négation : did / didn't + verbe de base. Did you go? I didn't go. (jamais « did you went »)"
    ],
    items: [
      g("worked", "a travaillé (work)", "WEURKT", "I worked all day yesterday.", "J'ai travaillé toute la journée hier.", ["work", "working"], "-ed se dit « t »."),
      g("called", "a appelé (call)", "KOLD", "He called me last night.", "Il m'a appelé hier soir.", ["call", "calls"], "-ed se dit « d »."),
      g("visited", "a rendu visite (visit)", "VI-zi-tid", "She visited her mother in Bouaké.", "Elle a rendu visite à sa mère à Bouaké.", ["visit", "visits"], "-ed se dit « id » après t."),
      g("wanted", "voulait (want)", "OUON-tid", "I wanted a cold drink.", "Je voulais une boisson fraîche.", ["want", "wants"]),
      g("finished", "a fini (finish)", "FI-nicht", "We finished the work at six.", "Nous avons fini le travail à six heures.", ["finish", "finishing"]),
      g("went", "est allé (go)", "OUÈNT", "I went to the beach on Saturday.", "Je suis allé à la plage samedi.", ["goed", "go"], "go → went : irrégulier."),
      g("ate", "a mangé (eat)", "ÉÏT", "We ate attiéké and fish.", "Nous avons mangé de l'attiéké et du poisson.", ["eated", "eat"]),
      g("saw", "a vu (see)", "SO", "I saw my cousin at the market.", "J'ai vu mon cousin au marché.", ["seed", "see"]),
      g("bought", "a acheté (buy)", "BOT", "She bought a new dress.", "Elle a acheté une nouvelle robe.", ["buyed", "buy"]),
      g("had", "a eu / avait (have)", "HÈD", "We had a great weekend.", "Nous avons passé un super week-end.", ["haved", "have"]),
      g("made", "a fait / fabriqué (make)", "MÉÏD", "My mother made foutou.", "Ma mère a fait du foutou.", ["maked", "make"]),
      g("came", "est venu (come)", "KÉÏM", "My brother came from Paris.", "Mon frère est venu de Paris.", ["comed", "come"]),
      g("took", "a pris (take)", "TOUK", "I took a taxi to the airport.", "J'ai pris un taxi pour l'aéroport.", ["taked", "take"]),
      g("said", "a dit (say)", "SÈD", "He said thank you.", "Il a dit merci.", ["sayed", "say"], "Se dit « sèd », pas « séïd »."),
      g("gave", "a donné (give)", "GÉÏV", "She gave me her number.", "Elle m'a donné son numéro.", ["gived", "give"]),
      g("got", "a reçu / obtenu (get)", "GOT", "I got your message.", "J'ai reçu ton message.", ["getted", "get"]),
      g("was", "était (I, he, she, it)", "OUOZ", "The party was great!", "La fête était super !", ["were", "is"], "I / he / she / it was."),
      g("were", "étaient (you, we, they)", "OUEUR", "We were tired after the trip.", "Nous étions fatigués après le voyage.", ["was", "are"], "you / we / they were."),
      g("Did", "auxiliaire des questions au passé", "DID", "Did you go out last night?", "Tu es sorti hier soir ?", ["Do", "Were"], "Did + verbe de base."),
      g("didn't", "ne … pas (au passé)", "DI-deunt", "I didn't see the message.", "Je n'ai pas vu le message.", ["don't", "wasn't"], "didn't + verbe de base.")
    ]
  },
  {
    id: "verbes",
    title: "Les verbes essentiels",
    color: "blue",
    intro: "Les 20 verbes qu'on utilise tous les jours, au présent.",
    rules: [
      "Au présent simple, le verbe ne change pas, sauf avec he / she / it : on ajoute -s. I work, she works.",
      "Exceptions : have → he has, go → she goes, do → he does, be → I am / you are / he is.",
      "Question : Do / Does + sujet + verbe. Do you speak English? Does she work here?",
      "Négation : don't / doesn't + verbe. I don't understand. He doesn't know."
    ],
    items: [
      g("am", "suis (be)", "ÈM", "I am a trader.", "Je suis commerçant.", ["is", "are"]),
      g("have", "avoir", "HÈV", "I have two children.", "J'ai deux enfants.", ["has", "am"]),
      g("go", "aller", "GO", "I go to work by gbaka.", "Je vais au travail en gbaka.", ["goes", "went"]),
      g("do", "faire (une action)", "DOU", "What do you do?", "Qu'est-ce que tu fais (comme métier) ?", ["does", "make"]),
      g("make", "faire / fabriquer", "MÉÏK", "We make bags.", "Nous fabriquons des sacs.", ["do", "makes"]),
      g("get", "obtenir / recevoir", "GUÈT", "I get the goods on Monday.", "Je reçois la marchandise lundi.", ["gets", "take"]),
      g("take", "prendre", "TÉÏK", "I take the bus every morning.", "Je prends le bus tous les matins.", ["takes", "make"]),
      g("come", "venir", "KAM", "Can you come tomorrow?", "Tu peux venir demain ?", ["comes", "came"]),
      g("see", "voir", "SI", "I see the problem.", "Je vois le problème.", ["sees", "look"]),
      g("know", "savoir / connaître", "NO", "I don't know.", "Je ne sais pas.", ["knows", "understand"], "Le k ne se prononce pas."),
      g("want", "vouloir", "OUONT", "I want a receipt.", "Je veux un reçu.", ["wants", "like"]),
      g("need", "avoir besoin de", "NÏD", "We need more time.", "Nous avons besoin de plus de temps.", ["needs", "want"]),
      g("like", "aimer (bien)", "LAÏK", "I like this colour.", "J'aime cette couleur.", ["likes", "want"]),
      g("works", "travaille (he / she)", "WEURKS", "She works at the port.", "Elle travaille au port.", ["work", "working"], "she → -s."),
      g("live", "habiter / vivre", "LIV", "They live in Cocody.", "Ils habitent à Cocody.", ["lives", "stay"]),
      g("buy", "acheter", "BAÏ", "I buy fish at the market.", "J'achète du poisson au marché.", ["buys", "sell"]),
      g("sell", "vendre", "SÈL", "We sell phones.", "Nous vendons des téléphones.", ["sells", "buy"]),
      g("pay", "payer", "PÉÏ", "Can I pay with Wave?", "Je peux payer avec Wave ?", ["pays", "buy"]),
      g("speak", "parler (une langue)", "SPÏK", "Do you speak French?", "Tu parles français ?", ["speaks", "say"]),
      g("understand", "comprendre", "an-deur-STÈND", "I don't understand.", "Je ne comprends pas.", ["understands", "know"])
    ]
  },
  {
    id: "adjectifs",
    title: "Les adjectifs qualificatifs",
    color: "mint",
    intro: "Décrire une personne, un produit, une ville.",
    rules: [
      "L'adjectif se place AVANT le nom : a big market (un grand marché).",
      "Il ne prend jamais de -s : big markets, new phones.",
      "very = très, too = trop : very cheap, too expensive.",
      "Comparer : adjectif court + -er + than (cheaper than) ; adjectif long : more + adjectif + than (more expensive than)."
    ],
    items: [
      g("big", "grand / gros", "BIG", "Adjamé is a big market.", "Adjamé est un grand marché.", ["small", "bigs"]),
      g("small", "petit", "SMOL", "I live in a small house.", "J'habite dans une petite maison.", ["big", "smalls"]),
      g("good", "bon / bien", "GOUD", "This is good food.", "C'est de la bonne nourriture.", ["bad", "well"]),
      g("bad", "mauvais", "BÈD", "The road is bad.", "La route est mauvaise.", ["good", "badly"]),
      g("cheap", "pas cher", "TCHÏP", "These shoes are cheap.", "Ces chaussures ne sont pas chères.", ["expensive", "cheaps"]),
      g("expensive", "cher", "eks-PÈN-siv", "That phone is too expensive.", "Ce téléphone est trop cher.", ["cheap", "expensives"]),
      g("beautiful", "beau / belle", "BIOU-ti-foul", "What a beautiful dress!", "Quelle belle robe !", ["ugly", "beautifuls"]),
      g("new", "nouveau / neuf", "NIOU", "I have a new job.", "J'ai un nouveau travail.", ["old", "news"]),
      g("old", "vieux / ancien", "OLD", "My car is old.", "Ma voiture est vieille.", ["new", "young"]),
      g("young", "jeune", "YANG", "My boss is young.", "Mon patron est jeune.", ["old", "new"]),
      g("hot", "chaud", "HOT", "It's very hot today.", "Il fait très chaud aujourd'hui.", ["cold", "hots"]),
      g("cold", "froid / frais", "KOLD", "I'd like a cold drink.", "Je voudrais une boisson fraîche.", ["hot", "colds"]),
      g("happy", "content / heureux", "HÈ-pi", "We are happy to see you.", "Nous sommes contents de te voir.", ["sad", "tired"]),
      g("tired", "fatigué", "TAÏ-eurd", "I'm tired after work.", "Je suis fatigué après le travail.", ["happy", "tiring"]),
      g("busy", "occupé / animé", "BI-zi", "The port is busy today.", "Le port est très animé aujourd'hui.", ["easy", "free"], "Se dit « bizi »."),
      g("easy", "facile", "Ï-zi", "English is easy with Zazou!", "L'anglais est facile avec Zazou !", ["difficult", "easily"]),
      g("difficult", "difficile", "DI-fi-keult", "This exercise is difficult.", "Cet exercice est difficile.", ["easy", "difficults"]),
      g("fast", "rapide / vite", "FAST", "The motorbike is fast.", "La moto est rapide.", ["slow", "fastly"]),
      g("cheaper", "moins cher (que)", "TCHÏ-peur", "This shop is cheaper than that one.", "Cette boutique est moins chère que celle-là.", ["more cheap", "cheapest"], "Adjectif court + -er + than."),
      g("more expensive", "plus cher (que)", "mor eks-PÈN-siv", "A flight is more expensive than a bus.", "L'avion est plus cher que le car.", ["expensiver", "most expensive"], "Adjectif long : more + adjectif.")
    ]
  },
  {
    id: "connecteurs",
    title: "Les connecteurs logiques",
    color: "sun",
    intro: "Relier tes idées pour parler et écrire de façon fluide.",
    rules: [
      "Ajouter : and (et), also (aussi), too (aussi, en fin de phrase).",
      "Opposer : but (mais), however (cependant), although (bien que).",
      "Cause et conséquence : because (parce que) + raison ; so (donc) + conséquence.",
      "Ordre des étapes : first (d'abord), then (ensuite), after that (après ça), finally (enfin).",
      "Condition et temps : if (si), when (quand), before (avant), after (après), until (jusqu'à)."
    ],
    items: [
      g("and", "et", "ÈND", "I sell shoes and bags.", "Je vends des chaussures et des sacs.", ["but", "or"]),
      g("but", "mais", "BAT", "It's nice, but it's expensive.", "C'est joli, mais c'est cher.", ["and", "so"]),
      g("or", "ou", "OR", "Tea or coffee?", "Thé ou café ?", ["and", "but"]),
      g("because", "parce que", "bi-KOZ", "I'm late because of the traffic.", "Je suis en retard à cause des embouteillages.", ["so", "but"]),
      g("so", "donc / alors", "SO", "It was raining, so I took a taxi.", "Il pleuvait, donc j'ai pris un taxi.", ["because", "but"]),
      g("also", "aussi", "OL-so", "We also sell phones.", "Nous vendons aussi des téléphones.", ["too", "and"]),
      g("too", "aussi (fin de phrase)", "TOU", "I like it too.", "Je l'aime aussi.", ["also", "so"]),
      g("However", "cependant", "hao-È-veur", "The price is high. However, the quality is good.", "Le prix est élevé. Cependant, la qualité est bonne.", ["Because", "So"]),
      g("although", "bien que", "ol-ZO", "The shop is open although it's late.", "La boutique est ouverte bien qu'il soit tard.", ["because", "so"]),
      g("First", "d'abord", "FEURST", "First, check the documents.", "D'abord, vérifie les documents.", ["Finally", "Then"]),
      g("then", "ensuite", "ZÈN", "Pay first, then take the receipt.", "Paie d'abord, ensuite prends le reçu.", ["than", "before"], "then (ensuite) ≠ than (que)."),
      g("After that", "après ça", "AF-teur ZÈT", "After that, we went home.", "Après ça, nous sommes rentrés.", ["Before", "Because"]),
      g("Finally", "enfin / finalement", "FAÏ-neu-li", "Finally, the container arrived.", "Enfin, le conteneur est arrivé.", ["First", "Then"]),
      g("if", "si", "IF", "Call me if you have a problem.", "Appelle-moi si tu as un problème.", ["when", "so"]),
      g("when", "quand", "OUÈN", "Call me when you arrive.", "Appelle-moi quand tu arrives.", ["if", "then"]),
      g("before", "avant (de)", "bi-FOR", "Wash your hands before eating.", "Lave-toi les mains avant de manger.", ["after", "until"]),
      g("after", "après", "AF-teur", "We can talk after the meeting.", "On peut parler après la réunion.", ["before", "until"]),
      g("until", "jusqu'à", "eun-TIL", "The shop is open until nine.", "La boutique est ouverte jusqu'à neuf heures.", ["after", "before"]),
      g("for example", "par exemple", "for ig-ZAM-peul", "I like fruits, for example mangoes.", "J'aime les fruits, par exemple les mangues.", ["because", "so"]),
      g("while", "pendant que", "OUAÏL", "I listen to music while I work.", "J'écoute de la musique pendant que je travaille.", ["until", "if"])
    ]
  }
];
