import { NextResponse } from "next/server";
import countries from "@/data/countries.json";
import { Country } from "@/lib/types";

const START_DATE = new Date("2024-01-01");

function getDayIndex(date = new Date()): number {
  return Math.floor(
    (date.getTime() - START_DATE.getTime()) / 86400000
  );
}

function generateSeed(dayIndex: number, country: Country): string {
  // Seed simples, não reversível visualmente
  const raw = `${dayIndex}-${country.code}`;
  let hash = 0;

  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(16);
}

export async function GET() {
  const allCountries = countries as Country[];

  const today = new Date();
  const dayIndex = getDayIndex(today);

  const countryIndex = dayIndex % allCountries.length;
  const countryOfTheDay = allCountries[countryIndex];

  return NextResponse.json({
    dayIndex,
    date: today.toISOString().split("T")[0],
    seed: generateSeed(dayIndex, countryOfTheDay)
  });
}
