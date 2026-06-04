import React from "react";

export type Multiplier = "S" | "D" | "T";

interface Props {
  value: Multiplier;
  onChange: (m: Multiplier) => void;
}

const MultiplierTabs: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="multiplier-tabs">
      {(["S", "D", "T"] as Multiplier[]).map((m) => (
        <button
          key={m}
          className={`tab ${value === m ? "active" : ""}`}
          onClick={() => onChange(m)}
        >
          {m === "S" ? "Single" : m === "D" ? "Double" : "Treble"}
        </button>
      ))}
    </div>
  );
};

export default MultiplierTabs;
