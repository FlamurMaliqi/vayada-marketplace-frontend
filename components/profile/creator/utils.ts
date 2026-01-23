/**
 * Format followers with German number format (22.000)
 */
export function formatFollowersDE(num: number): string {
  return new Intl.NumberFormat('de-DE').format(num)
}

/**
 * Get country flag emoji from country name
 */
export function getCountryFlag(country: string): string {
  const countryFlags: Record<string, string> = {
    'Germany': '🇩🇪',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'UK': '🇬🇧',
    'Canada': '🇨🇦',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Netherlands': '🇳🇱',
    'Belgium': '🇧🇪',
    'Australia': '🇦🇺',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'Singapore': '🇸🇬',
    'Thailand': '🇹🇭',
    'Indonesia': '🇮🇩',
    'Malaysia': '🇲🇾',
    'Philippines': '🇵🇭',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱',
    'South Africa': '🇿🇦',
    'UAE': '🇦🇪',
    'Saudi Arabia': '🇸🇦',
    'Qatar': '🇶🇦',
    'Kuwait': '🇰🇼',
    'Egypt': '🇪🇬',
    'Greece': '🇬🇷',
    'Costa Rica': '🇨🇷',
  }
  return countryFlags[country] || '🏳️'
}
