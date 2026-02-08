import { NextResponse } from "next/server";
import countries from "@/data/countries.json";
import { Country } from "@/lib/types";
import { calculateProximity } from "@/lib/proximity";
import { getCountryOfTheDay } from "@/lib/countryOfTheDay";

type GuessRequest = {
  guess: string;
};

export async function POST(req: Request) {
  let body: GuessRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body.guess || typeof body.guess !== "string") {
    return NextResponse.json(
      { error: "Guess is required" },
      { status: 400 }
    );
  }

  const normalizedGuess = body.guess.trim().toLowerCase();

  const allCountries = countries as Country[];

  const guessedCountry = allCountries.find(c =>
    c.name.toLowerCase() === normalizedGuess
  );

  if (!guessedCountry) {
    return NextResponse.json(
      { error: "Country not found" },
      { status: 404 }
    );
  }

  const targetCountry = getCountryOfTheDay(allCountries);

  const proximity = calculateProximity(
    guessedCountry,
    targetCountry,
    allCountries
  );

  return NextResponse.json({
    rank: proximity,
    isCorrect: guessedCountry.code === targetCountry.code
  });
}
