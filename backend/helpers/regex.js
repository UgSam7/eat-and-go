// Neutralizza i caratteri speciali delle regex nell'input utente (evita ReDoS/injection).
export const escapeRegex = (value) =>
  String(value).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
