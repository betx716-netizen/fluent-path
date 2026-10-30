import type { Context } from "./types";

export type Voice = "en-GB" | "en-US" | "en-NG" | "en-GH" | "en-IN" | "en-ZA";

export interface Scenario {
  id: string;
  title: string;
  level: "A1" | "A2" | "B1";
  context: Context;
  partner: { name: string; role: string; voice: Voice; origin: string };
  setting: string; // pour l'IA, en anglais
  goal: string; // pour l'utilisateur, en français
  opening: string;
  openingFr: string;
  objectives: { id: string; fr: string; en: string }[];
  unlockAfter?: string; // id d'unité qui doit être validée
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
  }
];
