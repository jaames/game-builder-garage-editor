import { GameMeta, GameThumbnail } from '../GameFile';

export interface GameTableEntry extends GameMeta {
  id: number;
  thumbnail: GameThumbnail;
};