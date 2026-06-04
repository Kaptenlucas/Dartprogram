import React, { useState } from "react";
import MultiplierTabs, { Multiplier } from "./MultiplierTabs";
import ScoreGrid from "./ScoreGrid";
import DartSlotDisplay from "./DartSlotDisplay";
import UndoLastDartButton from "./UndoLastDartButton";

interface Props {
  onChange: (darts: string[]) => void;
  initial?: (string | null)[];
}

const DartInputPanel: React.FC<Props> = ({ onChange, initial }) => {
  const [multiplier, setMultiplier] = useState<Multiplier>("S");
  const [darts, setDarts] = useState<(string | null)[]>(initial ?? [null, null, null]);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const nextIndex = darts.findIndex((d) => d === null);

  const handleSelect = (notation: string) => {
    if (nextIndex === -1) return;
    const updated = [...darts];
    updated[nextIndex] = notation;
    setDarts(updated);
    setSelectedCell(notation);
    onChange(updated.filter(Boolean) as string[]);
  };

  const handleUndo = () => {
    const last = darts.slice().reverse().findIndex((d) => d !== null);
    if (last === -1) return;
    const idx = 2 - last;
    const updated = [...darts];
    updated[idx] = null;
    setDarts(updated);
    onChange(updated.filter(Boolean) as string[]);
  };

  const roundScore = darts.reduce((acc, d) => {
    if (!d) return acc;
    // parse notation for quick display
    if (d === "MISS") return acc;
    if (d === "SBULL") return acc + 25;
    if (d === "DBULL") return acc + 50;
    const prefix = d[0];
    const num = parseInt(d.slice(1), 10);
    const mult = prefix === "S" ? 1 : prefix === "D" ? 2 : 3;
    return acc + mult * num;
  }, 0);

  return (
    <div className="dart-input-panel">
      <DartSlotDisplay darts={darts} />
      <div className="panel-controls">
        <MultiplierTabs value={multiplier} onChange={setMultiplier} />
        <ScoreGrid multiplier={multiplier} onSelect={handleSelect} selected={selectedCell} />
      </div>
      <div className="round-summary">
        <div>Round score: <strong>{roundScore}</strong></div>
        <UndoLastDartButton onUndo={handleUndo} disabled={darts.every((d) => d === null)} />
      </div>
    </div>
  );
};

export default DartInputPanel;
