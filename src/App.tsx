import { useState } from "react";

import Fretboard from "./components/fretboard/Fretboard";

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

function App() {
  const [root, setRoot] = useState(0);

  const [category, setCategory] = useState<StructureCategory>("scales");

  const [structure, setStructure] = useState("major");

  const [instrument, setInstrument] = useState<InstrumentType>("guitar");

  const [notation, setNotation] = useState<Notation>("english");

  const [frets, setFrets] = useState(24);

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

  function handleCategoryChange(value: StructureCategory) {
    setCategory(value);
    setStructure(Object.keys(STRUCTURES[value])[0]);
  }

  function handleInstrumentChange(value: InstrumentType) {
    setInstrument(value);
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
              onChange={(e) => setRoot(Number(e.target.value))}
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
              onChange={(e) => setStructure(e.target.value)}
            >
              {Object.entries(STRUCTURES[category]).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control">
            <label>Trastes (máx. {selectedInstrument.maxFrets})</label>
            <select
              value={frets}
              onChange={(e) => setFrets(Number(e.target.value))}
            >
              {Array.from(
                { length: selectedInstrument.maxFrets },
                (_, index) => index + 1,
              ).map((fret) => (
                <option key={fret} value={fret}>
                  {fret}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="fretboard-section">
          <div className="section-heading">
            <div>
              <h2>
                {noteNames[root]} {selectedStructure.name}
              </h2>
              <p>
                {selectedInstrument.name} · {frets} trastes
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
            frets={frets}
          />
        </section>

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
