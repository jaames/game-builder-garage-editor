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
    const fileHolder = getNode(projectNode, Key.FILE_HOLDER, BymlType.Hash);
    const fileNode = getNode(fileHolder,    Key.FILE, BymlType.Hash);
    this.patchMetaNodes(fileNode);
    return rootNode;
  }

  patchMetaNodes(fileNode: BymlHash) {
    // TODO: for title edits, we need to patch the cached title in the LgcTpb.bin as well
    // const meta = this.game.meta;
    // const titleNode = getNode(fileNode, Key.GAME_TITLE, BymlType.String);
    // titleNode.value = meta.gameTitle;
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