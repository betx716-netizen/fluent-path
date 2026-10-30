import type { Section } from "./types";

// Section 1 est complète. Les sections 2 à 6 sont prévues pour la phase 4 (contenu).
export const SECTIONS: Section[] = [
  {
    id: "s1",
    level: "Débutant",
    cefr: "A1",
    title: "Premiers contacts pro",
    theme: "sable",
    plannedUnits: 6,
    units: [
      {
        id: "s1u1",
        title: "Se présenter",
        context: "Pro",
        goal: "Dire ton nom, ton métier et saluer un contact étranger.",
        points: [
          "« I am » = je suis. À l'oral on dit souvent « I'm ».",
          "« My name is… » = je m'appelle… (mot à mot : mon nom est).",
          "Pour le métier, on met « a » devant : I'm a trader, I'm an agent (« an » devant un son voyelle).",
          "« Nice to meet you » se dit à la première rencontre. On répond « Nice to meet you too »."
        ],
        examples: [
          ["Hello, my name is Kodjo.", "Bonjour, je m'appelle Kodjo."],
          ["I'm a customs agent.", "Je suis agent en douane."],
          ["Nice to meet you, Mr Okafor.", "Enchanté, monsieur Okafor."],
          ["What's your name?", "Comment vous appelez-vous ?"]
        ],
        vocab: [
          ["hello", "bonjour", "/həˈləʊ/"],
          ["my name is", "je m'appelle", "/maɪ neɪm ɪz/"],
          ["I'm", "je suis", "/aɪm/"],
          ["trader", "commerçant", "/ˈtreɪdə/"],
          ["customs agent", "agent en douane", "/ˈkʌstəmz ˈeɪdʒənt/"],
          ["nice to meet you", "enchanté", "/naɪs tə miːt juː/"]
        ],
        exercises: [
          { type: "mcq", prompt: "Comment dit-on « Je m'appelle Awa » ?", options: ["My name is Awa.", "I call Awa.", "Me name Awa.", "I have Awa."], answer: 0, explain: "On dit « My name is… ». « I call » est une traduction mot à mot du français." },
          { type: "fill", sentence: "I ___ a trader.", options: ["am", "is", "are", "have"], answer: 0, explain: "Avec « I », le verbe être est « am » : I am, souvent raccourci en I'm." },
          { type: "listen", audio: "Nice to meet you.", options: ["Nice to meet you.", "Nice to see you.", "Nice to eat you.", "Nice to meet two."], answer: 0, explain: "« Nice to meet you » se dit quand on rencontre quelqu'un pour la première fois." },
          { type: "build", fr: "Je suis agent en douane.", answer: "I am a customs agent", extra: ["an", "is", "custom"], explain: "« a » devant « customs », car le mot commence par un son consonne." },
          { type: "fill", sentence: "I'm ___ agent.", options: ["an", "a", "the", "one"], answer: 0, explain: "« agent » commence par un son voyelle, donc on dit « an agent »." },
          { type: "pairs", pairs: [["hello", "bonjour"], ["trader", "commerçant"], ["my name is", "je m'appelle"], ["nice to meet you", "enchanté"]] },
          { type: "mcq", prompt: "Ton contact dit « Nice to meet you ». Tu réponds :", options: ["Nice to meet you too.", "Yes, it is.", "I am fine nice.", "Me too meet."], answer: 0, explain: "On renvoie la politesse avec « too » (aussi) à la fin." },
          { type: "build", fr: "Comment vous appelez-vous ?", answer: "What is your name", extra: ["how", "you", "call"], explain: "En anglais on demande « What is your name? », mot à mot « quel est votre nom ? »." },
          { type: "listen", audio: "I'm a trader from Lomé.", options: ["I'm a trader from Lomé.", "I'm a teacher from Lomé.", "I'm a trailer from Lomé.", "I'm the trader in Lomé."], answer: 0, explain: "« trader » = commerçant. « from » = de, pour dire d'où l'on vient." },
          { type: "speak", text: "Hello, my name is Kodjo. Nice to meet you.", fr: "Bonjour, je m'appelle Kodjo. Enchanté." }
        ]
      },
      {
        id: "s1u2",
        title: "Mon entreprise",
        context: "Pro",
        goal: "Présenter ton entreprise et ce qu'elle fait.",
        points: [
          "« I work for… » = je travaille pour (une entreprise).",
          "« We sell… » = nous vendons… ; « We import… » = nous importons…",
          "« It's based in… » = elle est installée à…",
          "Au présent simple, on ajoute -s avec he / she / it : « The company sells rice. »"
        ],
        examples: [
          ["I work for a transit company.", "Je travaille pour une entreprise de transit."],
          ["We import rice and sugar.", "Nous importons du riz et du sucre."],
          ["Our office is based in Abidjan.", "Notre bureau est installé à Abidjan."],
          ["The company sells spare parts.", "L'entreprise vend des pièces détachées."]
        ],
        vocab: [
          ["company", "entreprise", "/ˈkʌmpəni/"],
          ["to work for", "travailler pour", "/wɜːk fɔː/"],
          ["to sell", "vendre", "/sel/"],
          ["to import", "importer", "/ɪmˈpɔːt/"],
          ["office", "bureau", "/ˈɒfɪs/"],
          ["customer", "client", "/ˈkʌstəmə/"]
        ],
        exercises: [
          { type: "mcq", prompt: "« Je travaille pour une entreprise de transit » se dit :", options: ["I work for a transit company.", "I work at a company of transit.", "I working for a transit company.", "I am work for a transit company."], answer: 0, explain: "L'adjectif se place avant le nom : transit company. Et pas de « am » avant « work »." },
          { type: "fill", sentence: "The company ___ rice.", options: ["sells", "sell", "selling", "is sell"], answer: 0, explain: "Avec « the company » (= it), on ajoute -s au présent : sells." },
          { type: "fill", sentence: "We ___ cars from Europe.", options: ["import", "imports", "importing", "are import"], answer: 0, explain: "Avec « we », pas de -s : we import." },
          { type: "pairs", pairs: [["company", "entreprise"], ["office", "bureau"], ["customer", "client"], ["to sell", "vendre"]] },
          { type: "listen", audio: "Our office is based in Abidjan.", options: ["Our office is based in Abidjan.", "Our office is close to Abidjan.", "Our offices are in Abidjan.", "Our boss is based in Abidjan."], answer: 0, explain: "« based in » = installé à. « Our » = notre." },
          { type: "build", fr: "Nous importons du riz.", answer: "We import rice", extra: ["imports", "the", "a"], explain: "Pas d'article devant « rice » : on parle du riz en général." },
          { type: "mcq", prompt: "Que veut dire « customer » ?", options: ["client", "douane", "costume", "coutume"], answer: 0, explain: "Faux ami ! « customer » = client. La douane se dit « customs »." },
          { type: "build", fr: "L'entreprise vend des pièces détachées.", answer: "The company sells spare parts", extra: ["sell", "pieces", "a"], explain: "« spare parts » = pièces détachées. « sells » avec -s car « the company » = it." },
          { type: "listen", audio: "We sell to customers in Ghana.", options: ["We sell to customers in Ghana.", "We sail to customers in Ghana.", "We sell two customers in Ghana.", "We send customers to Ghana."], answer: 0, explain: "« sell » (vendre) et « sail » (naviguer) se ressemblent : écoute bien la voyelle." },
          { type: "speak", text: "I work for a transit company.", fr: "Je travaille pour une entreprise de transit." }
        ]
      },
      {
        id: "s1u3",
        title: "Nombres et prix",
        context: "Commerce",
        goal: "Comprendre et donner un prix, une quantité.",
        points: [
          "« How much is it? » = combien ça coûte ? (une chose).",
          "« How many…? » = combien de… ? pour ce qu'on compte (bags, boxes).",
          "13 = thirteen et 30 = thirty : l'accent change ! thirTEEN / THIRty.",
          "Le prix se dit avec la devise après : « fifty dollars », « ten thousand CFA francs »."
        ],
        examples: [
          ["How much is it?", "Combien ça coûte ?"],
          ["It's fifteen dollars a bag.", "C'est quinze dollars le sac."],
          ["How many boxes do you need?", "Combien de cartons vous faut-il ?"],
          ["That's too expensive.", "C'est trop cher."]
        ],
        vocab: [
          ["how much", "combien (prix)", "/haʊ mʌtʃ/"],
          ["how many", "combien de (nombre)", "/haʊ ˈmeni/"],
          ["price", "prix", "/praɪs/"],
          ["cheap", "bon marché", "/tʃiːp/"],
          ["expensive", "cher", "/ɪkˈspensɪv/"],
          ["bag", "sac", "/bæɡ/"]
        ],
        exercises: [
          { type: "listen", audio: "It's thirteen dollars.", options: ["13 $", "30 $", "3 $", "33 $"], answer: 0, explain: "thirTEEN (13) : l'accent est sur la fin. THIRty (30) : l'accent est au début." },
          { type: "listen", audio: "It's thirty dollars.", options: ["30 $", "13 $", "33 $", "300 $"], answer: 0, explain: "THIRty : l'accent est sur la première syllabe, et la fin est courte." },
          { type: "fill", sentence: "How ___ is this bag of rice?", options: ["much", "many", "price", "cost"], answer: 0, explain: "Pour un prix, on demande « How much…? »." },
          { type: "fill", sentence: "How ___ boxes do you need?", options: ["many", "much", "lot", "number"], answer: 0, explain: "« boxes » se compte (one box, two boxes) : on utilise « how many »." },
          { type: "pairs", pairs: [["price", "prix"], ["cheap", "bon marché"], ["expensive", "cher"], ["bag", "sac"]] },
          { type: "mcq", prompt: "Comment dit-on 50 ?", options: ["fifty", "fifteen", "five ten", "fivety"], answer: 0, explain: "50 = fifty. 15 = fifteen." },
          { type: "build", fr: "C'est quinze dollars le sac.", answer: "It is fifteen dollars a bag", extra: ["fifty", "the", "for"], explain: "« a bag » = par sac, le sac. Le prix se dit avec « a » : ten dollars a kilo." },
          { type: "mcq", prompt: "Le client dit « That's too expensive ». Il veut dire :", options: ["C'est trop cher.", "C'est très bien.", "C'est trop loin.", "C'est trop lourd."], answer: 0, explain: "« too » = trop. « expensive » = cher." },
          { type: "build", fr: "Combien ça coûte ?", answer: "How much is it", extra: ["many", "cost", "are"], explain: "La question la plus utile du marché : How much is it?" },
          { type: "speak", text: "How much is it? It's fifteen dollars a bag.", fr: "Combien ça coûte ? C'est quinze dollars le sac." }
        ]
      },
      {
        id: "s1u4",
        title: "Accueillir un client",
        context: "Commerce",
        goal: "Accueillir, proposer ton aide et conclure poliment.",
        points: [
          "« Welcome! » = bienvenue. « Can I help you? » = je peux vous aider ?",
          "« Here you are » = voici (quand on tend quelque chose).",
          "« Thank you » → on répond « You're welcome » (de rien).",
          "« Would you like…? » = voulez-vous… ? C'est plus poli que « Do you want…? »."
        ],
        examples: [
          ["Welcome! Can I help you?", "Bienvenue ! Je peux vous aider ?"],
          ["Would you like some tea?", "Voulez-vous du thé ?"],
          ["Here you are.", "Voici."],
          ["You're welcome. See you soon!", "De rien. À bientôt !"]
        ],
        vocab: [
          ["welcome", "bienvenue", "/ˈwelkəm/"],
          ["can I help you?", "je peux vous aider ?", "/kən aɪ help juː/"],
          ["would you like…?", "voulez-vous… ?", "/wʊd juː laɪk/"],
          ["here you are", "voici", "/hɪə juː ɑː/"],
          ["you're welcome", "de rien", "/jɔː ˈwelkəm/"],
          ["see you soon", "à bientôt", "/siː juː suːn/"]
        ],
        exercises: [
          { type: "mcq", prompt: "Un client entre dans ta boutique. Tu dis :", options: ["Welcome! Can I help you?", "Welcome! What you want?", "Hello! Help you?", "Good! You need?"], answer: 0, explain: "« Can I help you? » est la formule polie et naturelle." },
          { type: "mcq", prompt: "Le client te dit « Thank you ». Tu réponds :", options: ["You're welcome.", "Welcome.", "Thank you too much.", "It's nothing problem."], answer: 0, explain: "« You're welcome » = de rien. « Welcome » seul veut dire bienvenue." },
          { type: "fill", sentence: "___ you like some water?", options: ["Would", "Do", "Are", "Will"], answer: 0, explain: "« Would you like…? » est la façon polie de proposer quelque chose." },
          { type: "listen", audio: "Here you are.", options: ["Here you are.", "Where you are.", "Here you go out.", "Hear you are."], answer: 0, explain: "On dit « Here you are » (ou « Here you go ») en tendant un objet." },
          { type: "pairs", pairs: [["welcome", "bienvenue"], ["here you are", "voici"], ["you're welcome", "de rien"], ["see you soon", "à bientôt"]] },
          { type: "build", fr: "Voulez-vous du thé ?", answer: "Would you like some tea", extra: ["want", "do", "a"], explain: "« some » s'utilise pour proposer une quantité non comptée : some tea, some water." },
          { type: "build", fr: "Je peux vous aider ?", answer: "Can I help you", extra: ["me", "do", "helping"], explain: "Dans une question, on inverse : Can I…? et pas I can…?" },
          { type: "listen", audio: "Would you like to see the samples?", options: ["Would you like to see the samples?", "Would you like to sell the samples?", "Would you like to see the sandals?", "Would you like the simple?"], answer: 0, explain: "« samples » = échantillons. Très utile pour montrer ta marchandise." },
          { type: "speak", text: "Welcome! Can I help you?", fr: "Bienvenue ! Je peux vous aider ?" }
        ]
      },
      {
        id: "s1u5",
        title: "Conteneur et dossier",
        context: "Transit",
        goal: "Épeler et donner un numéro de conteneur ou de dossier.",
        points: [
          "« Can you spell that, please? » = pouvez-vous épeler ?",
          "Attention aux lettres : A = « eï », E = « i », I = « aï ». G = « dji », J = « djeï ».",
          "Un numéro se lit chiffre par chiffre. 0 se dit « zero » ou « oh ».",
          "« shipment » = envoi, expédition. « container » = conteneur. « file number » = numéro de dossier."
        ],
        examples: [
          ["What's the container number?", "Quel est le numéro du conteneur ?"],
          ["It's M-S-C-U, four, five, two, oh, nine, one.", "C'est MSCU 452091."],
          ["Can you spell that, please?", "Pouvez-vous épeler, s'il vous plaît ?"],
          ["The shipment is at the port.", "L'expédition est au port."]
        ],
        vocab: [
          ["container", "conteneur", "/kənˈteɪnə/"],
          ["shipment", "expédition, envoi", "/ˈʃɪpmənt/"],
          ["file number", "numéro de dossier", "/faɪl ˈnʌmbə/"],
          ["port", "port", "/pɔːt/"],
          ["to spell", "épeler", "/spel/"],
          ["please", "s'il vous plaît", "/pliːz/"]
        ],
        exercises: [
          { type: "listen", audio: "E", options: ["E", "I", "A", "Y"], answer: 0, explain: "En anglais, la lettre E se prononce « i »." },
          { type: "listen", audio: "I", options: ["I", "E", "A", "Y"], answer: 0, explain: "En anglais, la lettre I se prononce « aï »." },
          { type: "listen", audio: "G J", options: ["G J", "J G", "G G", "J J"], answer: 0, explain: "G se dit « dji », J se dit « djeï ». C'est l'inverse du français !" },
          { type: "fill", sentence: "Can you ___ that, please?", options: ["spell", "spelling", "speak", "write it"], answer: 0, explain: "« to spell » = épeler." },
          { type: "pairs", pairs: [["container", "conteneur"], ["shipment", "expédition"], ["file number", "numéro de dossier"], ["to spell", "épeler"]] },
          { type: "build", fr: "Quel est le numéro du conteneur ?", answer: "What is the container number", extra: ["number of", "which", "a"], explain: "En anglais : container number (le nom qui précise vient avant)." },
          { type: "mcq", prompt: "« The shipment is at the port » veut dire :", options: ["L'expédition est au port.", "Le bateau est au port.", "Le paiement est au port.", "Le chauffeur est au port."], answer: 0, explain: "« shipment » = expédition, la marchandise envoyée." },
          { type: "listen", audio: "The file number is two, oh, seven, five.", options: ["2075", "2705", "2575", "275"], answer: 0, explain: "« oh » se dit souvent à la place de « zero » quand on lit un numéro." },
          { type: "speak", text: "The shipment is at the port.", fr: "L'expédition est au port." }
        ]
      },
      {
        id: "s1u6",
        title: "Prendre rendez-vous",
        context: "Pro",
        goal: "Proposer un jour et une heure de rendez-vous.",
        points: [
          "Les jours prennent une majuscule : Monday, Tuesday, Wednesday, Thursday, Friday.",
          "« on » + jour : on Monday. « at » + heure : at 10 a.m.",
          "a.m. = le matin, p.m. = l'après-midi et le soir. 3 p.m. = 15 h.",
          "« Are you free on…? » = êtes-vous disponible… ?"
        ],
        examples: [
          ["Are you free on Monday?", "Êtes-vous disponible lundi ?"],
          ["Let's meet at 10 a.m.", "Retrouvons-nous à 10 h."],
          ["Thursday at 3 p.m. is fine.", "Jeudi à 15 h, ça me va."],
          ["See you on Friday.", "À vendredi."]
        ],
        vocab: [
          ["meeting", "réunion, rendez-vous", "/ˈmiːtɪŋ/"],
          ["Monday", "lundi", "/ˈmʌndeɪ/"],
          ["Wednesday", "mercredi", "/ˈwenzdeɪ/"],
          ["Thursday", "jeudi", "/ˈθɜːzdeɪ/"],
          ["free", "disponible, libre", "/friː/"],
          ["fine", "ça va, d'accord", "/faɪn/"]
        ],
        exercises: [
          { type: "fill", sentence: "Are you free ___ Monday?", options: ["on", "at", "in", "the"], answer: 0, explain: "On utilise « on » devant un jour." },
          { type: "fill", sentence: "Let's meet ___ 10 a.m.", options: ["at", "on", "in", "to"], answer: 0, explain: "On utilise « at » devant une heure." },
          { type: "mcq", prompt: "3 p.m., c'est :", options: ["15 h", "3 h du matin", "13 h", "midi"], answer: 0, explain: "p.m. = après midi. 3 p.m. = 15 h." },
          { type: "listen", audio: "Wednesday", options: ["Wednesday", "Thursday", "Tuesday", "Weekend"], answer: 0, explain: "Wednesday se prononce « ouènzdeï » : le premier d ne se prononce pas." },
          { type: "pairs", pairs: [["Monday", "lundi"], ["Wednesday", "mercredi"], ["Thursday", "jeudi"], ["meeting", "réunion"]] },
          { type: "build", fr: "Êtes-vous disponible lundi ?", answer: "Are you free on Monday", extra: ["at", "in", "is"], explain: "« free » = disponible. Majuscule à Monday." },
          { type: "listen", audio: "Thursday at three p.m. is fine for me.", options: ["Jeudi 15 h", "Mardi 15 h", "Jeudi 13 h", "Jeudi 3 h"], answer: 0, explain: "Thursday = jeudi (son « th »). Tuesday = mardi." },
          { type: "build", fr: "À vendredi.", answer: "See you on Friday", extra: ["at", "to", "in"], explain: "« See you on + jour » = à + jour." },
          { type: "speak", text: "Are you free on Thursday at ten?", fr: "Êtes-vous disponible jeudi à 10 h ?" }
        ]
      }
    ]
  },
  { id: "s2", level: "Débutant", cefr: "A2", title: "Le commerce au quotidien", theme: "sable", plannedUnits: 10, units: [] },
  { id: "s3", level: "Intermédiaire", cefr: "B1", title: "Transit et logistique", theme: "savane", plannedUnits: 10, units: [] },
  { id: "s4", level: "Intermédiaire", cefr: "B2", title: "Négocier et réclamer", theme: "savane", plannedUnits: 10, units: [] },
  { id: "s5", level: "Avancé", cefr: "C1", title: "Contrats et Incoterms", theme: "nuit", plannedUnits: 10, units: [] },
  { id: "s6", level: "Avancé", cefr: "C2", title: "Convaincre à l'international", theme: "nuit", plannedUnits: 10, units: [] }
];

export const allUnits = SECTIONS.flatMap(s => s.units);
