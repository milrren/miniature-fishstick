import { Country } from "./types";

const START_DATE = new Date("2024-01-01");

export function getCountryOfTheDay(countries: Country[]): Country {
  const today = new Date();
  const diffDays = Math.floor(
    (today.getTime() - START_DATE.getTime()) / 86400000
  );

  const index = diffDays % countries.length;
  return countries[index];
}
