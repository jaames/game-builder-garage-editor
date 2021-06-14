export interface GameMeta {
  gameTitle: string,
  gameId: string,
  gameOnlineId: string,
  gameIdHistory: string[],
  gameLocale: string,
  programmerName: string,
  programmerId: string,
  nodonCount: number;
  connectionCount: number;
  created: Date;
  modified: Date;
};