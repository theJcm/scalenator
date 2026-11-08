import {
  NOTES,
  LATIN_NOTES,
  STRUCTURES,
  type StructureCategory,
} from "../data/scales";

export function getStructureNotes(
  root: number,
  category: StructureCategory,
  structure: string,
) {
  const selected =
    STRUCTURES[category][
      structure as keyof (typeof STRUCTURES)[typeof category]
    ];

  return selected.intervals.map((interval) => (root + interval) % 12);
}

export function getNoteName(pitch: number, notation: "english" | "latin") {
  return notation === "latin" ? LATIN_NOTES[pitch] : NOTES[pitch];
}

const DEGREE_INFO: Record<
  number,
  { degree: string; functionName: string; color: string }
> = {
  0: {
    degree: "I",
    functionName: "Tónica",
    color: "#E40069",
  },
  1: {
    degree: "♭II",
    functionName: "Supertónica menor",
    color: "#E5A642",
  },
  2: {
    degree: "II",
    functionName: "Supertónica",
    color: "#E5A642",
  },
  3: {
    degree: "♭III",
    functionName: "Mediante menor",
    color: "#9275E8",
  },
  4: {
    degree: "III",
    functionName: "Mediante",
    color: "#9275E8",
  },
  5: {
    degree: "IV",
    functionName: "Subdominante",
    color: "#25A89A",
  },
  6: {
    degree: "♭V",
    functionName: "Tritono",
    color: "#91A4B8",
  },
  7: {
    degree: "V",
    functionName: "Dominante",
    color: "#438FE5",
  },
  8: {
    degree: "♭VI",
    functionName: "Submediante menor",
    color: "#E17B91",
  },
  9: {
    degree: "VI",
    functionName: "Submediante",
    color: "#E17B91",
  },
  10: {
    degree: "♭VII",
    functionName: "Subtónica",
    color: "#78A66A",
  },
  11: {
    degree: "VII",
    functionName: "Sensible",
    color: "#78A66A",
  },
};

export function getDegreeInfo(interval: number) {
  return DEGREE_INFO[interval % 12];
}

function getChordQuality(third: number, fifth: number) {
  if (third === 4 && fifth === 7) return "";
  if (third === 3 && fifth === 7) return "m";
  if (third === 3 && fifth === 6) return "dim";
  if (third === 4 && fifth === 8) return "aug";
  if (third === 2 && fifth === 7) return "sus2";
  if (third === 5 && fifth === 7) return "sus4";

  return "";
}

export function getScaleDegreesAndChords(
  root: number,
  intervals: readonly number[],
  notation: "english" | "latin",
) {
  return intervals.map((interval, index) => {
    const thirdIndex = (index + 2) % intervals.length;
    const fifthIndex = (index + 4) % intervals.length;

    const rootPitch = (root + interval) % 12;
    const thirdPitch = (root + intervals[thirdIndex]) % 12;
    const fifthPitch = (root + intervals[fifthIndex]) % 12;

    const thirdDistance = (thirdPitch - rootPitch + 12) % 12;
    const fifthDistance = (fifthPitch - rootPitch + 12) % 12;

    const info = getDegreeInfo(interval);
    const quality = getChordQuality(thirdDistance, fifthDistance);

    return {
      ...info,
      note: getNoteName(rootPitch, notation),
      chord: `${getNoteName(rootPitch, notation)}${quality}`,
      chordNotes: [
        getNoteName(rootPitch, notation),
        getNoteName(thirdPitch, notation),
        getNoteName(fifthPitch, notation),
      ],
    };
  });
}
