export interface Headline {
  headline: string;
  url: string;
  tag: string;
  year: number;
}

export interface DayData {
  headlines: Headline[];
  years: number[];
  count: number;
}

export type ByDayData = Record<string, DayData>;
