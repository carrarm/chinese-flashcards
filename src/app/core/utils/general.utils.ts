export const normalizeForComparison = (text: string): string =>
  text
    ? text
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
    : text;
