import {
  BymlReader,
  BymlType,
  BymlHash,
  BymlNode,
  getNode
} from '../Byml';

import { GameKey as Key } from './GameBymlKeys';
import { GameThumbnail } from './GameThumbnail';
import { GameMetaExtended } from './GameMeta';

import {
  ActorType,
  Nodon,
  NodonFactory,
  Connection,
  Texture,
  NodonI32Props,
  NodonU32Props,
  NodonF32Props,
  NodonU64Props
} from '../../objects';
import { assert } from '../../utils';

export class GameFileReader extends BymlReader {

  public formatVersion: number;
  public fileNode: BymlHash | null = null;

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    assert(this.rootNode !== null, 'Root node is missing');
    assert(this.rootNode.type === BymlType.Hash, 'Root node must be a hash node');
    // root node is always a hash node with one item, which is the crc32 hash of the filename w/o the extension
    const projectNode = [...this.rootNode.hashMap.values()][0];
    //  project node contains a couple of sub-nodes, not sure why
    const fileHolder =   getNode(projectNode, Key.mFileHolder, BymlType.Hash);
    const fileNode =     getNode(fileHolder,  Key.mFile,       BymlType.Hash);
    this.formatVersion = getNode(projectNode, Key.mVersion,    BymlType.Uint).value;
    // only format ver 1 is known / supported!
    assert(this.formatVersion === 1, `Format version not recognized`);
    this.fileNode = fileNode;
  }

  public getMetaData(): GameMetaExtended {
    const dataNode = this.fileNode;
    const isEmpty =        getNode(dataNode, Key.mEmpty,            BymlType.Bool).value;
    const version =        getNode(dataNode, Key.mVersion,          BymlType.Uint).value;
    const name =           getNode(dataNode, Key.mName,             BymlType.String).value;
    const gameId =         getNode(dataNode, Key.mGameCode,         BymlType.String).value;
    const authorId =       getNode(dataNode, Key.mAuthorCode,       BymlType.String).value;
    const authorName =     getNode(dataNode, Key.mAuthorName,       BymlType.String).value;
    const isFavorite =     getNode(dataNode, Key.mFavorite,         BymlType.Bool).value;
    const isFileLock =     getNode(dataNode, Key.mFileLock,         BymlType.Bool).value;
    const isDownload =     getNode(dataNode, Key.mDownload,         BymlType.Bool).value;
    const originId =       getNode(dataNode, Key.mOriginCode,       BymlType.String).value;
    const lang =           getNode(dataNode, Key.mLang,             BymlType.String).value;
    const numNodon =       getNode(dataNode, Key.mNodeNum,          BymlType.Int).value;
    const numConnections = getNode(dataNode, Key.mConnectionNum,    BymlType.Int).value;
    const idHistSize =     getNode(dataNode, Key.mShareCodeHistNum, BymlType.Int).value;
    const idHistArray =    getNode(dataNode, Key.mShareCodeHist,    BymlType.Array);
    
    const gameIdHistory = [];
    for (let i = 0; i < idHistSize; i++) {
      const stringNode =  getNode(idHistArray, i, BymlType.String);
      gameIdHistory.push(stringNode.value);
    }

    // const keyer = getNode(dataNode, Key.mChangeFileKeyThisFile, BymlType.Hash);
    // console.log(keyer);

    // const changeFileKeyTo = getNode(dataNode, Key.mChangeFileKeyTo, BymlType.Array);
    // console.log(changeFileKeyTo.children.map(node => {
    //   return getNode(node, Key.mText, BymlType.String).value
    // }));

    const createTime = this.parseTimestamp(dataNode, Key.mCreateTime);
    const editTime =   this.parseTimestamp(dataNode, Key.mEditTime);

    return {
      isEmpty,
      version,
      name,
      gameId,
      authorId,
      authorName,
      isFavorite,
      isFileLock,
      isDownload,
      originId,
      gameIdHistory,
      lang,
      numNodon,
      numConnections,
      createTime,
      editTime,
      gameIdHistorySize: idHistSize
    };
  }

  public getThumbnail() {
    const thumbnailSize = getNode(this.fileNode, Key.mThumbnailImageByteSize, BymlType.Uint).value;
    const thumbnailNode = getNode(this.fileNode, Key.mThumbnailImageJPG, BymlType.Binary);
    const buffer = thumbnailNode.value;
    return new GameThumbnail(buffer.slice(0, thumbnailSize));
  }

  public getTextureEditorPalette() {
    const paletteNode = getNode(this.fileNode, Key.mPalletColors, BymlType.Hash);
    const result: [string, number, number, number, number][] = [];
    const keyOrder = [
      Key.mPalletColors_0, Key.mPalletColors_1, Key.mPalletColors_2, 
      Key.mPalletColors_3, Key.mPalletColors_4, Key.mPalletColors_5, 
      Key.mPalletColors_6, Key.mPalletColors_7, Key.mPalletColors_8,
    ];
    for (let i = 0; i < keyOrder.length; i++) {
      const color = getNode(paletteNode, keyOrder[i], BymlType.Uint).value;
      result.push([
        keyOrder[i],
        (color >> 24) & 0xFF,
        (color >> 16) & 0xFF,
        (color >> 8) & 0xFF,
        color & 0xFF,
      ]);
    }
    return result;
  }

  public getTextures() {
    const listNode = getNode(this.fileNode, Key.mTexture, BymlType.Array);
    return listNode.children
      .map((textureNode, i) => {
        const pixelData = getNode(textureNode, Key.mBinary, BymlType.Binary).value;
        const isUsed =    getNode(textureNode, Key.mUse,    BymlType.Bool).value;
        return isUsed ? new Texture(pixelData, i) : null;
      })
      .filter((texture) => texture !== null);
  }

  public getTextNodonStrings() {
    const listRoot = getNode(this.fileNode, Key.mCommentRigid, BymlType.Array);
    return listRoot.children.map((textNode: BymlHash) => this.parseStringEntry(textNode));
  }

  public getCommentNodonStrings() {
    const listRoot = getNode(this.fileNode, Key.mComment, BymlType.Array);
    return listRoot.children.map((textNode: BymlHash) => this.parseStringEntry(textNode));
  }

  public getConnections() {
    const connectionListNode = getNode(this.fileNode, Key.mConnection,    BymlType.Array);
    const connectionNum =      getNode(this.fileNode, Key.mConnectionNum, BymlType.Int).value;
    const connections = [];
    for (let i = 0; i < connectionNum; i++) {
      const node = getNode(connectionListNode, i, BymlType.Hash);
      const id = getNode(node, Key.mId,  BymlType.Uint).value;
      const a =  getNode(node, Key.mIdA, BymlType.Uint).value;
      const b =  getNode(node, Key.mIdB, BymlType.Uint).value;
      const [nodeId] =       this.parseNodonId(id);
      const [idA, socketA] = this.parseNodonId(a);
      const [idB, socketB] = this.parseNodonId(b);
      connections.push(new Connection(nodeId, idA, socketA, idB, socketB));
    }
    return connections;
  }

  public getNodons() {
    const nodonListNode = getNode(this.fileNode, Key.mNode,    BymlType.Array);
    const nodonNum =      getNode(this.fileNode, Key.mNodeNum, BymlType.Int).value;
    const nodons = [];
    for (let i = 0; i < nodonNum; i++) {
      const node = getNode(nodonListNode, i, BymlType.Hash);
      const nodon = this.parseNodon(node);
      nodons.push(nodon);
    }
    return nodons;
  }

  private parseNodon(node: BymlHash) {
    // id (needs to be divided by 10) and type
    const id =   getNode(node, Key.mId,        BymlType.Uint).value;
    const type = getNode(node, Key.mActorType, BymlType.String).value;
    const nodon = NodonFactory(type as ActorType);
    const [nodeId] = this.parseNodonId(id);
    nodon.id = nodeId;
    // global nodon properties
    const posXY =    this.parseNumberArray(node, Key.mPos);
    const scaleXY =  this.parseNumberArray(node, Key.mScale);
    const posZ =     getNode(node, Key.mZ,      BymlType.Float).value;
    const scaleZ =   getNode(node, Key.mScaleZ, BymlType.Float).value;
    const rotate =   getNode(node, Key.mRotate, BymlType.Float).value;
    const sortIdx =  getNode(node, Key.mOrder,  BymlType.Int).value;
    const isLocked = getNode(node, Key.mLock,   BymlType.Bool).value;
    nodon.canvasPos = [posXY[0], posXY[1], posZ];
    nodon.canvasScale = [scaleXY[0], scaleXY[1], scaleZ];
    nodon.canvasRotate = rotate;
    nodon.canvasSortIndex = sortIdx;
    nodon.isLocked = isLocked;
    // nodon type unique properties
    const propNode = getNode(node, Key.mProperty, BymlType.Hash);
    const propsI32 = this.parseNumberArray(propNode, Key.mS32) as NodonI32Props;
    const propsU32 = this.parseNumberArray(propNode, Key.mU32) as NodonU32Props;
    const propsF32 = this.parseNumberArray(propNode, Key.mF32) as NodonF32Props;
    const propsU64 = this.parseNumberArray<bigint>(propNode, Key.mU64) as NodonU64Props;
    nodon.props.i32 = propsI32;
    nodon.props.u32 = propsU32;
    nodon.props.f32 = propsF32;
    nodon.props.u64 = propsU64;
    const propsVec3 = getNode(propNode, Key.mV3f, BymlType.Array);
    for (let i = 0; i < 4; i++) {
      const vec3Node = getNode(propsVec3, i, BymlType.Array);
      for (let j = 0; j < 3; j++) {
        const value = getNode(vec3Node, j, BymlType.Float).value;
        nodon.props.vec3[i][j] = value;
      }
    }
    return nodon;
  }

  private parseNumberArray<T = number>(node: BymlNode, key: string | number) {
    const foundNode = getNode(node, key, BymlType.Array);
    return foundNode.children.map<T>(childNode => {
      return (childNode as any).value; // sorry
    });
  }

  private parseNodonId(int: number) {
    const id = Math.floor(int / 10);
    const socketId = int % 10;
    return [id, socketId];
  }

  private parseStringEntry(node: BymlHash) {
    const isUsed = getNode(node, Key.mUse, BymlType.Bool).value;
    const text = getNode(node, Key.mText, BymlType.String).value;
    return isUsed ? text : null;
  }

  private parseTimestamp(parent: BymlNode, key: string) {
    const node = getNode(parent, key, BymlType.Array)
    const year =   getNode(node, 0, BymlType.Uint).value;
    const month =  getNode(node, 1, BymlType.Int).value;
    const day =    getNode(node, 2, BymlType.Uint).value;
    const hour =   getNode(node, 3, BymlType.Uint).value;
    const minute = getNode(node, 4, BymlType.Uint).value;
    const second = getNode(node, 5, BymlType.Uint).value;
    const date = new Date;
    date.setFullYear(year);
    date.setMonth(month - 1); // js Date months start at 0
    date.setDate(day);
    date.setHours(hour, minute, second);
    return date;
  }
}