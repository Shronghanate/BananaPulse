
export type BananaStatus = 'unripe' | 'ripe' | 'overripe' | 'rotten';

export interface FreshnessResult {
  status: BananaStatus;
  confidence: number;
  daysRemaining: number;
  description: string;
  storageTips: string[];
  nutritionalValue: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string;
  result: FreshnessResult;
}
