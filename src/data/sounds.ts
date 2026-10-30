// Sons de l'anglais (API), avec un mot exemple, des mots d'entraînement
// et une astuce pour un francophone.
export type SoundGroup = "pieges" | "voyelles" | "consonnes";

export interface Sound {
  id: string;
  ipa: string;
  word: string;
  group: SoundGroup;
  practice: string[];
  tip: string;
}

const s = (group: SoundGroup, id: string, ipa: string, word: string, practice: string[], tip: string): Sound => ({ id, ipa, word, group, practice, tip });

export const SOUNDS: Sound[] = [
  // Pièges des francophones
  s("pieges", "th-s", "θ", "think", ["three", "thank you", "Thursday"], "Langue entre les dents, souffle sans voix. Pas « s », pas « t » : three n'est pas « tri »."),
  s("pieges", "th-v", "ð", "this", ["the", "mother", "that"], "Même position que θ, mais avec la voix qui vibre. Pas « z », pas « d »."),
  s("pieges", "h", "h", "hello", ["house", "happy", "hotel"], "Le h se prononce : un petit souffle, comme sur une vitre. hello, pas « ello »."),
  s("pieges", "i-short", "ɪ", "ship", ["sit", "fish", "big"], "i bref et relâché, presque « é ». ship (bateau) n'est pas sheep (mouton)."),
  s("pieges", "schwa", "ə", "about", ["banana", "teacher", "today"], "Le son le plus fréquent : un « e » mou et court, jamais accentué."),
  s("pieges", "uh", "ʌ", "cup", ["bus", "money", "love"], "Un « a » court au fond de la bouche, bouche à peine ouverte. cup ≈ « keup »."),
  s("pieges", "er", "ɜː", "bird", ["work", "girl", "first"], "« eu » long, lèvres neutres : work ≈ « weurk », pas « wok »."),
  s("pieges", "ng", "ŋ", "sing", ["morning", "thing", "long"], "Le g final ne s'entend pas : le son reste dans le nez. sing ≈ « sinng »."),
  s("pieges", "r", "r", "red", ["rice", "very", "car"], "La langue ne touche rien et recule un peu. Pas de r roulé ni de r de gorge."),
  // Voyelles
  s("voyelles", "ee", "iː", "sheep", ["eat", "tea", "please"], "i long et tendu, lèvres en sourire."),
  s("voyelles", "i", "ɪ", "sit", ["it", "this", "listen"], "i bref, la bouche se détend."),
  s("voyelles", "e", "e", "bed", ["yes", "ten", "friend"], "« è » court : bed, ten."),
  s("voyelles", "ae", "æ", "cat", ["bag", "man", "taxi"], "Entre « a » et « è », bouche bien ouverte."),
  s("voyelles", "ar", "ɑː", "car", ["father", "start", "market"], "« a » long et profond."),
  s("voyelles", "o", "ɒ", "hot", ["shop", "stop", "doctor"], "« o » court et ouvert (anglais britannique)."),
  s("voyelles", "or", "ɔː", "door", ["four", "talk", "water"], "« ô » long, lèvres arrondies."),
  s("voyelles", "u", "ʊ", "book", ["good", "look", "put"], "« ou » bref et relâché."),
  s("voyelles", "oo", "uː", "food", ["school", "two", "blue"], "« ou » long, lèvres en avant."),
  s("voyelles", "uh2", "ʌ", "sun", ["much", "come", "Monday"], "« a » court au fond de la bouche."),
  s("voyelles", "er2", "ɜː", "nurse", ["learn", "Thursday", "word"], "« eu » long."),
  s("voyelles", "schwa2", "ə", "sofa", ["ago", "doctor", "problem"], "« e » mou dans les syllabes faibles."),
  s("voyelles", "ay", "eɪ", "day", ["name", "eight", "train"], "« é » qui glisse vers « i » : day ≈ « dèï »."),
  s("voyelles", "eye", "aɪ", "my", ["five", "price", "nice"], "« aï » : my, five."),
  s("voyelles", "oh", "əʊ", "go", ["no", "phone", "road"], "« eu » qui glisse vers « ou » : go ≈ « geou »."),
  s("voyelles", "ow", "aʊ", "now", ["how", "house", "town"], "« aou » : now, how."),
  // Consonnes
  s("consonnes", "th-s2", "θ", "mouth", ["thin", "both", "health"], "Langue entre les dents, sans voix."),
  s("consonnes", "th-v2", "ð", "they", ["there", "brother", "with"], "Langue entre les dents, avec la voix."),
  s("consonnes", "h2", "h", "how", ["hand", "help", "behind"], "Un souffle léger avant la voyelle."),
  s("consonnes", "w", "w", "water", ["want", "one", "when"], "« ou » rapide, lèvres en rond."),
  s("consonnes", "j", "j", "yes", ["you", "yellow", "year"], "« y » de « yeux »."),
  s("consonnes", "r2", "r", "right", ["road", "sorry", "price"], "Langue en arrière, sans toucher le palais."),
  s("consonnes", "ng2", "ŋ", "king", ["bring", "evening", "English"], "Son dans le nez, sans « g » final."),
  s("consonnes", "sh", "ʃ", "she", ["shop", "fish", "station"], "« ch » de « chat »."),
  s("consonnes", "ch", "tʃ", "chair", ["cheap", "much", "kitchen"], "« tch » : chair ≈ « tchèr »."),
  s("consonnes", "dj", "dʒ", "job", ["juice", "age", "bridge"], "« dj » : job ≈ « djob »."),
  s("consonnes", "zh", "ʒ", "usually", ["television", "measure", "decision"], "« j » de « jour »."),
  s("consonnes", "v", "v", "very", ["visit", "seven", "have"], "Dents sur la lèvre du bas, avec la voix : very n'est pas « berry »."),
  s("consonnes", "p", "p", "pen", ["price", "people", "pay"], "p avec un petit souffle au début du mot."),
  s("consonnes", "t", "t", "ten", ["time", "tea", "taxi"], "t avec un petit souffle, langue derrière les dents du haut.")
];

export const GROUPS: [SoundGroup, string][] = [
  ["pieges", "Pièges FR"],
  ["voyelles", "Voyelles"],
  ["consonnes", "Consonnes"]
];

// Les 3 premiers sons de chaque onglet sont ouverts ; les suivants
// s'ouvrent quand le précédent atteint 60/100.
export const UNLOCK_SCORE = 60;
export const MASTERED = 70;

export function soundOpen(mastery: Record<string, number>, sound: Sound): boolean {
  const list = SOUNDS.filter(x => x.group === sound.group);
  const i = list.indexOf(sound);
  return i < 3 || (mastery[list[i - 1].id] ?? 0) >= UNLOCK_SCORE;
}

// Son de la semaine : un piège des francophones, qui change chaque lundi.
export function soundOfWeek(week: number): Sound {
  const list = SOUNDS.filter(x => x.group === "pieges");
  return list[((week % list.length) + list.length) % list.length];
}
