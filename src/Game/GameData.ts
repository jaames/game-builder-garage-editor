import { GameMeta } from "./GameMeta";
import { GameThumbnail } from "./GameThumbnail";
import { GameConnection } from "./GameConnection";
import { GameTexture } from "./GameTexture";
import { GameNodon } from "./GameNodon";

import { GameDataReader } from "./GameDataReader";
import { BymlNode } from "../Byml";

export class GameData {

  public meta: GameMeta | null = null;
  public thumbnail: GameThumbnail | null = null;
  public textures: GameTexture[] = [];
  public nodons: GameNodon[] = [];
  public connections: GameConnection[] = [];

  public _bymlCache: BymlNode; // for reconstructing full data when exporting

  static fromBuffer(buffer: ArrayBuffer) {
    const reader = new GameDataReader(buffer);
    const game = new GameData();
    game._bymlCache = reader.rootNode;
    game.meta = reader.getMetaData();
    game.thumbnail = reader.getThumbnail();
    game.textures = reader.getTextureList();
    game.connections = reader.getConnections();
    game.nodons = reader.getNodons();
    return game;
  }

  static async fromUrl(url: string) {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    return GameData.fromBuffer(data);
  }

  public getNodonTypesUsed() {
    const uniques = new Set<string>();
    this.nodons.forEach((nodon) => {
      if (!uniques.has(nodon.type))
        uniques.add(nodon.type)
    });
    return [...uniques];
  }

}