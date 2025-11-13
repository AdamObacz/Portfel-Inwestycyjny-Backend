export interface PortfolioItem {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

export interface Portfolio {
  owner: string;
  items: PortfolioItem[];
}
