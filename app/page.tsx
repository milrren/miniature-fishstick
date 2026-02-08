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

  if (loading) return <p>Carregando…</p>;

  return (
    <main style={{ maxWidth: 480, margin: "40px auto" }}>
      <h1>🌍 País do Dia</h1>

      {!won ? (
        <GuessInput onGuess={submitGuess} />
      ) : (
        <p>
          🎉 Você acertou em <strong>{guesses.length}</strong>{" "}
          tentativas!
        </p>
      )}

      <GuessHistory guesses={guesses} />
    </main>
  );
}
