"use client";

import { useState } from "react";
import { useCountries } from "@/lib/useCountries";

type Props = {
  onGuess: (value: string) => void;
  disabled?: boolean;
};

export default function GuessInput({ onGuess, disabled }: Props) {
  const [value, setValue] = useState("");
  const { countries, loading } = useCountries();

  function submit() {
    if (!value.trim()) return;
    onGuess(value.trim());
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // ENTER continua funcionando
    if (e.key === "Enter") {
      submit();
      return;
    }

    // TAB → autocomplete manual
    if (e.key === "Tab") {
      if (!value.trim()) return;

      const match = countries.find(country =>
        country.toLowerCase().startsWith(value.toLowerCase())
      );

      if (match) {
        e.preventDefault(); // impede troca de foco
        setValue(match);
      }
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        list="countries-list"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          loading ? "Carregando países..." : "Digite um país"
        }
        disabled={disabled || loading}
        style={{
          padding: 8,
          flex: 1,
          fontSize: 16
        }}
      />

      <datalist id="countries-list">
        {countries.map(country => (
          <option key={country} value={country} />
        ))}
      </datalist>

      <button onClick={submit} disabled={disabled || loading}>
        Enviar
      </button>
    </div>
  );
}
