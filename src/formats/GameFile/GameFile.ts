import { GameMetaExtended } from './GameMeta';
import { GameThumbnail } from './GameThumbnail'
import { GameFileReader } from './GameFileReader';
import { GameFileWriter } from './GameFileWriter';

import { ActorType, Nodon, Connection, Texture } from '../../objects';

import { BymlNode } from '../Byml';

export class GameFile {
  
  get [Symbol.toStringTag]() { return 'Game Builder Garage Game' };

  public meta: GameMetaExtended | null = null;
  public thumbnail: GameThumbnail | null = null;
  public textures: Texture[] = [];
  public nodons: Nodon[] = [];
  public connections: Connection[] = [];
  public textStrings: string[] = [];
  public commentStrings: string[] = [];
  public textureEditorPalette: number[][] = [];

  public _bymlCache: BymlNode; // for reconstructing full data when exporting

  static fromBuffer(buffer: ArrayBuffer) {
    const reader = new GameFileReader(buffer);
    const game = new GameFile();
    game._bymlCache = reader.rootNode;
    game.meta = reader.getMetaData();
    game.thumbnail = reader.getThumbnail();
    game.textures = reader.getTextures();
    game.connections = reader.getConnections();
    game.nodons = reader.getNodons();
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

  public getNodonTypesUsed() {
    const uniques = new Set<ActorType>();
    this.nodons.forEach((nodon) => {
      if (!uniques.has(nodon.type))
        uniques.add(nodon.type)
    });
    return [...uniques];
  }

  public getNodonWithActorType(type: ActorType) {
    return this.nodons.filter(nodon => nodon.type === type);
  }

  public getWriter() {
    return new GameFileWriter(this);
  }

  // public getArrayBuffer() {
  //   const writer = this.getWriter();
  //   return writer.getArrayBuffer();
  // }

  // public getBytes() {
  //   const writer = this.getWriter();
  //   return writer.getBytes();
  // }

  // public saveAs(filename: string) {
  //   const writer = this.getWriter();
  //   writer.saveAs(filename);
  // }

}