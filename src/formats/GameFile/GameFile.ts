import { BymlNode } from '../Byml';
import { GameMetaExtended } from './GameMeta';
import { GameThumbnail } from './GameThumbnail'
import { GameFileReader } from './GameFileReader';
import { GameFileWriter } from './GameFileWriter';

import { 
  ActorType, 
  Nodon,
  Connection,
  Texture,
  Cost,
  ActorCost,
  COST_MAX,
  COST_ACTORS_MAP,
  COST_CONNECTION,
} from '../../objects';

export class GameFile {
  
  get [Symbol.toStringTag]() { return 'Game Builder Garage Game' };

  meta: GameMetaExtended | null = null;
  thumbnail: GameThumbnail | null = null;
  textures: Texture[] = [];
  nodons: Nodon[] = [];
  connections: Connection[] = [];
  textStrings: string[] = [];
  commentStrings: string[] = [];
  textureEditorPalette: number[][] = [];

  _bymlCache: BymlNode; // for reconstructing full data when exporting

  // TODO: move this all to GameFileReader, so it just returns a GameFile object itself
  static fromBuffer(buffer: ArrayBuffer) {
    const reader = new GameFileReader(buffer);
    const game = new GameFile();
    game._bymlCache = reader.rootNode;
    game.meta = reader.getMetaData();
    game.thumbnail = reader.getThumbnail();
    game.textures = reader.getTextures();
    game.connections = reader.getConnections();
    game.nodons = reader.getNodons();
    game.nodons.forEach(nodon => nodon.game = game);
    game.textStrings = reader.getTextNodonStrings();
    game.commentStrings = reader.getCommentNodonStrings();
    // game.textureEditorPalette = reader.getTextureEditorPalette();
    return game;
  }

  static async fromUrl(url: string) {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    return GameFile.fromBuffer(data);
  }

  getNodonTypesUsed() {
    const uniques = new Set<ActorType>();
    this.nodons.forEach((nodon) => {
      if (!uniques.has(nodon.type))
        uniques.add(nodon.type)
    });
    return [...uniques];
  }

  getNodonWithActorType(type: ActorType) {
    return this.nodons.filter(nodon => nodon.type === type);
  }

  getNodonWithId(id: number) {
    return this.nodons.find(nodon => nodon.id === id);
  }

  getConnectionWithId(id: number) {
    return this.connections.find(connection => connection.id === id);
  }

  getConnectionsForNodon(nodon: Nodon) {
    const nodonId = nodon.id;
    const a = this.connections.filter(connection => connection.idA === nodonId);
    const b = this.connections.filter(connection => connection.idB === nodonId);
    return [...a, ...b].filter(connection => connection !== undefined);
  }

  getObjectWithId(id: number): (Nodon | Connection) {
    const nodon = this.getNodonWithId(id);
    if (nodon) return nodon;
    const connection = this.getConnectionWithId(id);
    if (connection) return connection;
  }

  // not accurate until fancy node sub-types and "bind" connections are understood
  getCost(): Cost {
    const nodon = this.nodons;
    const connections = this.connections;
    let fixedInvisible = 0;
    let fixedVisible = 0;
    let moveInvisible = 0;
    let moveVisible = 0;

    nodon.forEach(nodon => {
      const cost = COST_ACTORS_MAP.get(nodon.type);
      fixedInvisible += cost.fixedInvisible;
      fixedVisible += cost.fixedVisible;
      moveInvisible += cost.moveInvisible;
      moveVisible += cost.moveVisible;
    });

    connections.forEach(() => {
      fixedInvisible += COST_CONNECTION.fixedInvisible;
      fixedVisible += COST_CONNECTION.fixedVisible;
      moveInvisible += COST_CONNECTION.moveInvisible;
      moveVisible += COST_CONNECTION.moveVisible;
    });

    return {
      fixedInvisible,
      fixedVisible,
      moveInvisible,
      moveVisible,
    };
  }

  getWriter() {
    return new GameFileWriter(this);
  }

  // getArrayBuffer() {
  //   const writer = this.getWriter();
  //   return writer.getArrayBuffer();
  // }

  // getBytes() {
  //   const writer = this.getWriter();
  //   return writer.getBytes();
  // }

  // saveAs(filename: string) {
  //   const writer = this.getWriter();
  //   writer.saveAs(filename);
  // }

}