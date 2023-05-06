import { Optional } from "../types";

export const normalizeForComparison = (text: string): string =>
  text
    ? text
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
    : text;

export const areEqual = (str1: Optional<string>, str2: Optional<string>): boolean =>
  !!str1 && !!str2 && str1.toLowerCase().trim() === str2.toLowerCase().trim();

export function shuffleArray<T>(arr: T[]): T[] {
  return arr
    .map((element) => ({ element, sortValue: Math.random() }))
    .sort((a, b) => a.sortValue - b.sortValue)
    .map(({ element }) => element);
}

export function uniqueValues<T>(arr: T[]): T[] {
  const unique: T[] = [];
  arr.forEach((value) => {
    if (!unique.includes(value)) {
      unique.push(value);
    }
  });
  return unique;
}

export function removeOnce<T>(source: T[], toRemove: T[]): T[] {
  toRemove.forEach((value) => {
    const sourceIndex = source.findIndex((sourceValue) => sourceValue === value);
    if (sourceIndex !== -1) {
      source.splice(sourceIndex, 1);
    }
  });
  return source;
}

/**
 * Removes a certain number of occurrences of an element from an array.
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
