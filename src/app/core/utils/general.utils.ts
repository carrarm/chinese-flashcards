export const normalizeForComparison = (text: string): string =>
  text
    ? text
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
    : text;

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
    const sourceIndex = source.findIndex(
      (sourceValue) => sourceValue === value
    );
    if (sourceIndex !== -1) {
      source.splice(sourceIndex, 1);
    }
  });
  return source;
}
