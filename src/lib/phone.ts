export function normalizeIranianPhone(value: string): string {
  const englishDigits = value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persian = '۰۱۲۳۴۵۶۷۸۹';
    const arabic = '٠١٢٣٤٥٦٧٨٩';
    const persianIndex = persian.indexOf(digit);
    if (persianIndex >= 0) return String(persianIndex);
    const arabicIndex = arabic.indexOf(digit);
    return arabicIndex >= 0 ? String(arabicIndex) : digit;
  });
  const compact = englishDigits.trim().replace(/[\s()-]/g, '');
  if (compact.startsWith('+98')) return `0${compact.slice(3)}`;
  if (compact.startsWith('0098')) return `0${compact.slice(4)}`;
  return compact;
}
