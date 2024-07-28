import { Optional } from "../types";

/**
 * Sets a text to lowercase and removes diacritics.
 *
 * @param text Text to normalize
 * @returns Formatted text
 */
export const normalizeForComparison = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/**
 * Compares two strings, ignoring their case.
 *
 * @param str1 First string
 * @param str2 Second string
 * @returns Whether the strings contain the same text
 */
export const areEqual = (str1: Optional<string>, str2: Optional<string>): boolean =>
  !!str1 && !!str2 && str1.toLowerCase().trim() === str2.toLowerCase().trim();

/**
 * Checks if one of the strings is contained in the other. The comparison is
 * made on the normalized value of each string.
 *
 * @param str1 First string
 * @param str2 Second string
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
 * Shuffles an array. The original array is not modified.
 *
 * @param arr Array to shuffle
 * @returns A new array with shuffled elements
 */
export function shuffleArray<T>(arr: T[]): T[] {
  return arr
    .map((element) => ({ element, sortValue: Math.random() }))
    .sort((a, b) => a.sortValue - b.sortValue)
    .map(({ element }) => element);
}

/**
 * Filters the array to keep only one occurrence of each element. The original
 * array is not modified.
 *
 * @param arr Array to filter
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
 * Removes the first occurrence of a set of items. This function will modify
 * the source array.
 *
 * @param source Array of items
 * @param toRemove Item(s) to remove
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
 * Removes a certain number of occurrences of an item from an array. This
 * function will modify the source array.
 *
 * @param source Array of items
 * @param toRemove Item to remove
 * @param times Number of occurrences to remove
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
