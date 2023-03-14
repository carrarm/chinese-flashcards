/**
 * All the available tones for each letter.
 */
const TONES: { [key: string]: string[] } = Object.freeze({
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
 * @param letter Letter to fetch tones for
 * @param letterCase Whether the tones should be uppercase or lowercased
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
