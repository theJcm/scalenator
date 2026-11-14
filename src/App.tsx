import { useState } from "react";

import Fretboard from "./components/fretboard/Fretboard";
import Metronome from "./components/metronome/Metronome";

import {
  NOTES,
  STRUCTURES,
  INSTRUMENTS,
  type StructureCategory,
  type InstrumentType,
} from "./data/scales";

import {
  getStructureNotes,
  getScaleDegreesAndChords,
  getDegreeInfo,
} from "./utils/music";

type Notation = "english" | "latin";
type DisplayMode = "notes" | "intervals";
type Orientation = "horizontal" | "vertical";

function App() {
  const [root, setRoot] = useState(0);

  const [category, setCategory] = useState<StructureCategory>("scales");

  const [structure, setStructure] = useState("major");

  const [instrument, setInstrument] = useState<InstrumentType>("guitar");

  const [notation, setNotation] = useState<Notation>("english");

  const [display, setDisplay] = useState<DisplayMode>("notes");

  const [orientation, setOrientation] = useState<Orientation>("horizontal");

  const [startFret, setStartFret] = useState(1);

  const [frets, setFrets] = useState(24);

  const [toggled, setToggled] = useState<Set<string>>(new Set());

  const selectedInstrument = INSTRUMENTS[instrument];

  const selectedStructure =
    STRUCTURES[category][
      structure as keyof (typeof STRUCTURES)[typeof category]
    ];

  const intervals = selectedStructure.intervals;

  const notes = getStructureNotes(root, category, structure);

  const degrees =
    category === "scales"
      ? getScaleDegreesAndChords(root, intervals, notation)
      : [];

  const noteNames =
    notation === "english"
      ? NOTES
      : [
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si",
        ];

  const noteItems = intervals.map((interval, index) => ({
    ...getDegreeInfo(interval),
    note: noteNames[notes[index]],
  }));

  function handleToggle(key: string) {
    setToggled((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  }

  function resetFretboard() {
    setToggled(new Set());
  }

  function handleRootChange(value: number) {
    setRoot(value);
    resetFretboard();
  }

  function handleStructureChange(value: string) {
    setStructure(value);
    resetFretboard();
  }

  function handleCategoryChange(value: StructureCategory) {
    resetFretboard();
    setCategory(value);
    setStructure(Object.keys(STRUCTURES[value])[0]);
  }

  function handleInstrumentChange(value: InstrumentType) {
    setInstrument(value);
    resetFretboard();
    setStartFret(1);
    setFrets(INSTRUMENTS[value].maxFrets);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          scalenator<span>.</span>
        </div>

        <div className="header-description">Jairo Chavarria</div>
      </header>

      <main className="workspace">
        <section className="controls">
          <div className="control">
            <label>Instrumento</label>
            <select
              value={instrument}
              onChange={(e) =>
                handleInstrumentChange(e.target.value as InstrumentType)
              }
            >
              {Object.entries(INSTRUMENTS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control">
            <label>Notación</label>
            <select
              value={notation}
              onChange={(e) => setNotation(e.target.value as Notation)}
            >
              <option value="english">Anglosajona</option>
              <option value="latin">Latinoamericana</option>
            </select>
          </div>

          <div className="control">
            <label>Tonalidad</label>
            <select
              value={root}
              onChange={(e) => handleRootChange(Number(e.target.value))}
            >
              {NOTES.map((note, index) => (
                <option key={note} value={index}>
                  {noteNames[index]}
                </option>
              ))}
            </select>
          </div>

          <div className="control">
            <label>Tipo</label>
            <select
              value={category}
              onChange={(e) =>
                handleCategoryChange(e.target.value as StructureCategory)
              }
            >
              <option value="scales">Escalas</option>
              <option value="arpeggios">Arpegios</option>
            </select>
          </div>

          <div className="control">
            <label>{category === "scales" ? "Escala" : "Arpegio"}</label>
            <select
              value={structure}
              onChange={(e) => handleStructureChange(e.target.value)}
            >
              {Object.entries(STRUCTURES[category]).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control">
            <label id="display-label">Mostrar</label>
            <div
              className="radio-group"
              role="radiogroup"
              aria-labelledby="display-label"
            >
              {(
                [
                  ["notes", "Notas"],
                  ["intervals", "Intervalo"],
                ] as const
              ).map(([value, text]) => (
                <label
                  key={value}
                  className={`radio-option${display === value ? " active" : ""}`}
                >
                  <input
                    type="radio"
                    name="display"
                    value={value}
                    checked={display === value}
                    onChange={() => setDisplay(value)}
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="control">
            <label id="orientation-label">Orientación</label>
            <div
              className="radio-group"
              role="radiogroup"
              aria-labelledby="orientation-label"
            >
              {(
                [
                  ["horizontal", "Horizontal"],
                  ["vertical", "Vertical"],
                ] as const
              ).map(([value, text]) => (
                <label
                  key={value}
                  className={`radio-option${orientation === value ? " active" : ""}`}
                >
                  <input
                    type="radio"
                    name="orientation"
                    value={value}
                    checked={orientation === value}
                    onChange={() => setOrientation(value)}
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="control">
            <label>Mástil</label>
            <button
              type="button"
              className="reset-button"
              onClick={resetFretboard}
              disabled={toggled.size === 0}
            >
              Reiniciar
            </button>
          </div>

          <div className="control">
            <label>Trastes (máx. {selectedInstrument.maxFrets})</label>
            <div className="range-row">
              <select
                aria-label="Traste inicial"
                value={startFret}
                onChange={(e) => setStartFret(Number(e.target.value))}
              >
                {Array.from({ length: frets }, (_, index) => index + 1).map(
                  (fret) => (
                    <option key={fret} value={fret}>
                      {fret}
                    </option>
                  ),
                )}
              </select>

              <span className="range-separator">–</span>

              <select
                aria-label="Traste final"
                value={frets}
                onChange={(e) => setFrets(Number(e.target.value))}
              >
                {Array.from(
                  { length: selectedInstrument.maxFrets - startFret + 1 },
                  (_, index) => startFret + index,
                ).map((fret) => (
                  <option key={fret} value={fret}>
                    {fret}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="fretboard-section">
          <div className="section-heading">
            <div>
              <h2>
                {noteNames[root]} {selectedStructure.name}
              </h2>
              <p>
                {selectedInstrument.name} · trastes {startFret}–{frets}
              </p>
            </div>

            <div className="legend">
              <span>
                <i className="root-dot" /> Tónica
              </span>
              <span>
                <i className="note-dot" /> Otras notas
              </span>
            </div>
          </div>

          <Fretboard
            root={root}
            intervals={intervals}
            strings={selectedInstrument.strings}
            notation={notation}
            display={display}
            orientation={orientation}
            startFret={startFret}
            endFret={frets}
            toggled={toggled}
            onToggle={handleToggle}
          />
        </section>

        <Metronome />

        <section className="notes-section">
          <div className="notes-block">
            <h3>Notas y funciones musicales</h3>

            <div className="degree-legend">
              {noteItems.map((item, index) => (
                <div className="degree-legend-item" key={index}>
                  <span
                    className="degree-color"
                    style={{ backgroundColor: item.color }}
                  />

                  <div className="degree-legend-info">
                    <strong>{item.note}</strong>
                    <span>
                      {item.degree} · {item.functionName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="formula">
            <h3>Intervalos</h3>
            <p>{intervals.join(" · ")}</p>
          </div>
        </section>

        {category === "scales" && (
          <section className="degrees-section">
            <div className="degrees-heading">
              <h3>Grados y acordes de la escala</h3>
              <span>{degrees.length} grados</span>
            </div>

            <div className="degrees-grid">
              {degrees.map((item, index) => (
                <div
                  className="degree-card"
                  key={index}
                  style={{
                    borderTop: `3px solid ${item.color}`,
                  }}
                >
                  <span className="degree-number">
                    {item.degree} · {item.functionName}
                  </span>

                  <strong style={{ color: item.color }}>{item.chord}</strong>

                  <span className="degree-notes">
                    {item.chordNotes.join(" · ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
