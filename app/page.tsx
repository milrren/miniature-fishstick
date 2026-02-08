"use client";

import { useEffect, useState } from "react";
import GuessInput from "@/components/GuessInput";
import GuessHistory from "@/components/GuessHistory";
import {
  loadGuesses,
  saveGuesses,
  clearGame,
  hasWon,
  setWon,
  GuessResult
} from "@/lib/storage";

export default function Home() {
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [won, setGameWon] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/daily-country");
      const data = await res.json();

      const storedDay = localStorage.getItem("dayIndex");

      if (storedDay !== String(data.dayIndex)) {
        clearGame(data.dayIndex);
      }

      setGuesses(loadGuesses());
      setGameWon(hasWon());
      setLoading(false);
    }

    init();
  }, []);

  async function submitGuess(country: string) {
    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess: country })
    });

    const data = await res.json();

    const next = [
      ...guesses,
      { country, rank: data.rank }
    ];

    setGuesses(next);
    saveGuesses(next);

    if (data.isCorrect) {
      setWon();
      setGameWon(true);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg animate-pulse">Carregando…</p>
      </div>
    );

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4"
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col items-center gap-6 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-2">🌍 País do Dia</h1>
        {!won ? (
          <GuessInput onGuess={submitGuess} />
        ) : (
          <div className="w-full text-center bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200 rounded-lg py-3 font-semibold text-lg">
            🎉 Você acertou em <strong className="font-bold">{guesses.length}</strong> tentativas!
          </div>
        )}
        <GuessHistory guesses={guesses} />
        <footer className="w-full text-xs text-zinc-500 dark:text-zinc-400 mt-4 text-center">
          <span>Inspirado por jogos como Wordle, Contexto, Goble e outros.</span>
        </footer>
      </div>
    </main>
  );
}
