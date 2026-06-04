import React from "react";
import { Multiplier } from "./MultiplierTabs";

interface Props {
  multiplier: Multiplier;
  onSelect: (notation: string) => void;
  selected?: string | null;
}

const buildOptions = (mult: Multiplier): string[] => {
  const nums = Array.from({ length: 20 }, (_, i) => i + 1);
  if (mult === "S") {
    const singles = nums.map((n) => `S${n}`);
    return [...singles, "SBULL", "DBULL", "MISS"];
  }
  if (mult === "D") {
    return nums.map((n) => `D${n}`).concat(["DBULL"]);
  }
  return nums.map((n) => `T${n}`);
};

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const ScoreGrid: React.FC<Props> = ({ multiplier, onSelect, selected }) => {
  const options = buildOptions(multiplier);

  // Layout 5 columns x 4 rows for numbers 1-20 (20 items). Others shown below.
  const numberOnly = options.filter((o) => /^([SDT])\d+$/.test(o)).slice(0, 20);
  const gridRows = chunk(numberOnly, 5);

  return (
    <div className="score-grid">
      {gridRows.map((row, rIdx) => (
        <div className="grid-row" key={rIdx}>
          {row.map((cell) => (
            <button
              key={cell}
              className={`grid-cell ${selected === cell ? "selected" : ""}`}
              onClick={() => onSelect(cell)}
            >
              {cell.replace(/^[SDT]/, "")}
            </button>
          ))}
        </div>
      ))}

      <div className="grid-row extra-row">
        {multiplier === "S" && (
          <>
            <button className={`grid-cell ${selected === "SBULL" ? "selected" : ""}`} onClick={() => onSelect("SBULL")}>
              SB
            </button>
            <button className={`grid-cell ${selected === "DBULL" ? "selected" : ""}`} onClick={() => onSelect("DBULL")}>
              DB
            </button>
            <button className={`grid-cell ${selected === "MISS" ? "selected" : ""}`} onClick={() => onSelect("MISS")}>
              MISS
            </button>
          </>
        )}

        {multiplier === "D" && (
          <>
            <div className="grid-spacer" />
            <button className={`grid-cell ${selected === "DBULL" ? "selected" : ""}`} onClick={() => onSelect("DBULL")}>
              DB
            </button>
            <div className="grid-spacer" />
          </>
        )}

        {multiplier === "T" && <div className="grid-spacer" />}
      </div>
    </div>
  );
};

export default ScoreGrid;
