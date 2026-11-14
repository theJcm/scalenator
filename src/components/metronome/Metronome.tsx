import { useState } from "react";

import {
  useMetronome,
  TIME_SIGNATURES,
  MIN_BPM,
  MAX_BPM,
  type TimeSignature,
} from "../../hooks/useMetronome";

function clampBpm(value: number) {
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));
}

export default function Metronome() {
  const { bpm, setBpm, signature, setSignature, running, toggle, currentBeat } =
    useMetronome();

  // Texto editable del campo BPM; se valida al salir del campo
  const [draft, setDraft] = useState<string | null>(null);

  function commitDraft() {
    if (draft !== null) {
      const parsed = Number(draft);
      if (draft.trim() !== "" && Number.isFinite(parsed)) {
        setBpm(clampBpm(parsed));
      }
      setDraft(null);
    }
  }

  const { accents } = TIME_SIGNATURES[signature];

  return (
    <section className="metronome-section">
      <div className="metronome-heading">
        <h3>Metrónomo</h3>
        <span>{running ? "Activo" : "Detenido"}</span>
      </div>

      <div className="metronome-body">
        <button
          type="button"
          className={`metronome-toggle${running ? " active" : ""}`}
          onClick={toggle}
          aria-pressed={running}
        >
          {running ? "Desactivar" : "Activar"}
        </button>

        <div className="control metronome-bpm">
          <label htmlFor="bpm-input">BPM</label>
          <div className="range-row">
            <input
              id="bpm-input"
              className="bpm-input"
              type="number"
              inputMode="numeric"
              min={MIN_BPM}
              max={MAX_BPM}
              value={draft ?? bpm}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitDraft}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitDraft();
              }}
            />
            <input
              className="bpm-slider"
              type="range"
              aria-label="BPM"
              min={MIN_BPM}
              max={MAX_BPM}
              value={bpm}
              onChange={(e) => {
                setDraft(null);
                setBpm(Number(e.target.value));
              }}
            />
          </div>
        </div>

        <div className="control metronome-signature">
          <label htmlFor="signature-select">Compás</label>
          <select
            id="signature-select"
            value={signature}
            onChange={(e) => setSignature(e.target.value as TimeSignature)}
          >
            {Object.keys(TIME_SIGNATURES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="beat-indicator" aria-hidden="true">
          {accents.map((level, index) => (
            <i
              key={index}
              className={`beat-dot${level === 2 ? " strong" : ""}${
                index === currentBeat ? " on" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
