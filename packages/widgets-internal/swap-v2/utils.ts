export const formatSwapPrice = (value?: string | number) => {
  if (!value) return "";

  return Intl.NumberFormat(undefined, {
    notation: "compact",
    compactDisplay: "short",
    maximumSignificantDigits: 6,
  }).format(Number(value));
};
