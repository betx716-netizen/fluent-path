// Jour local (numéro de jour depuis 1970 dans le fuseau du téléphone).
// La série de jours reste juste même si l'utilisateur voyage.
export function today(now = new Date()): number {
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000);
}

export function dayLabel(day: number): string {
  const d = new Date(day * 86400000);
  return ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"][d.getUTCDay()];
}
