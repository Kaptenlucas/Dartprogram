import React from "react";

interface Props {
  onUndo: () => void;
  disabled?: boolean;
}

const UndoLastDartButton: React.FC<Props> = ({ onUndo, disabled }) => {
  return (
    <button className="button secondary undo-dart" onClick={onUndo} disabled={disabled}>
      Undo Last Dart
    </button>
  );
};

export default UndoLastDartButton;
