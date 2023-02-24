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
