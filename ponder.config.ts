import { createConfig } from "@ponder/core";
import { http } from "viem";

import { CryptoPunksMarketAbi } from "./abis/CryptoPunksMarketAbi";

export default createConfig({
  networks: {
    mainnet: { chainId: 1, transport: http(process.env.PONDER_RPC_URL_1) },
  },
  contracts: {
    CryptoPunksMarket: {
      abi: CryptoPunksMarketAbi,
      address: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
      network: "mainnet",
      startBlock: 3914495,
    },
  },
});
