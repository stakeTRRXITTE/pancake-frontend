import { ChainId } from "@pancakeswap/chains";
import { ERC20Token } from "@pancakeswap/sdk";

// For StoryBook
export const cakeToken = new ERC20Token(
  ChainId.BSC,
  "0x8CE592512B8BC92F0BEEac62F7cB692bb21aB225",
  18,
  "STAKE",
  "stakeTRRXITTE Token",
  "https://pancakeswap.finance/"
);

export const bscToken = new ERC20Token(
  ChainId.BSC,
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  18,
  "BNB",
  "BNB",
  "https://www.binance.com/"
);
