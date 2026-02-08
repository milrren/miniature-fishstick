import { Country } from "./types";

/* ---------- Distância real (Haversine) ---------- */
function haversineDistance(a: Country, b: Country): number {
  const R = 6371; // raio da Terra em km

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.latlng[0] - a.latlng[0]);
  const dLon = toRad(b.latlng[1] - a.latlng[1]);

  const lat1 = toRad(a.latlng[0]);
  const lat2 = toRad(b.latlng[0]);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ---------- Bônus por fronteira ---------- */
function borderBonus(a: Country, b: Country): number {
  if (a.borders.includes(b.code)) {
    return 0.7; // 30% mais perto
  }
  return 1;
}

/* ---------- Bônus por continente ---------- */
function continentBonus(a: Country, b: Country): number {
  if (a.continent === b.continent) {
    return 0.9; // 10% mais perto
  }
  return 1;
}

/* ---------- Função pública ---------- */
export function calculateProximity(
  guess: Country,
  target: Country
): number {
  const distanceKm = haversineDistance(guess, target);

  let score = distanceKm;
  score *= continentBonus(guess, target);
  score *= borderBonus(guess, target);

  return Math.round(score);
}
