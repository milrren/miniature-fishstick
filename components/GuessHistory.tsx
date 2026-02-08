import { GuessResult } from "@/lib/storage";

type Props = {
  guesses: GuessResult[];
};

function colorForRank(rank: number) {
  if (rank === 0) return "bg-green-600 text-white dark:bg-green-900 dark:text-green-200";
  if (rank <= 100) return "bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-200";
  if (rank <= 500) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  if (rank <= 1000) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
}

export default function GuessHistory({ guesses }: Props) {
  const sortedGuesses = [...guesses].sort((a, b) => a.rank - b.rank);
  return (
    <ul className="w-full mt-2 flex flex-col gap-2">
      {sortedGuesses.map((g, i) => (
        <li
          key={i}
          className={`flex justify-between items-center px-3 py-2 rounded-lg font-mono text-sm shadow-sm ${colorForRank(g.rank)}`}
        >
          <span className="truncate font-semibold">{g.country}</span>
          <strong className="text-base">{g.rank} km</strong>
        </li>
      ))}
    </ul>
  );
}
