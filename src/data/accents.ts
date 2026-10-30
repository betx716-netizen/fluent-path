import type { Voice } from "./scenarios";

export interface AccentInfo {
  voice: Voice;
  name: string;
  where: string;
  traits: string[];
}

export const ACCENTS: AccentInfo[] = [
  {
    voice: "en-US",
    name: "Américain",
    where: "États-Unis, films, Internet",
    traits: [
      "Le r se prononce toujours : car ≈ « kar ».",
      "Le t entre deux voyelles devient un d léger : water ≈ « wadeur ».",
      "dance et cat ont le même « a » ouvert."
    ]
  },
  {
    voice: "en-GB",
    name: "Britannique",
    where: "Royaume-Uni, BBC, beaucoup de manuels",
    traits: [
      "Le r à la fin d'un mot est muet : car ≈ « kâ ».",
      "Le t est bien net : water ≈ « wô-teu ».",
      "bath, dance, can't : « a » long et profond."
    ]
  },
  {
    voice: "en-NG",
    name: "Nigérian",
    where: "Nigeria, le plus grand pays anglophone d'Afrique",
    traits: [
      "Rythme régulier : chaque syllabe a presque le même poids.",
      "th devient souvent t ou d : three ≈ « tri », this ≈ « dis ».",
      "Voyelles nettes et pleines, proches du français."
    ]
  },
  {
    voice: "en-GH",
    name: "Ghanéen",
    where: "Ghana, voisin direct du Togo",
    traits: [
      "Proche du britannique : r final souvent muet.",
      "Mélodie montante et descendante bien marquée.",
      "Mots bien détachés, débit souvent plus lent."
    ]
  },
  {
    voice: "en-IN",
    name: "Indien",
    where: "Inde, fournisseurs et commerce international",
    traits: [
      "t et d prononcés avec la langue recourbée.",
      "v et w sont souvent proches : very ≈ « wery ».",
      "Rythme syllabique rapide, accent sur des syllabes inattendues."
    ]
  },
  {
    voice: "en-ZA",
    name: "Sud-africain",
    where: "Afrique du Sud, ports et compagnies maritimes",
    traits: [
      "Le r final est muet, comme au Royaume-Uni.",
      "Le « i » de kit est très court : « kət ».",
      "yes ≈ « yis » : voyelles un peu fermées."
    ]
  }
];

export const PHRASES: { en: string; fr: string }[] = [
  { en: "The container arrives at the port on Monday.", fr: "Le conteneur arrive au port lundi." },
  { en: "How much is it for three hundred bags?", fr: "Combien pour trois cents sacs ?" },
  { en: "Can you send me the invoice, please?", fr: "Pouvez-vous m'envoyer la facture, s'il vous plaît ?" },
  { en: "The shipment is stuck at customs.", fr: "L'expédition est bloquée en douane." },
  { en: "We can give you a ten percent discount.", fr: "Nous pouvons vous faire une remise de dix pour cent." },
  { en: "I'd like a bottle of water and a cup of tea.", fr: "Je voudrais une bouteille d'eau et une tasse de thé." },
  { en: "Thank you for your order. See you on Thursday.", fr: "Merci pour votre commande. À jeudi." }
];

// Paires minimales : les sons qui piègent les francophones.
export const PAIRS: { a: string; b: string; sound: string; tip: string }[] = [
  { a: "ship", b: "sheep", sound: "i court / i long", tip: "ship : i bref et relâché. sheep : i long et tendu, comme un sourire." },
  { a: "live", b: "leave", sound: "i court / i long", tip: "live : i bref. leave : i long." },
  { a: "full", b: "fool", sound: "ou court / ou long", tip: "full : ou bref. fool : ou long." },
  { a: "cat", b: "cut", sound: "a ouvert / e sourd", tip: "cat : bouche grande ouverte. cut : son neutre, presque « eu »." },
  { a: "think", b: "sink", sound: "th / s", tip: "th : la langue entre les dents, on souffle." },
  { a: "three", b: "tree", sound: "th / t", tip: "three : langue entre les dents. tree : t normal." },
  { a: "they", b: "day", sound: "th sonore / d", tip: "they : langue entre les dents, la gorge vibre." },
  { a: "hat", b: "at", sound: "h aspiré", tip: "En anglais, le h se souffle : hat ≈ « hhat »." },
  { a: "heat", b: "eat", sound: "h aspiré", tip: "heat : on souffle avant la voyelle." },
  { a: "very", b: "berry", sound: "v / b", tip: "very : dents du haut sur la lèvre du bas." },
  { a: "work", b: "walk", sound: "er / or", tip: "work : son « eu » long. walk : « o » ouvert, le l est muet." },
  { a: "bag", b: "back", sound: "g / k final", tip: "bag : finit en g, la voyelle est plus longue. back : finit en k." }
];
