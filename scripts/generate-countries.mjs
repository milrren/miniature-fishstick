import fs from "fs";

const URL =
  "https://restcountries.com/v3.1/all" +
  "?fields=name,cca2,borders,continents,translations";

const res = await fetch(URL, {
  headers: {
    "User-Agent": "miniature-fishstick/1.0 (dev script)",
    "Accept": "application/json"
  }
});

if (!res.ok) {
  const text = await res.text();
  throw new Error(
    `REST Countries API error: ${res.status} ${res.statusText}\n${text}`
  );
}

const data = await res.json();

if (!Array.isArray(data)) {
  throw new Error("Unexpected API response: expected an array");
}

function normalizeAlias(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();
}

const countries = data
  .filter(c => c.cca2 && c.name?.common)
  .map(c => {
    const aliases = new Set();

    // Nome principal (EN)
    aliases.add(c.name.common);

    // Nome em PT-BR
    if (c.translations?.por?.common) {
      aliases.add(c.translations.por.common);
    }

    // ISO Alpha-2
    aliases.add(c.cca2);

    // Nome normalizado (sem acento)
    aliases.add(normalizeAlias(c.name.common));

    return {
      code: c.cca2,
      name: c.name.common,
      aliases: Array.from(aliases),
      continent: c.continents?.[0] ?? "Other",
      borders: c.borders ?? []
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(
  "data/countries.json",
  JSON.stringify(countries, null, 2),
  "utf-8"
);

console.log(`✔ countries.json gerado (${countries.length} países)`);
