export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: 'US$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥',
    KRW: '₩', INR: '₹', THB: '฿', IDR: 'Rp', MYR: 'RM',
    PHP: '₱', VND: '₫', SGD: 'S$', AUD: 'A$', NZD: 'NZ$',
    CAD: 'C$', CHF: 'CHF', SEK: 'kr', NOK: 'kr', DKK: 'kr',
    HKD: 'HK$', TWD: 'NT$', ZAR: 'R', BRL: 'R$', MXN: 'MX$',
    AED: 'AED', SAR: 'SAR', TRY: '₺', PLN: 'zł', CZK: 'Kč',
    HUF: 'Ft', RON: 'lei', HRK: 'kn', RUB: '₽', ILS: '₪',
    EGP: 'E£', MAD: 'MAD', KES: 'KSh', NGN: '₦', GHS: 'GH₵',
    COP: 'COL$', PEN: 'S/.', CLP: 'CLP$', ARS: 'ARS$',
  }
  return symbols[currency] || currency
}

export const CURRENCY_OPTIONS = [
  { code: 'USD', label: 'USD - US Dollar' },
  { code: 'EUR', label: 'EUR - Euro' },
  { code: 'GBP', label: 'GBP - British Pound' },
  { code: 'IDR', label: 'IDR - Indonesian Rupiah' },
  { code: 'SGD', label: 'SGD - Singapore Dollar' },
  { code: 'MYR', label: 'MYR - Malaysian Ringgit' },
  { code: 'THB', label: 'THB - Thai Baht' },
  { code: 'PHP', label: 'PHP - Philippine Peso' },
  { code: 'VND', label: 'VND - Vietnamese Dong' },
  { code: 'AUD', label: 'AUD - Australian Dollar' },
  { code: 'NZD', label: 'NZD - New Zealand Dollar' },
  { code: 'JPY', label: 'JPY - Japanese Yen' },
  { code: 'CNY', label: 'CNY - Chinese Yuan' },
  { code: 'HKD', label: 'HKD - Hong Kong Dollar' },
  { code: 'INR', label: 'INR - Indian Rupee' },
  { code: 'AED', label: 'AED - UAE Dirham' },
  { code: 'CHF', label: 'CHF - Swiss Franc' },
  { code: 'CAD', label: 'CAD - Canadian Dollar' },
]
