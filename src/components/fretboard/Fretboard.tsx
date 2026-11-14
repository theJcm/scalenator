import {
  getNoteName,
  getDegreeInfo,
  getIntervalLabel,
} from "../../utils/music";

interface FretboardProps {
  root: number;
  intervals: readonly number[];
  strings: readonly {
    name: string;
    pitch: number;
  }[];
  notation: "english" | "latin";
  display?: "notes" | "intervals";
  orientation?: "horizontal" | "vertical";
  startFret?: number;
  endFret?: number;
  toggled: ReadonlySet<string>;
  onToggle: (key: string) => void;
}

const WIDTH = 1200;
const HEIGHT = 420;

const START_X = 100;
const END_X = 1160;
const TOP_Y = 75;
const BOTTOM_Y = 345;

// Posición X de la línea del traste `fret`; la línea izquierda es `firstLine`.
function getFretX(fret: number, firstLine: number, lastLine: number) {
  const length = END_X - START_X;

  return START_X + (length * (fret - firstLine)) / (lastLine - firstLine);
}

export default function Fretboard({
  root,
  intervals,
  strings,
  notation,
  display = "notes",
  orientation = "horizontal",
  startFret = 1,
  endFret = 24,
  toggled,
  onToggle,
}: FretboardProps) {
  const stringSpacing =
    strings.length > 1 ? (BOTTOM_Y - TOP_Y) / (strings.length - 1) : 0;

  const vertical = orientation === "vertical";

  // `along` va a lo largo del mástil (trastes), `across` a lo ancho (cuerdas).
  // En vertical se intercambian los ejes: el nut queda arriba.
  const pt = (along: number, across: number) =>
    vertical ? { x: across, y: along } : { x: along, y: across };

  // En vertical la cuerda más grave queda a la izquierda
  const stringAcross = (index: number) =>
    TOP_Y + (vertical ? strings.length - 1 - index : index) * stringSpacing;

  const firstLine = startFret - 1;
  const fretX = (fret: number) => getFretX(fret, firstLine, endFret);

  // Rango de trastes visibles: la cuerda al aire (0) solo con el rango desde 1
  const visibleFrets = Array.from(
    { length: endFret - startFret + 1 },
    (_, i) => startFret + i,
  );
  if (startFret === 1) visibleFrets.unshift(0);

  const markers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

  return (
    <div className="fretboard-wrapper">
      <svg
        viewBox={vertical ? `0 0 ${HEIGHT} ${WIDTH}` : `0 0 ${WIDTH} ${HEIGHT}`}
        className={`fretboard${vertical ? " fretboard-vertical" : ""}`}
        role="img"
        aria-label="Diapasón musical"
      >
        <defs>
          <linearGradient
            id="boardGradient"
            x1="0"
            y1="0"
            x2={vertical ? 1 : 0}
            y2={vertical ? 0 : 1}
          >
            <stop offset="0%" stopColor="#242936" />
            <stop offset="50%" stopColor="#1B202B" />
            <stop offset="100%" stopColor="#242936" />
          </linearGradient>

          <linearGradient id="fretGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#596273" />
            <stop offset="50%" stopColor="#AAB3C1" />
            <stop offset="100%" stopColor="#596273" />
          </linearGradient>
        </defs>

        {/* Diapasón */}
        <rect
          x={pt(START_X, TOP_Y - 28).x}
          y={pt(START_X, TOP_Y - 28).y}
          width={vertical ? BOTTOM_Y - TOP_Y + 56 : END_X - START_X}
          height={vertical ? END_X - START_X : BOTTOM_Y - TOP_Y + 56}
          rx="12"
          fill="url(#boardGradient)"
          stroke="#f8f8f3"
          strokeWidth="1"
        />

        {/* Marcadores */}
        {markers.map((fret) => {
          if (fret < startFret || fret > endFret) return null;

          const along = (fretX(fret - 1) + fretX(fret)) / 2;

          const positions =
            fret === 12
              ? [TOP_Y + stringSpacing * 1.5, TOP_Y + stringSpacing * 3.5]
              : [HEIGHT / 2];

          return positions.map((across, index) => (
            <circle
              key={`${fret}-${index}`}
              cx={pt(along, across).x}
              cy={pt(along, across).y}
              r="5"
              fill="#f9fcfa"
              opacity="0.35"
            />
          ));
        })}

        {/* Trastes */}
        {Array.from(
          { length: endFret - firstLine + 1 },
          (_, i) => firstLine + i,
        ).map((fret) => {
          const x = fretX(fret);
          const lineStart = pt(x, TOP_Y - 28);
          const lineEnd = pt(x, BOTTOM_Y + 28);
          const numberPos = pt((fretX(fret - 1) + x) / 2, 25);

          return (
            <g key={fret}>
              <line
                x1={lineStart.x}
                y1={lineStart.y}
                x2={lineEnd.x}
                y2={lineEnd.y}
                stroke={fret === 0 ? "#D6DCE5" : "#8D97A8"}
                strokeWidth={fret === 0 ? 6 : 2}
                opacity={fret === 0 ? 0.95 : 0.85}
              />

              {fret > firstLine && (
                <text
                  x={numberPos.x}
                  y={vertical ? numberPos.y + 4 : numberPos.y}
                  textAnchor="middle"
                  className="fret-number"
                >
                  {fret}
                </text>
              )}
            </g>
          );
        })}

        {/* Cuerdas y notas */}
        {strings.map((string, index) => {
          const across = stringAcross(index);
          const stringStart = pt(START_X, across);
          const stringEnd = pt(END_X, across);
          const labelPos = pt(48, across);

          return (
            <g key={index}>
              <line
                x1={stringStart.x}
                y1={stringStart.y}
                x2={stringEnd.x}
                y2={stringEnd.y}
                stroke="#AAB4C3"
                strokeWidth={Math.max(1.2, 3 - index * 0.3)}
                opacity="0.8"
              />

              <text
                x={labelPos.x}
                y={labelPos.y + 5}
                textAnchor="middle"
                className="string-label"
              >
                {getNoteName(string.pitch, notation)}
              </text>

              {visibleFrets.map((fret) => {
                const pitch = (string.pitch + fret) % 12;
                const interval = (pitch - root + 12) % 12;

                const inScale = intervals.includes(interval);
                const key = `${index}-${fret}`;
                const isToggled = toggled.has(key);

                // Nota de la escala: visible salvo que se haya quitado.
                // Fuera de la escala: visible (gris) solo si se agregó.
                const visible = inScale ? !isToggled : isToggled;

                const along =
                  fret === 0
                    ? START_X - 24
                    : (fretX(fret - 1) + fretX(fret)) / 2;
                const { x, y } = pt(along, across);

                const cellWidth =
                  fret === 0
                    ? 44
                    : fretX(fret) - fretX(fret - 1);

                const color = inScale ? getDegreeInfo(interval).color : "#9AA3B2";

                return (
                  <g
                    key={fret}
                    className="fret-cell"
                    onClick={() => onToggle(key)}
                  >
                    <rect
                      x={vertical ? x - 17 : x - cellWidth / 2}
                      y={vertical ? y - cellWidth / 2 : y - 17}
                      width={vertical ? 34 : cellWidth}
                      height={vertical ? cellWidth : 34}
                      fill="transparent"
                    />

                    {visible && (
                      <g className="fret-note">
                        <circle
                          cx={x}
                          cy={y}
                          r="17"
                          fill={color}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                          strokeOpacity="0.65"
                        />

                        <text
                          x={x}
                          y={y + 4}
                          textAnchor="middle"
                          className="note-label"
                        >
                          {display === "intervals"
                            ? getIntervalLabel(interval)
                            : getNoteName(pitch, notation)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
