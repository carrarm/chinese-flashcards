import { Optional } from "../types";

//================================================================
// ARRAY UTILS
//================================================================

/**
 * Shuffle an array. The original array is not modified.
 *
 * @param arr  Array to shuffle
 * @returns A new array with shuffled elements
 */
export function shuffleArray<T>(arr: T[]): T[] {
  return arr
    .map((element) => ({ element, sortValue: Math.random() }))
    .sort((a, b) => a.sortValue - b.sortValue)
    .map(({ element }) => element);
}

/**
 * Filter the array to keep only one occurrence of each element. The original
 * array is not modified.
 *
 * @param arr  Array to filter
 * @returns New array without duplicates
 */
export function uniqueValues<T>(arr: T[]): T[] {
  const unique: T[] = [];
  arr.forEach((value) => {
    if (!unique.includes(value)) {
      unique.push(value);
    }
  });
  return unique;
}

/**
 * Remove the first occurrence of a set of items. This function will modify
 * the source array.
 *
 * @param source    Array of items
 * @param toRemove  Item(s) to remove
 * @returns Source array without the removed occurrences
 */
export function removeOnce<T>(source: T[], toRemove: T | T[]): T[] {
  const valuesToRemove = Array.isArray(toRemove) ? toRemove : [toRemove];
  valuesToRemove.forEach((value) => {
    const sourceIndex = source.findIndex((sourceValue) => sourceValue === value);
    if (sourceIndex !== -1) {
      source.splice(sourceIndex, 1);
    }
  });
  return source;
}

/**
 * Remove a certain number of occurrences of an item from an array. This
 * function will modify the source array.
 *
 * @param source    Array of items
 * @param toRemove  Item to remove
 * @param times     Number of occurrences to remove
 * @returns Source array without the removed occurrences
 */
export function removeTimes<T>(source: T[], toRemove: T, times: number): T[] {
  let toRemoveCount = times;
  while (toRemoveCount > 0 && source.length) {
    const sourceIndex = source.findIndex((sourceValue) => sourceValue === toRemove);
    if (sourceIndex === -1) {
      toRemoveCount = 0;
    } else {
      source.splice(sourceIndex, 1);
      toRemoveCount--;
    }
  }
  return source;
}

/**
 * Find the index of the last element matching the predicate.
 *
 * @param arr        Array of items
 * @param predicate  Predicate to test each element of the array
 * @returns Index of the last element found, or -1 if nothing matches
 */
export function findLastIndex<T>(arr: T[], predicate: (element: T) => boolean): number {
  const result = [...arr].reverse().find(predicate);
  return result ? arr.lastIndexOf(result) : -1;
}

//================================================================
// STRING UTILS
//================================================================

/**
 * Set a text to lowercase and removes diacritics.
 *
 * @param text  Text to normalize
 * @returns Formatted text
 */
export const normalizeForComparison = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/**
 * Compare two strings, ignoring their case.
 *
 * @param str1  First string
 * @param str2  Second string
 * @returns Whether the strings contain the same text
 */
export const areEqual = (str1: Optional<string>, str2: Optional<string>): boolean =>
  !!str1 && !!str2 && str1.toLowerCase().trim() === str2.toLowerCase().trim();

/**
 * Check if one of the strings is contained in the other. The comparison is
 * made on the normalized value of each string.
 *
 * @param str1  First string
 * @param str2  Second string
 * @returns Whether one of them is a substring
 */
export const areSubstrings = (
  str1: Optional<string>,
  str2: Optional<string>
): boolean => {
  if (!str1 || !str2) {
    return false;
  }

  const normalizedStr1 = normalizeForComparison(str1);
  const normalizedStr2 = normalizeForComparison(str2);
  return (
    normalizedStr1.includes(normalizedStr2) || normalizedStr2.includes(normalizedStr1)
  );
};

/**
 * Replace a character in a string at the specified index.
 *
 * @param text     Original text
 * @param index    Position of the character to replace
 * @param newChar  Character replacing the old one
 * @returns Text with replaced character
 */
export function replaceCharAt(text: string, index: number, newChar: string): string {
  const asArray = text.split("");
  asArray[index] = newChar;
  return asArray.join("");
}
