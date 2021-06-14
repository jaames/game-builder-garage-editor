import { GameFile } from './GameFile';
import { Key } from './GameBymlKeys';
import { BymlNode, BymlType, BymlHash, BymlWriter, getNode, hasNode } from '../Byml';
import { assert } from '../utils';

export class GameFileWriter {

  public writer: BymlWriter;
  public game: GameFile;

  constructor(game: GameFile) {
    this.game = game;
    const rootNode = this.patchGameNodes(game._bymlCache);
    this.writer = new BymlWriter(rootNode);
  }

  patchGameNodes(rootNode: BymlNode): BymlNode {
    assert(rootNode.type === BymlType.Hash, 'Root node must be a hash node');
    const projectNode = [...rootNode.hashMap.values()][0];
    const gameNode = getNode(projectNode, Key.FILE, BymlType.Hash);
    const dataNode = getNode(gameNode,    Key.DATA, BymlType.Hash);
    this.patchMetaNodes(dataNode);
    return rootNode;
  }

  patchMetaNodes(dataNode: BymlHash) {
    const meta = this.game.meta;
    const titleNode = getNode(dataNode, Key.GAME_TITLE, BymlType.String);
    titleNode.value = meta.gameTitle;
  }

  getBytes() {
    return this.writer.getBytes();
  }

  getArrayBuffer() {
    return this.writer.getArrayBuffer();
  }

  saveAs(filename: string) {
    this.writer.saveAs(filename);
  }

}