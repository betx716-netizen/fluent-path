// Jour local (numéro de jour depuis 1970 dans le fuseau du téléphone).
// La série de jours reste juste même si l'utilisateur voyage.
export function today(now = new Date()): number {
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000);
}

export function dayLabel(day: number): string {
  const d = new Date(day * 86400000);
  return ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"][d.getUTCDay()];
}

// Semaine qui commence le lundi (le jour 0, 1er janvier 1970, était un jeudi).
export const weekOf = (day: number) => Math.floor((day + 3) / 7);
export const weekStart = (week: number) => week * 7 - 3;

// Heure locale (en ms) du lundi minuit qui termine la semaine.
export function weekEndsAt(week: number, now = new Date()): number {
  return weekStart(week + 1) * 86400000 + now.getTimezoneOffset() * 60000;
}
