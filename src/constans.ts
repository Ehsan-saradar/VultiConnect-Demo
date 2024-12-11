export enum ChainKey {
  ARBITRUM = "Arbitrum",
  AVALANCHE = "Avalanche",
  BASE = "Base",
  BITCOIN = "Bitcoin",
  BITCOINCASH = "BitcoinCash",
  BLAST = "Blast",
  BSCCHAIN = "BSC",
  CRONOSCHAIN = "CronosChain",
  DASH = "Dash",
  DOGECOIN = "Dogecoin",
  DYDX = "Dydx",
  ETHEREUM = "Ethereum",
  GAIACHAIN = "Cosmos",
  KUJIRA = "Kujira",
  LITECOIN = "Litecoin",
  MAYACHAIN = "MayaChain",
  OPTIMISM = "Optimism",
  OSMOSIS = "Osmosis",
  POLKADOT = "Polkadot",
  POLYGON = "Polygon",
  SOLANA = "Solana",
  SUI = "Sui",
  THORCHAIN = "THORChain",
  ZKSYNC = "Zksync",
}
export interface ChainProps {
  active?: boolean;
  address?: string;
  cmcId: number;
  decimals: number;
  derivationKey?: string;
  id: string;
  name: ChainKey;
  ticker: string;
}

export enum CosmosChain {
  Gaia = ChainKey.GAIACHAIN,
  Dydx = ChainKey.DYDX,
  Kujira = ChainKey.KUJIRA,
  Osmosis = ChainKey.OSMOSIS,
}

export const allSupportedChains: ChainProps[] = [
  {
    cmcId: 1,
    decimals: 8,
    id: "0x1f96",
    name: ChainKey.BITCOIN,
    ticker: "BTC",
  },
  {
    cmcId: 2,
    decimals: 8,
    id: "Litecoin_litecoin",
    name: ChainKey.LITECOIN,
    ticker: "LTC",
  },
  {
    cmcId: 131,
    decimals: 8,
    id: "Dash_dash",
    name: ChainKey.DASH,
    ticker: "DASH",
  },
  {
    cmcId: 74,
    decimals: 8,
    id: "0x7d0",
    name: ChainKey.DOGECOIN,
    ticker: "DOGE",
  },
  {
    cmcId: 1831,
    decimals: 8,
    id: "0x2710",
    name: ChainKey.BITCOINCASH,
    ticker: "BCH",
  },
  {
    cmcId: 12220,
    decimals: 6,
    id: "osmosis-1",
    name: ChainKey.OSMOSIS,
    ticker: "OSMO",
  },
  {
    cmcId: 3794,
    decimals: 6,
    id: "cosmoshub-4",
    name: ChainKey.GAIACHAIN,
    ticker: "ATOM",
  },
  {
    cmcId: 28324,
    decimals: 18,
    id: "dydx-1",
    name: ChainKey.DYDX,
    ticker: "DYDX",
  },
  {
    cmcId: 15185,
    decimals: 6,
    id: "kaiyo-1",
    name: ChainKey.KUJIRA,
    ticker: "KUJI",
  },
];
