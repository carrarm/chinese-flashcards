import { Indexable } from "@core/types";

/**
 * All the available tones for each letter.
 */
const TONES: Indexable<string[]> = Object.freeze({
  A: ["Ā", "Á", "Ǎ", "À"],
  E: ["Ē", "É", "Ě", "È"],
  I: ["Ī", "Í", "Ǐ", "Ì"],
  O: ["Ō", "Ó", "Ǒ", "Ò"],
  U: ["Ū", "Ú", "Ǔ", "Ù"],
  Ü: ["Ǖ", "Ǘ", "Ǚ", "Ǜ"],
});

/**
 * Get all the available tones for the key.
 *
 * @param letter       Letter to fetch tones for
 * @param letterCase   Whether the tones should be uppercase or lowercased
 * @returns Array of tones for the letter
 */
export const getTones = (letter: string, letterCase: "UPPER" | "LOWER"): string[] => {
  let tones = TONES[letter.toUpperCase()] ?? [];
  if (letterCase === "LOWER") {
    tones = tones.map((toneLetter) => toneLetter.toLowerCase());
  }
  return tones;
};

/**
 * Check if a letter has associated tones.
 *
 * @param letter The letter to check
 * @returns Whether or not there are pinyin tones for the letter
 */
export const hasTones = (letter: string): boolean => {
  return Object.keys(TONES).includes(letter.toUpperCase());
};

/**
 * Transform a letter to a specific tone.
 *
 * @param letter  Base letter
 * @param digit   Tone, between 1-4
 * @returns Transformed letter
 */
export const toTone = (letter: string, digit: number): string => {
  const isUppercased = letter.toUpperCase() === letter;
  const letterTones = getTones(letter.toUpperCase(), "UPPER");

  let transformed = letter;
  if (letterTones.length && digit >= 1 && digit <= 4) {
    const matchedTone = letterTones[digit - 1];
    transformed = isUppercased ? matchedTone : matchedTone.toLowerCase();
  }
  return transformed;
};
