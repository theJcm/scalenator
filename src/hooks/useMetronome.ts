import { useCallback, useEffect, useRef, useState } from "react";

// accents: 2 = acento fuerte, 1 = acento medio, 0 = pulso normal
export const TIME_SIGNATURES = {
  "1/4": { beats: 1, accents: [2] },
  "2/4": { beats: 2, accents: [2, 0] },
  "3/4": { beats: 3, accents: [2, 0, 0] },
  "4/4": { beats: 4, accents: [2, 0, 0, 0] },
  "6/8": { beats: 6, accents: [2, 0, 0, 1, 0, 0] },
} as const;

export type TimeSignature = keyof typeof TIME_SIGNATURES;

export const MIN_BPM = 30;
export const MAX_BPM = 240;

const FREQUENCIES = [800, 1100, 1500];
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_S = 0.1;

export function useMetronome() {
  const [bpm, setBpm] = useState(100);
  const [signature, setSignature] = useState<TimeSignature>("4/4");
  const [running, setRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);

  const bpmRef = useRef(bpm);
  const signatureRef = useRef(signature);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    signatureRef.current = signature;
  }, [signature]);

  const audioRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const visualTimers = useRef<number[]>([]);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    visualTimers.current.forEach((id) => window.clearTimeout(id));
    visualTimers.current = [];
    setCurrentBeat(-1);
    setRunning(false);
  }, []);

  const start = useCallback(() => {
    if (timerRef.current !== null) return;

    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!audioRef.current) audioRef.current = new AudioCtor();
    const ctx = audioRef.current;
    void ctx.resume();

    let beatIndex = 0;
    let nextTime = ctx.currentTime + 0.05;

    const scheduleClick = (time: number, beat: number) => {
      const { accents } = TIME_SIGNATURES[signatureRef.current];
      const level = accents[beat];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = FREQUENCIES[level];
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(
        level === 0 ? 0.5 : 0.9,
        time + 0.002,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

      osc.connect(gain).connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.07);

      const delay = Math.max(0, (time - ctx.currentTime) * 1000);
      const id = window.setTimeout(() => {
        setCurrentBeat(beat);
        visualTimers.current = visualTimers.current.filter((t) => t !== id);
      }, delay);
      visualTimers.current.push(id);
    };

    const tick = () => {
      while (nextTime < ctx.currentTime + SCHEDULE_AHEAD_S) {
        const { beats } = TIME_SIGNATURES[signatureRef.current];
        beatIndex %= beats;
        scheduleClick(nextTime, beatIndex);
        beatIndex += 1;
        nextTime += 60 / bpmRef.current;
      }
    };

    tick();
    timerRef.current = window.setInterval(tick, LOOKAHEAD_MS);
    setRunning(true);
  }, []);

  const toggle = useCallback(() => {
    if (timerRef.current !== null) stop();
    else start();
  }, [start, stop]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      visualTimers.current.forEach((id) => window.clearTimeout(id));
      void audioRef.current?.close();
    };
  }, []);

  return {
    bpm,
    setBpm,
    signature,
    setSignature,
    running,
    toggle,
    currentBeat,
  };
}
