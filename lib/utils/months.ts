/**
 * Month utility functions
 */

// Month name to abbreviation mapping (supports both German and English)
export const MONTH_ABBREVIATIONS: Record<string, string> = {
  // German months
  'Januar': 'Jan',
  'Februar': 'Feb',
  'März': 'Mar',
  'April': 'Apr',
  'Mai': 'May',
  'Juni': 'Jun',
  'Juli': 'Jul',
  'August': 'Aug',
  'September': 'Sep',
  'Oktober': 'Oct',
  'November': 'Nov',
  'Dezember': 'Dec',
  // English months
  'January': 'Jan',
  'February': 'Feb',
  'March': 'Mar',
  'May': 'May',
  'June': 'Jun',
  'July': 'Jul',
  'October': 'Oct',
  'December': 'Dec',
}

/**
 * Get abbreviated month name
 * Converts German or English month names to abbreviations
 * Falls back to first 3 characters if month not found
 */
export function getMonthAbbr(month: string): string {
  return MONTH_ABBREVIATIONS[month] || month.substring(0, 3)
}

/**
 * Sort months chronologically (January first, December last)
 * Supports both English and German month names
 */
const MONTH_ORDER: Record<string, number> = {
  'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
  'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11,
  'Januar': 0, 'Februar': 1, 'März': 2, 'Mai': 4, 'Juni': 5,
  'Juli': 6, 'Oktober': 9, 'Dezember': 11,
}

export function sortMonths(months: string[]): string[] {
  return [...months].sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99))
}

/**
 * Format array of months as abbreviated string
 * @param months Array of month names
 * @returns Comma-separated abbreviated month names
 */
export function formatMonthsAbbr(months: string[]): string {
  return months.map(getMonthAbbr).join(', ')
}
