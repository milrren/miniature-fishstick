"use client";

import { useState } from "react";

type Props = {
  onGuess: (value: string) => void;
  disabled?: boolean;
};

export default function GuessInput({ onGuess, disabled }: Props) {
  const [value, setValue] = useState("");

  function submit() {
    if (!value.trim()) return;
    onGuess(value.trim());
    setValue("");
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Digite um país"
        disabled={disabled}
        onKeyDown={e => e.key === "Enter" && submit()}
        style={{
          padding: 8,
          flex: 1,
          fontSize: 16
        }}
      />
      <button onClick={submit} disabled={disabled}>
        Enviar
      </button>
    </div>
  );
}
