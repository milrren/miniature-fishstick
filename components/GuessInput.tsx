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
    <form
      className="w-full flex flex-col sm:flex-row gap-2 items-stretch"
      autoComplete="off"
      onSubmit={e => {
        e.preventDefault();
        submit();
      }}
    >
      <input
        list="countries-list"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={loading ? "Carregando países..." : "Digite um país"}
        disabled={disabled || loading}
        className="flex-1 input"
      />

      <datalist id="countries-list">
        {countries.map(country => (
          <option key={country} value={country} />
        ))}
      </datalist>

      <button
        type="submit"
        onClick={submit}
        disabled={disabled || loading}
        className="btn btn-primary w-full sm:w-auto"
      >
        Enviar
      </button>
    </form>
  );
}
