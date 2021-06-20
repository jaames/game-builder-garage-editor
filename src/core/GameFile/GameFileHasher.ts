import crc32 from 'crc-32';

import { GameFile } from './GameFile';
import { Key } from './GameBymlKeys';
import { BymlNode, BymlType, getNode } from '../Byml';
import { BinaryWriter, assert } from '../utils';

export class GameFileHasher {

  public buffer = new BinaryWriter();
  public rootNode: BymlNode = null;

  update(game: GameFile) {
    const rootNode = game._bymlCache;
    assert(rootNode !== null, 'Root node is missing');
    assert(rootNode.type === BymlType.Hash, 'Root node must be a hash node');
    // root node is always a hash node with one item, which is the crc32 hash of the filename w/o the extension
    const projectNode = [...rootNode.hashMap.values()][0];
    this.writeNode(getNode(projectNode, Key.mVersion, BymlType.Uint));
    // traverse to folder node
    const fileHolderNode = getNode(projectNode,    Key.mFileHolder, BymlType.Hash);
    const fileNode =       getNode(fileHolderNode, Key.mFile,       BymlType.Hash);
    this.writeFileNode(fileNode);
  }

  digest() {
    const bytes = this.buffer.getBytes();
    return crc32.buf(bytes) >>> 0;
  }

  writeFileNode(node: BymlNode) {
    // digest metadata
    this.writeGameExtendedMeta(node);
    // digest nodons
    const nodon = getNode(node, Key.mNode, BymlType.Array);
    for (let i = 0; i < nodon.children.length; i++) {
      this.writeNodonEntry(nodon.children[i]);
    }
    // digest connections
    const connections = getNode(node, Key.mConnection, BymlType.Array);
    for (let i = 0; i < connections.children.length; i++) {
      this.writeConnectionEntry(connections.children[i]);
    }
    // digest comments
    const comment = getNode(node, Key.mCommentRigid, BymlType.Array);
    for (let i = 0; i < comment.children.length; i++) {
      this.writeStrEntry(comment.children[i]);
    }
    // digest whatever this is
    const changeFileKeyTo = getNode(node, Key.mChangeFileKeyTo, BymlType.Array);
    for (let i = 0; i < changeFileKeyTo.children.length; i++) {
      this.writeStrEntry(changeFileKeyTo.children[i]);
    }
    // digest textures
    const textures = getNode(node, Key.mTexture, BymlType.Array);
    for (let i = 0; i < textures.children.length; i++) {
      this.writeTextureEntry(textures.children[i]);
    }
    // digest palette 
    const paletteNode = getNode(node, Key.mPalletColors, BymlType.Hash);
    const keyOrder = [
      Key.mPalette_0, Key.mPalette_1, Key.mPalette_2, 
      Key.mPalette_3, Key.mPalette_4, Key.mPalette_5, 
      Key.mPalette_6, Key.mPalette_7, Key.mPalette_8,
    ];
    for (let i = 0; i < keyOrder.length; i++) {
      this.writeNode(getNode(paletteNode, keyOrder[i], BymlType.Uint));
    }
  }

  writeGameExtendedMeta(node: BymlNode) {
    this.writeGameMeta(node);
    this.writeNode(getNode(node, Key.mLastUniqueId, BymlType.Uint));
    this.writeNode(getNode(node, Key.mCanvasPos,    BymlType.Array));
    this.writeNode(getNode(node, Key.mCanvasScale,  BymlType.Float));
    const commentList = getNode(node, Key.mComment, BymlType.Array);
    commentList.children.forEach(subNode => this.writeStrEntry(subNode));
    this.writeNode(getNode(node, Key.mIsSideViewMode,           BymlType.Bool));
    this.writeNode(getNode(node, Key.mOriginCode,               BymlType.String));
    this.writeNode(getNode(node, Key.mShareCodeHist,            BymlType.Array));
    this.writeNode(getNode(node, Key.mArmetLuminanceFlashCount, BymlType.Uint));
    this.writeNode(getNode(node, Key.mArmetRedFlashCount,       BymlType.Uint));
    this.writeNode(getNode(node, Key.mArmetLuminanceFlashFrame, BymlType.Uint));
    this.writeNode(getNode(node, Key.mArmetRedFlashFrame,       BymlType.Uint));
  }

  writeGameMeta(node: BymlNode) {
    this.writeNode(getNode(node, Key.mVersion,                BymlType.Uint));
    this.writeNode(getNode(node, Key.mEmpty,                  BymlType.Bool));
    this.writeNode(getNode(node, Key.mNodeNum,                BymlType.Int));
    this.writeNode(getNode(node, Key.mConnectionNum,          BymlType.Int));
    this.writeNode(getNode(node, Key.mName,                   BymlType.String));
    this.writeNode(getNode(node, Key.mDownload,               BymlType.Bool));
    this.writeNode(getNode(node, Key.mFavorite,               BymlType.Bool));
    this.writeNode(getNode(node, Key.mCreateTime,             BymlType.Array));
    this.writeNode(getNode(node, Key.mEditTime,               BymlType.Array));
    this.writeNode(getNode(node, Key.mFileLock,               BymlType.Bool));
    this.writeNode(getNode(node, Key.mThumbnailImageByteSize, BymlType.Uint));
    this.writeNode(getNode(node, Key.mThumbnailImageJPG,      BymlType.Binary));
    this.writeNode(getNode(node, Key.mGameCode,               BymlType.String));
    this.writeNode(getNode(node, Key.mAuthorCode,             BymlType.String));
    this.writeNode(getNode(node, Key.mAuthorName,             BymlType.String));
    this.writeNode(getNode(node, Key.mShareCodeHistNum,       BymlType.Int));
    this.writeNode(getNode(node, Key.mLang,                   BymlType.String));
  }

  writeStrEntry(node: BymlNode) {
    this.writeNode(getNode(node, Key.mUse,  BymlType.Bool));
    this.writeNode(getNode(node, Key.mText, BymlType.String));
    this.writeNode(getNode(node, Key.mText, BymlType.String));
  }

  writeTextureEntry(node: BymlNode) {
    this.writeNode(getNode(node, Key.mUse,    BymlType.Bool));
    this.writeNode(getNode(node, Key.mBinary, BymlType.Binary));
  }
  
  writeNodonEntry(node: BymlNode) {
    this.writeNode(getNode(node, Key.mActorType, BymlType.String));
    this.writeNode(getNode(node, Key.mId,        BymlType.Uint));
    this.writeNode(getNode(node, Key.mPos,       BymlType.Array));
    this.writeNode(getNode(node, Key.mRotate,    BymlType.Float));
    this.writeNode(getNode(node, Key.mScale,     BymlType.Array));

    const propertyNode = getNode(node, Key.mProperty, BymlType.Hash);
    this.writeNode(getNode(propertyNode, Key.mU32, BymlType.Array));
    this.writeNode(getNode(propertyNode, Key.mS32, BymlType.Array));
    this.writeNode(getNode(propertyNode, Key.mF32, BymlType.Array));
    this.writeNode(getNode(propertyNode, Key.mV3f, BymlType.Array));
    this.writeNode(getNode(propertyNode, Key.mU64, BymlType.Array));

    this.writeNode(getNode(node, Key.mZ,      BymlType.Float));
    this.writeNode(getNode(node, Key.mScaleZ, BymlType.Float));
    this.writeNode(getNode(node, Key.mLock,   BymlType.Bool));
    this.writeNode(getNode(node, Key.mOrder,  BymlType.Int));
  }

  writeConnectionEntry(node: BymlNode) {
    this.writeNode(getNode(node, Key.mId,  BymlType.Uint));
    this.writeNode(getNode(node, Key.mIdA, BymlType.Uint));
    this.writeNode(getNode(node, Key.mIdB, BymlType.Uint));
  }

  writeNode(node: BymlNode) {
    if (node.type === BymlType.Hash) {
      throw new Error('Cannot write BYML hash node directly');
    }
    else if (node.type === BymlType.Array) {
      node.children.forEach(subNode => this.writeNode(subNode));
    }
    else if (node.type === BymlType.String) {
      this.buffer.writeChars(node.value);
    }
    else if (node.type === BymlType.Binary) {
      const bytes = node.value;
      for (let i = 0; i < bytes.length; i++) {
        this.buffer.writeByte(bytes[i]);
      }
    }
    else if (node.type === BymlType.Bool) {
      this.buffer.writeU32(node.value ? 1 : 0);
    }
    else if (node.type === BymlType.Int) {
      this.buffer.writeI32(node.value);
    }
    else if (node.type === BymlType.Float) {
      this.buffer.writeF32(node.value);
    }
    else if (node.type === BymlType.Uint) {
      this.buffer.writeU32(node.value);
    }
    else if (node.type === BymlType.Int64) {
      this.buffer.writeI64(node.value);
    }
    else if (node.type === BymlType.Uint64) {
      this.buffer.writeU64(node.value);
    }
    else if (node.type === BymlType.Double) {
      this.buffer.writeF64(node.value);
    }
  }

}