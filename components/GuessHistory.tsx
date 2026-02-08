import { GuessResult } from "@/lib/storage";

type Props = {
  guesses: GuessResult[];
};

function colorForRank(rank: number) {
  if (rank === 0) return "green";
  if (rank <= 5) return "#4caf50";
  if (rank <= 20) return "#ffc107";
  if (rank <= 50) return "#ff9800";
  return "#f44336";
}

export default function GuessHistory({ guesses }: Props) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {guesses.map((g, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            color: colorForRank(g.rank)
          }}
        >
          <span>{g.country}</span>
          <strong>{g.rank}</strong>
        </li>
      ))}
    </ul>
  );
}
