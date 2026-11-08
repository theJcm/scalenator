import { getNoteName, getDegreeInfo } from "../../utils/music";

interface FretboardProps {
  root: number;
  intervals: readonly number[];
  strings: readonly {
    name: string;
    pitch: number;
  }[];
  notation: "english" | "latin";
  frets?: number;
}

const WIDTH = 1200;
const HEIGHT = 420;

const START_X = 100;
const END_X = 1160;
const TOP_Y = 75;
const BOTTOM_Y = 345;

function getFretX(fret: number, totalFrets: number) {
  const length = END_X - START_X;

  return (
    START_X +
    (length * (1 - Math.pow(2, -fret / 12))) /
      (1 - Math.pow(2, -totalFrets / 12))
  );
}

export default function Fretboard({
  root,
  intervals,
  strings,
  notation,
  frets = 24,
}: FretboardProps) {
  const stringSpacing =
    strings.length > 1 ? (BOTTOM_Y - TOP_Y) / (strings.length - 1) : 0;

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
          if (fret > frets) return null;

          const x = (getFretX(fret - 1, frets) + getFretX(fret, frets)) / 2;

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
        {Array.from({ length: frets + 1 }, (_, fret) => {
          const x = getFretX(fret, frets);

          return (
            <g key={fret}>
              <line
                x1={x}
                y1={TOP_Y - 28}
                x2={x}
                y2={BOTTOM_Y + 28}
                stroke={fret === 0 ? "#D6DCE5" : "url(#fretGradient)"}
                strokeWidth={fret === 0 ? 6 : 1.8}
                opacity={fret === 0 ? 0.95 : 0.7}
              />

              {fret > 0 && (
                <text
                  x={(getFretX(fret - 1, frets) + x) / 2}
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

              {Array.from({ length: frets + 1 }, (_, fret) => {
                const pitch = (string.pitch + fret) % 12;
                const interval = (pitch - root + 12) % 12;

                if (!intervals.includes(interval)) return null;

                const info = getDegreeInfo(interval);
                const x =
                  fret === 0
                    ? START_X - 24
                    : (getFretX(fret - 1, frets) + getFretX(fret, frets)) / 2;

                return (
                  <g key={fret} className="fret-note">
                    <circle
                      cx={x}
                      cy={y}
                      r="17"
                      fill={info.color}
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
                      {getNoteName(pitch, notation)}
                    </text>
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
