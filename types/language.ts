export interface LanguageStats {
  name: string;
  percentage: number;
  color: string;
}

export interface LanguageStatsData {
  organization: string;
  languages: LanguageStats[];
}
