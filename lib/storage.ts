export type GuessResult = {
  country: string;
  rank: number;
};

const GUESSES_KEY = "guesses";
const DAY_KEY = "dayIndex";
const WON_KEY = "won";

export function loadGuesses(): GuessResult[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(GUESSES_KEY) || "[]");
}

export function saveGuesses(guesses: GuessResult[]) {
  localStorage.setItem(GUESSES_KEY, JSON.stringify(guesses));
}

export function clearGame(dayIndex: number) {
  localStorage.clear();
  localStorage.setItem(DAY_KEY, String(dayIndex));
}

export function hasWon(): boolean {
  return localStorage.getItem(WON_KEY) === "true";
}

export function setWon() {
  localStorage.setItem(WON_KEY, "true");
}
