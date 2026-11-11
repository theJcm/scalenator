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
  startFret = 1,
  endFret = 24,
  toggled,
  onToggle,
}: FretboardProps) {
  const stringSpacing =
    strings.length > 1 ? (BOTTOM_Y - TOP_Y) / (strings.length - 1) : 0;

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
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="fretboard"
        role="img"
        aria-label="Diapasón musical"
      >
        <defs>
          <linearGradient id="boardGradient" x1="0" y1="0" x2="0" y2="1">
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
          x={START_X}
          y={TOP_Y - 28}
          width={END_X - START_X}
          height={BOTTOM_Y - TOP_Y + 56}
          rx="12"
          fill="url(#boardGradient)"
          stroke="#f8f8f3"
          strokeWidth="1"
        />

        {/* Marcadores */}
        {markers.map((fret) => {
          if (fret < startFret || fret > endFret) return null;

          const x = (fretX(fret - 1) + fretX(fret)) / 2;

          const positions =
            fret === 12
              ? [TOP_Y + stringSpacing * 1.5, TOP_Y + stringSpacing * 3.5]
              : [HEIGHT / 2];

          return positions.map((y, index) => (
            <circle
              key={`${fret}-${index}`}
              cx={x}
              cy={y}
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

          return (
            <g key={fret}>
              <line
                x1={x}
                y1={TOP_Y - 28}
                x2={x}
                y2={BOTTOM_Y + 28}
                stroke={fret === 0 ? "#D6DCE5" : "#8D97A8"}
                strokeWidth={fret === 0 ? 6 : 2}
                opacity={fret === 0 ? 0.95 : 0.85}
              />

              {fret > firstLine && (
                <text
                  x={(fretX(fret - 1) + x) / 2}
                  y="25"
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
          const y = TOP_Y + index * stringSpacing;

          return (
            <g key={index}>
              <line
                x1={START_X}
                y1={y}
                x2={END_X}
                y2={y}
                stroke="#AAB4C3"
                strokeWidth={Math.max(1.2, 3 - index * 0.3)}
                opacity="0.8"
              />

              <text
                x="48"
                y={y + 5}
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

                const x =
                  fret === 0
                    ? START_X - 24
                    : (fretX(fret - 1) + fretX(fret)) / 2;

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
                      x={x - cellWidth / 2}
                      y={y - 17}
                      width={cellWidth}
                      height={34}
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
