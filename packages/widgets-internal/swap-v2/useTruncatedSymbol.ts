import { useMatchBreakpoints } from "@pancakeswap/uikit";
import { useMemo } from "react";

/**
 * Responsive truncate symbol based on screen size
 * @param symbol Currency symbol
 * @example useTruncatedSymbol("PancakeSwap") => "Panc...Swap" (Desktop) | "Pa...wap" (Mobile)
 */
export const useTruncatedSymbol = (symbol?: string) => {
  const { isMobile } = useMatchBreakpoints();

  const shortedSymbol = useMemo(() => {
    const CUTOFF_FONT_SIZE = isMobile ? { left: 3, right: 3 } : { left: 5, right: 4 };
    if (symbol && symbol.length > CUTOFF_FONT_SIZE.left + CUTOFF_FONT_SIZE.right) {
      return `${symbol.slice(0, CUTOFF_FONT_SIZE.left)}...${symbol.slice(
        symbol.length - CUTOFF_FONT_SIZE.right,
        symbol.length
      )}`;
    }
    return symbol;
  }, [symbol, isMobile]);

  return shortedSymbol;
};
