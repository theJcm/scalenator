export const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export const LATIN_NOTES = [
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
] as const;

export const STRUCTURES = {
  scales: {
    major: {
      name: "Mayor",
      intervals: [0, 2, 4, 5, 7, 9, 11],
    },
    minor: {
      name: "Menor natural",
      intervals: [0, 2, 3, 5, 7, 8, 10],
    },
    harmonicMinor: {
      name: "Menor armónica",
      intervals: [0, 2, 3, 5, 7, 8, 11],
    },
    melodicMinor: {
      name: "Menor melódica",
      intervals: [0, 2, 3, 5, 7, 9, 11],
    },
    majorPentatonic: {
      name: "Pentatónica mayor",
      intervals: [0, 2, 4, 7, 9],
    },
    minorPentatonic: {
      name: "Pentatónica menor",
      intervals: [0, 3, 5, 7, 10],
    },
    minorBlues: {
      name: "Blues menor",
      intervals: [0, 3, 5, 6, 7, 10],
    },
    majorBlues: {
      name: "Blues mayor",
      intervals: [0, 2, 3, 4, 7, 9],
    },
    dorian: {
      name: "Dórico",
      intervals: [0, 2, 3, 5, 7, 9, 10],
    },
    phrygian: {
      name: "Frigio",
      intervals: [0, 1, 3, 5, 7, 8, 10],
    },
    lydian: {
      name: "Lidio",
      intervals: [0, 2, 4, 6, 7, 9, 11],
    },
    mixolydian: {
      name: "Mixolidio",
      intervals: [0, 2, 4, 5, 7, 9, 10],
    },
    locrian: {
      name: "Locrio",
      intervals: [0, 1, 3, 5, 6, 8, 10],
    },
  },
  arpeggios: {
    major: {
      name: "Mayor",
      intervals: [0, 4, 7],
    },
    minor: {
      name: "Menor",
      intervals: [0, 3, 7],
    },
    augmented: {
      name: "Aumentado",
      intervals: [0, 4, 8],
    },
    diminished: {
      name: "Disminuido",
      intervals: [0, 3, 6],
    },
    dominant7: {
      name: "Dominante 7",
      intervals: [0, 4, 7, 10],
    },
    major7: {
      name: "Mayor 7",
      intervals: [0, 4, 7, 11],
    },
    minor7: {
      name: "Menor 7",
      intervals: [0, 3, 7, 10],
    },
    halfDiminished7: {
      name: "Semidisminuido 7",
      intervals: [0, 3, 6, 10],
    },
  },
} as const;

export type StructureCategory = keyof typeof STRUCTURES;

export const INSTRUMENTS = {
  guitar: {
    name: "Guitarra",
    maxFrets: 24,
    strings: [
      { name: "E", pitch: 4 },
      { name: "B", pitch: 11 },
      { name: "G", pitch: 7 },
      { name: "D", pitch: 2 },
      { name: "A", pitch: 9 },
      { name: "E", pitch: 4 },
    ],
  },
  bass4: {
    name: "Bajo eléctrico 4 cuerdas",
    maxFrets: 24,
    strings: [
      { name: "G", pitch: 7 },
      { name: "D", pitch: 2 },
      { name: "A", pitch: 9 },
      { name: "E", pitch: 4 },
    ],
  },
  bass5: {
    name: "Bajo eléctrico 5 cuerdas",
    maxFrets: 24,
    strings: [
      { name: "G", pitch: 7 },
      { name: "D", pitch: 2 },
      { name: "A", pitch: 9 },
      { name: "E", pitch: 4 },
      { name: "B", pitch: 11 },
    ],
  },
  guitarron: {
    name: "Guitarrón",
    maxFrets: 7,
    strings: [
      { name: "A", pitch: 9 },
      { name: "E", pitch: 4 },
      { name: "C", pitch: 0 },
      { name: "G", pitch: 7 },
      { name: "D", pitch: 2 },
      { name: "A", pitch: 9 },
    ],
  },
  bajoquinto: {
    name: "Bajoquinto",
    maxFrets: 17,
    strings: [
      { name: "F", pitch: 5 },
      { name: "C", pitch: 0 },
      { name: "G", pitch: 7 },
      { name: "D", pitch: 2 },
      { name: "A", pitch: 9 },
    ],
  },
} as const;

export type InstrumentType = keyof typeof INSTRUMENTS;
