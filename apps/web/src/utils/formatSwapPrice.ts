export const formatSwapPrice = (value: number) => {
  return Intl.NumberFormat(undefined, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumSignificantDigits: 6,
  }).format(value)
}
