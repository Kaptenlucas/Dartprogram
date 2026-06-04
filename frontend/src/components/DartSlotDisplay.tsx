import React from "react";

interface Props {
  darts: (string | null)[];
}

const DartSlotDisplay: React.FC<Props> = ({ darts }) => {
  return (
    <div className="dart-slots">
      {darts.map((d, i) => (
        <div key={i} className={`dart-slot ${d ? "filled" : "empty"}`}>
          {d ?? "---"}
        </div>
      ))}
    </div>
  );
};

export default DartSlotDisplay;
