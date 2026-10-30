import type { Context } from "./types";

export type Voice = "en-GB" | "en-US" | "en-NG" | "en-GH" | "en-IN" | "en-ZA";

export interface Scenario {
  id: string;
  title: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  context: Context;
  partner: { name: string; role: string; voice: Voice; origin: string };
  setting: string; // pour l'IA, en anglais
  goal: string; // pour l'utilisateur, en français
  opening: string;
  openingFr: string;
  objectives: { id: string; fr: string; en: string }[];
  unlockAfter?: string; // id d'unité qui doit être validée
  extra?: string; // consignes du programme ZAZOU pour le tuteur
  maxTurns?: number;
}

// Les 10 premiers jeux de rôle du cahier des charges (section 2).
export const SCENARIOS: Scenario[] = [
  {
    id: "r01",
    title: "Se présenter à un visiteur",
    level: "A1",
    context: "Pro",
    partner: { name: "James", role: "visiteur d'affaires", voice: "en-GB", origin: "Royaume-Uni" },
    setting: "James, a British business visitor, meets the learner at the learner's office for the first time.",
    goal: "Salue James, présente-toi et présente ton entreprise.",
    opening: "Hello! I'm James Carter, from London. Nice to meet you. And you are?",
    openingFr: "Bonjour ! Je suis James Carter, de Londres. Enchanté. Et vous êtes… ?",
    objectives: [
      { id: "name", fr: "Dire ton nom", en: "the learner says their name" },
      { id: "job", fr: "Dire ton métier", en: "the learner says their job" },
      { id: "company", fr: "Dire ce que fait ton entreprise", en: "the learner says what their company does or sells" }
    ]
  },
  {
    id: "r02",
    title: "Un client demande un prix",
    level: "A1",
    context: "Commerce",
    partner: { name: "Chinedu", role: "client", voice: "en-NG", origin: "Nigeria" },
    setting: "Chinedu, a Nigerian customer, visits the learner's shop and wants to buy bags of rice.",
    goal: "Accueille Chinedu, donne le prix d'un sac de riz et la quantité disponible.",
    opening: "Good morning! I need some bags of rice. How much is one bag?",
    openingFr: "Bonjour ! J'ai besoin de sacs de riz. Combien coûte un sac ?",
    objectives: [
      { id: "greet", fr: "Accueillir le client", en: "the learner greets or welcomes the customer" },
      { id: "price", fr: "Donner un prix", en: "the learner gives a price" },
      { id: "qty", fr: "Parler de la quantité", en: "the learner asks or tells how many bags" }
    ],
    unlockAfter: "s1u2"
  },
  {
    id: "r03",
    title: "Compter et négocier un peu",
    level: "A1",
    context: "Commerce",
    partner: { name: "Ama", role: "cliente", voice: "en-GH", origin: "Ghana" },
    setting: "Ama, a Ghanaian trader, wants 20 boxes of soap and thinks the price is a bit high.",
    goal: "Donne un prix total pour 20 cartons et propose une petite remise.",
    opening: "Hello! I want twenty boxes of soap. What is the total price?",
    openingFr: "Bonjour ! Je veux vingt cartons de savon. Quel est le prix total ?",
    objectives: [
      { id: "total", fr: "Donner un prix total", en: "the learner gives a total price" },
      { id: "discount", fr: "Proposer une remise", en: "the learner offers a discount or a lower price" },
      { id: "thanks", fr: "Remercier et conclure", en: "the learner thanks the customer or closes the deal" }
    ],
    unlockAfter: "s1u3"
  },
  {
    id: "r04",
    title: "Le numéro du conteneur",
    level: "A1",
    context: "Transit",
    partner: { name: "Mike", role: "agent maritime", voice: "en-US", origin: "États-Unis" },
    setting: "Mike, an American shipping agent, calls the learner to confirm a container number and its port.",
    goal: "Donne le numéro du conteneur MSCU 452091 en l'épelant, et dis à quel port il arrive.",
    opening: "Hi, this is Mike from the shipping line. Can you give me the container number, please?",
    openingFr: "Bonjour, ici Mike de la compagnie maritime. Pouvez-vous me donner le numéro du conteneur, s'il vous plaît ?",
    objectives: [
      { id: "number", fr: "Donner le numéro du conteneur", en: "the learner gives a container number with letters and digits" },
      { id: "spell", fr: "Épeler les lettres", en: "the learner spells letters one by one" },
      { id: "port", fr: "Dire le port d'arrivée", en: "the learner names a port or city" }
    ],
    unlockAfter: "s1u5"
  },
  {
    id: "r05",
    title: "Prendre rendez-vous",
    level: "A1",
    context: "Pro",
    partner: { name: "Sarah", role: "assistante", voice: "en-GB", origin: "Royaume-Uni" },
    setting: "Sarah, a British executive assistant, wants to book a meeting between her boss and the learner next week.",
    goal: "Mets-toi d'accord sur un jour et une heure de rendez-vous.",
    opening: "Good afternoon. Mr Wright would like to meet you next week. When are you free?",
    openingFr: "Bon après-midi. M. Wright aimerait vous rencontrer la semaine prochaine. Quand êtes-vous disponible ?",
    objectives: [
      { id: "day", fr: "Proposer un jour", en: "the learner proposes a day of the week" },
      { id: "time", fr: "Proposer une heure", en: "the learner proposes a time" },
      { id: "confirm", fr: "Confirmer le rendez-vous", en: "the learner confirms the meeting" }
    ],
    unlockAfter: "s1u6"
  },
  {
    id: "r06",
    title: "Où est la marchandise ?",
    level: "A2",
    context: "Transit",
    partner: { name: "Kwame", role: "chauffeur routier", voice: "en-GH", origin: "Ghana" },
    setting: "Kwame, a Ghanaian truck driver, is at the Togo-Ghana border and asks where to deliver the goods and which documents he needs.",
    goal: "Indique à Kwame où livrer et quels documents montrer à la frontière.",
    opening: "Hello boss, I'm at the border now. Where do I deliver the goods?",
    openingFr: "Bonjour patron, je suis à la frontière. Où est-ce que je livre la marchandise ?",
    objectives: [
      { id: "place", fr: "Indiquer le lieu de livraison", en: "the learner tells where to deliver (warehouse, port, address)" },
      { id: "docs", fr: "Citer un document", en: "the learner mentions a document (invoice, waybill, papers)" },
      { id: "time", fr: "Donner une heure d'arrivée", en: "the learner asks or gives an arrival time" }
    ],
    unlockAfter: "s1u6"
  },
  {
    id: "r07",
    title: "Passer commande à un fournisseur",
    level: "A2",
    context: "Commerce",
    partner: { name: "Priya", role: "fournisseuse", voice: "en-IN", origin: "Inde" },
    setting: "Priya, an Indian supplier of textiles, takes the learner's first order by phone.",
    goal: "Commande 500 mètres de tissu, demande le prix et le délai de livraison.",
    opening: "Hello, Priya speaking from Mumbai Textiles. How can I help you today?",
    openingFr: "Bonjour, Priya de Mumbai Textiles à l'appareil. Comment puis-je vous aider aujourd'hui ?",
    objectives: [
      { id: "order", fr: "Passer la commande", en: "the learner orders a product with a quantity" },
      { id: "price", fr: "Demander le prix", en: "the learner asks the price" },
      { id: "delivery", fr: "Demander le délai de livraison", en: "the learner asks when the delivery will arrive" }
    ],
    unlockAfter: "s1u6"
  },
  {
    id: "r08",
    title: "Négocier une remise",
    level: "B1",
    context: "Commerce",
    partner: { name: "Tunde", role: "fournisseur", voice: "en-NG", origin: "Nigeria" },
    setting: "Tunde, a Nigerian supplier of building materials, discusses a large cement order. He starts at 9 dollars a bag and can go down to 8 dollars for big quantities.",
    goal: "Obtiens un meilleur prix pour une grosse commande de ciment.",
    opening: "My friend, for cement our price is nine dollars a bag. How many bags are you looking at?",
    openingFr: "Mon ami, notre prix pour le ciment est de neuf dollars le sac. Combien de sacs voulez-vous ?",
    objectives: [
      { id: "volume", fr: "Annoncer un gros volume", en: "the learner announces a large quantity" },
      { id: "ask", fr: "Demander une remise", en: "the learner asks for a discount or better price" },
      { id: "agree", fr: "Conclure un accord", en: "the learner agrees on a final price" }
    ],
    unlockAfter: "s1u6"
  },
  {
    id: "r09",
    title: "Expliquer les documents d'import",
    level: "B1",
    context: "Transit",
    partner: { name: "Linda", role: "importatrice", voice: "en-US", origin: "États-Unis" },
    setting: "Linda, an American importer, is shipping goods to West Africa for the first time and asks the learner which documents are needed for customs clearance.",
    goal: "Explique à Linda les documents nécessaires : connaissement, facture, certificat d'origine.",
    opening: "Hi! It's my first shipment to Lomé. What documents do I need for customs?",
    openingFr: "Bonjour ! C'est mon premier envoi vers Lomé. De quels documents ai-je besoin pour la douane ?",
    objectives: [
      { id: "bl", fr: "Parler du connaissement (B/L)", en: "the learner mentions the bill of lading" },
      { id: "invoice", fr: "Parler de la facture commerciale", en: "the learner mentions the commercial invoice" },
      { id: "origin", fr: "Parler du certificat d'origine", en: "the learner mentions the certificate of origin" }
    ],
    unlockAfter: "s1u6"
  },
  {
    id: "r10",
    title: "Annoncer un retard en douane",
    level: "B1",
    context: "Transit",
    partner: { name: "Oliver", role: "client mécontent", voice: "en-GB", origin: "Royaume-Uni" },
    setting: "Oliver, a British client, is unhappy because his container is blocked at customs for three days. The learner works for the transit company.",
    goal: "Explique le retard, excuse-toi et propose une solution avec une nouvelle date.",
    opening: "I've been waiting three days! Why is my container still at the port?",
    openingFr: "J'attends depuis trois jours ! Pourquoi mon conteneur est-il toujours au port ?",
    objectives: [
      { id: "explain", fr: "Expliquer la cause du retard", en: "the learner explains the reason for the delay" },
      { id: "sorry", fr: "Présenter des excuses", en: "the learner apologises" },
      { id: "solution", fr: "Proposer une solution et une date", en: "the learner proposes a solution or a new date" }
    ],
    unlockAfter: "s1u6"
  },
  {
    id: "r11",
    title: "Suivre une expédition",
    level: "B1",
    context: "Transit",
    partner: { name: "Thabo", role: "agent de compagnie maritime", voice: "en-ZA", origin: "Afrique du Sud" },
    setting: "Thabo works for a South African shipping line. The learner calls to track a container on the vessel MSC Durban, due at Lomé port. The vessel is two days late because of bad weather in Durban.",
    goal: "Demande la date d'arrivée (ETA) du navire, la date de déchargement et le numéro de suivi.",
    opening: "Good morning, Southern Star Shipping, Thabo speaking. How can I help?",
    openingFr: "Bonjour, Southern Star Shipping, Thabo à l'appareil. Comment puis-je vous aider ?",
    objectives: [
      { id: "eta", fr: "Demander l'ETA du navire", en: "the learner asks when the vessel will arrive (ETA)" },
      { id: "discharge", fr: "Demander la date de déchargement", en: "the learner asks when the container will be discharged or unloaded" },
      { id: "tracking", fr: "Obtenir ou donner un numéro de suivi", en: "the learner asks for or gives a tracking, booking or container number" }
    ],
    unlockAfter: "s3u4"
  },
  {
    id: "r12",
    title: "Marchandise abîmée",
    level: "B1",
    context: "Commerce",
    partner: { name: "Mr Chen", role: "fournisseur", voice: "en-GB", origin: "Chine" },
    setting: "Mr Chen is a Chinese supplier who speaks English. 40 of the 500 ceramic tiles boxes he sent arrived broken. He is polite but first suggests the transport company is responsible.",
    goal: "Signale les cartons abîmés, envoie des preuves et obtiens un remplacement ou un avoir.",
    opening: "Hello, Mr Chen here. I received your message. What seems to be the problem with the tiles?",
    openingFr: "Bonjour, ici M. Chen. J'ai reçu votre message. Quel est le problème avec les carreaux ?",
    objectives: [
      { id: "problem", fr: "Décrire le problème et la quantité", en: "the learner explains that goods are damaged or broken and how many" },
      { id: "proof", fr: "Proposer des preuves (photos, rapport)", en: "the learner offers or mentions photos, a report or proof" },
      { id: "solution", fr: "Obtenir un remplacement ou un avoir", en: "the learner asks for a replacement, refund, discount or credit note" }
    ],
    unlockAfter: "s2u8"
  },
  {
    id: "r13",
    title: "Entretien d'embauche",
    level: "B1",
    context: "Pro",
    partner: { name: "Jennifer", role: "recruteuse", voice: "en-US", origin: "États-Unis" },
    setting: "Jennifer recruits a sales and logistics coordinator for an American trading company opening an office in Abidjan. She interviews the learner by video.",
    goal: "Présente ton expérience, une qualité et explique pourquoi tu veux ce poste.",
    opening: "Hi, thanks for joining the call. So, tell me a little about yourself and your experience.",
    openingFr: "Bonjour, merci d'être là. Alors, parlez-moi un peu de vous et de votre expérience.",
    objectives: [
      { id: "experience", fr: "Décrire ton expérience", en: "the learner describes their work experience" },
      { id: "strength", fr: "Citer une qualité avec un exemple", en: "the learner names a strength or skill, ideally with an example" },
      { id: "motivation", fr: "Expliquer ta motivation", en: "the learner explains why they want the job" }
    ],
    unlockAfter: "s4u8"
  },
  {
    id: "r14",
    title: "Réunion en visio",
    level: "B1",
    context: "Pro",
    partner: { name: "Grace", role: "cheffe de projet", voice: "en-GH", origin: "Ghana" },
    setting: "Grace leads a weekly video call about a joint project: importing solar panels through Tema port to Lomé. She asks the learner for an update on customs and transport.",
    goal: "Fais le point sur ton avancement, signale un problème et propose la prochaine étape.",
    opening: "Good afternoon everyone. Let's start with the update from Lomé. Where are we with the solar panels?",
    openingFr: "Bon après-midi à tous. Commençons par le point de Lomé. Où en sommes-nous avec les panneaux solaires ?",
    objectives: [
      { id: "update", fr: "Donner un point d'avancement", en: "the learner gives a progress update" },
      { id: "issue", fr: "Signaler un problème ou un risque", en: "the learner mentions a problem, risk or delay" },
      { id: "next", fr: "Proposer la prochaine étape", en: "the learner proposes a next step or action point" }
    ],
    unlockAfter: "s3u9"
  },
  {
    id: "r15",
    title: "Incoterms : qui paie quoi ?",
    level: "B2",
    context: "Transit",
    partner: { name: "Edward", role: "acheteur", voice: "en-GB", origin: "Royaume-Uni" },
    setting: "Edward, a British buyer of cashew nuts, hesitates between FOB Abidjan and CIF Felixstowe. He wants to understand who pays freight and insurance and when the risk passes.",
    goal: "Explique la différence entre FOB et CIF (fret, assurance, transfert du risque) et recommande une option.",
    opening: "I'm a bit confused, to be honest. What's the actual difference between FOB and CIF for me?",
    openingFr: "Pour être honnête, je suis un peu perdu. Quelle est la vraie différence entre FOB et CIF pour moi ?",
    objectives: [
      { id: "fob", fr: "Expliquer FOB", en: "the learner explains FOB (buyer pays main freight, risk passes when goods are on board)" },
      { id: "cif", fr: "Expliquer CIF", en: "the learner explains CIF (seller pays freight and insurance to the destination port)" },
      { id: "advice", fr: "Recommander une option", en: "the learner recommends one option with a reason" }
    ],
    unlockAfter: "s5u1"
  },
  {
    id: "r16",
    title: "Négocier le paiement",
    level: "C1",
    context: "Commerce",
    partner: { name: "Mrs Adeyemi", role: "banquière", voice: "en-NG", origin: "Nigeria" },
    setting: "Mrs Adeyemi is a trade finance manager at a Lagos bank. The learner's company wants to pay a supplier with a 30 % deposit and the balance by letter of credit. She asks precise questions about documents and dates.",
    goal: "Négocie un paiement avec acompte et crédit documentaire : montants, documents exigés, date limite.",
    opening: "Good morning. I understand you'd like to structure a payment with a deposit and a letter of credit. Walk me through it.",
    openingFr: "Bonjour. Je crois comprendre que vous voulez un paiement avec acompte et crédit documentaire. Expliquez-moi.",
    objectives: [
      { id: "deposit", fr: "Proposer l'acompte et le solde", en: "the learner explains the deposit and balance split" },
      { id: "documents", fr: "Citer les documents exigés", en: "the learner lists documents required under the letter of credit" },
      { id: "expiry", fr: "Fixer une date limite", en: "the learner proposes an expiry or shipment date" }
    ],
    unlockAfter: "s5u5"
  },
  {
    id: "r17",
    title: "Présenter une offre",
    level: "B2",
    context: "Commerce",
    partner: { name: "Mr Owusu", role: "directeur d'un distributeur", voice: "en-GH", origin: "Ghana" },
    setting: "Mr Owusu runs a distribution company in Kumasi. The learner presents an offer to supply palm oil every month. He is interested but finds the price high and the minimum order large.",
    goal: "Présente ton offre (produit, prix, volume, délai) et réponds à ses objections.",
    opening: "Thank you for coming to Kumasi. I've read your email. Convince me — why should we work with you?",
    openingFr: "Merci d'être venu à Kumasi. J'ai lu votre e-mail. Convainquez-moi : pourquoi travailler avec vous ?",
    objectives: [
      { id: "offer", fr: "Présenter l'offre", en: "the learner presents the product, price and volume" },
      { id: "benefit", fr: "Mettre en avant un avantage", en: "the learner highlights a benefit (quality, reliability, delivery time)" },
      { id: "objection", fr: "Répondre à une objection", en: "the learner answers an objection about price or minimum order" }
    ],
    unlockAfter: "s4u1"
  },
  {
    id: "r18",
    title: "Litige sur les surestaries",
    level: "C1",
    context: "Transit",
    partner: { name: "Brian", role: "armateur", voice: "en-US", origin: "États-Unis" },
    setting: "Brian represents an American shipping line and claims 4,800 dollars of demurrage for three containers held 12 days at Lomé port. The learner's company says customs inspection caused 7 of those days.",
    goal: "Conteste une partie des frais avec des arguments, et propose un compromis.",
    opening: "We've sent you an invoice for 4,800 dollars in demurrage. I'd like to know when we can expect payment.",
    openingFr: "Nous vous avons envoyé une facture de 4 800 dollars de surestaries. J'aimerais savoir quand nous serons payés.",
    objectives: [
      { id: "contest", fr: "Contester une partie des frais", en: "the learner disputes part of the demurrage charges" },
      { id: "argument", fr: "Justifier avec un argument", en: "the learner gives a reason such as customs inspection or free time" },
      { id: "compromise", fr: "Proposer un compromis", en: "the learner proposes a compromise or reduced amount" }
    ],
    unlockAfter: "s5u6"
  },
  {
    id: "r19",
    title: "Convaincre un investisseur",
    level: "C2",
    context: "Pro",
    partner: { name: "Charlotte", role: "investisseuse", voice: "en-GB", origin: "Royaume-Uni" },
    setting: "Charlotte manages an investment fund in London. She is sceptical but curious about financing a new logistics agency in Lomé run by the learner. She asks tough questions about risk and returns.",
    goal: "Convaincs Charlotte de financer ton agence à Lomé : marché, avantage, chiffres, réponse aux risques.",
    opening: "I'll be candid: West African logistics isn't our usual territory. Why Lomé, and why you?",
    openingFr: "Je serai franche : la logistique en Afrique de l'Ouest n'est pas notre domaine habituel. Pourquoi Lomé, et pourquoi vous ?",
    objectives: [
      { id: "market", fr: "Présenter le marché", en: "the learner explains the market opportunity (port of Lomé, hinterland countries)" },
      { id: "edge", fr: "Montrer ton avantage", en: "the learner explains their competitive advantage or experience" },
      { id: "risk", fr: "Répondre sur les risques", en: "the learner addresses a risk convincingly" }
    ],
    unlockAfter: "s6u1"
  },
  {
    id: "r20",
    title: "Réseauter dans un salon",
    level: "B2",
    context: "Commerce",
    partner: { name: "Aisha", role: "acheteuse", voice: "en-ZA", origin: "Afrique du Sud" },
    setting: "At a trade fair in Lagos, Aisha, a South African buyer of textiles, stops at the learner's stand. She has only five minutes before her next meeting.",
    goal: "Présente-toi en 30 secondes, découvre ce qu'elle cherche et obtiens un prochain rendez-vous.",
    opening: "Hi there! Lovely stand. I've only got a few minutes — so, what do you do?",
    openingFr: "Bonjour ! Joli stand. Je n'ai que quelques minutes, alors, que faites-vous ?",
    objectives: [
      { id: "pitch", fr: "Te présenter en quelques phrases", en: "the learner gives a short pitch about their company" },
      { id: "needs", fr: "Demander ce qu'elle recherche", en: "the learner asks about her needs" },
      { id: "followup", fr: "Obtenir un suivi (carte, rendez-vous)", en: "the learner asks for a business card, email or follow-up meeting" }
    ],
    unlockAfter: "s6u10"
  }
];
