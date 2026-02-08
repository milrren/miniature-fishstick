import { NextResponse } from "next/server";
import countries from "@/data/countries.json";
import { Country } from "@/lib/types";

export async function GET() {
  const allCountries = countries as Country[];

  return NextResponse.json(
    allCountries.map(c => c.aliases[0])
  );
}
