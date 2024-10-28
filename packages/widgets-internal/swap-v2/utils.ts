import { Currency, Price } from "@pancakeswap/swap-sdk-core";
import { formatPrice } from "@pancakeswap/utils/formatFractions";

export const formatSwapPrice = (price?: Price<Currency, Currency>, precision: number = 6) => {
  const value = Number(formatPrice(price, precision));

  if (!value) return "";

  if (value > 0) {
    if (value < 0.00001) return "<0.00001";

    if (value < 1) {
      return Intl.NumberFormat(undefined, {
        minimumSignificantDigits: 2,
        maximumSignificantDigits: 5,
        useGrouping: false,
      }).format(value);
    }
  }

  return Intl.NumberFormat(undefined, {
    maximumSignificantDigits: 6,
    useGrouping: false,
  }).format(Number(value));
};
