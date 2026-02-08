import { Country } from "./types";

/* ---------- BFS por fronteiras ---------- */
function borderDistance(
  from: Country,
  to: Country,
  countriesByCode: Map<string, Country>
): number {
  if (from.code === to.code) return 0;

  const visited = new Set<string>();
  const queue: Array<{ code: string; dist: number }> = [
    { code: from.code, dist: 0 }
  ];

  visited.add(from.code);

  while (queue.length > 0) {
    const { code, dist } = queue.shift()!;
    const country = countriesByCode.get(code);
    if (!country) continue;

    for (const neighbor of country.borders) {
      if (neighbor === to.code) {
        return dist + 1;
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ code: neighbor, dist: dist + 1 });
      }
    }
  }

  // Países sem fronteira terrestre (ilhas)
  return Infinity;
}

/* ---------- Normalização ---------- */
function normalizeDistance(dist: number): number {
  if (dist === 0) return 0;
  if (dist === 1) return 1;
  if (dist === 2) return 5;
  if (dist === 3) return 10;
  if (dist === 4) return 20;
  if (dist === 5) return 35;
  if (dist === 6) return 50;
  return 70;
}

/* ---------- Penalidade por continente ---------- */
function continentPenalty(a: Country, b: Country): number {
  if (a.continent === b.continent) return 0;

  const close = new Set([
    "Europe-Asia",
    "Asia-Europe",
  ]);

  const key = `${a.continent}-${b.continent}`;
  if (close.has(key)) return 10;

  return 30;
}

/* ---------- Função pública ---------- */
export function calculateProximity(
  guess: Country,
  target: Country,
  countries: Country[]
): number {
  const map = new Map(countries.map(c => [c.code, c]));

  const borderDist = borderDistance(guess, target, map);
  let score = normalizeDistance(borderDist);

  score += continentPenalty(guess, target);

  return Math.min(score, 100);
}
