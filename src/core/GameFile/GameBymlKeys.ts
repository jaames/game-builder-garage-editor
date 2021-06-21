export enum Key {
  // root node content
  mVersion = '79823569', // mVersion.u32
  mFileHolder = 'adaf3055', // mFileHolder
  // file node
  mFile = 'aa6902d3', // mFile
  // file meta (also uses mVersion)
  mEmpty = 'b716818e', // mEmpty.bool
  mName = '6404e56c', // mName.Str
  mGameCode = '62f3087b', // mGameCode.Str
  mAuthorCode = 'e2783c35', // mAuthorCode.Str
  mAuthorName = 'e4d0371', // mAuthorName.Str
  mFavorite = '29a36d10', // mFavorite_bool
  mFileLock = 'cc3bc69f', // mFileLock.bool
  mDownload = 'd2554f13', // mDownload.bool
  mOriginCode = '1235b61b', // mOriginCode.Str
  mLang = 'da75c3df', // mLang.Str
  mEditTime = '4aaddc4f', // mEditTime.CalendarTime
  mCreateTime = 'fcf9a281', // mCreateTime.CalendarTime
  mNodeNum = 'f4e1a3f4', // mNodeNum.s32
  mConnectionNum = '4f3aa598', // mConnectionNum.s32
  mThumbnailImageJPG = '4c0ff1a4', // mThumbnailImageJPG.Binary
  mThumbnailImageByteSize = 'c7d2cec', // mThumbnailImageByteSize.u32
  mShareCodeHistNum = 'b2e9bf5a', // mShareCodeHistNum.s32
  mShareCodeHist = '62661e51', // mShareCodeHist[].Str
  // file content
  mComment = 'e20a4a95', // mComment[]
  mCommentRigid = '2eb62a0a', // mCommentRigid[]
  mPalletColors = '6efa44f5', // mPalletColors (yes, Nintendo misspelled it)
  mTexture = 'cd9f2f3d', // mTexture[]
  mNode = 'eff0b992', //  mNode[]
  mConnection = 'd2a89f4c', // mConnection[]
  mLastUniqueId = 'd8e6683', // mLastUniqueId.u32
  mChangeFileKeyTo = 'd8d2c761', // mChangeFileKeyTo[]
  mChangeFileKeyThisFile = 'f2357dbb', // mChangeFileKeyThisFile
  mIsSideViewMode = '39ce726f', // mIsSideViewMode.bool
  mCanvasPos = 'cc66c4f6', // mCanvasPos.V2f
  mCanvasScale = '83378fc0', // mCanvasScale.f32
  mArmetRedFlashFrame = '7a4e3d68', // mArmetRedFlashFrame.u32
  mArmetRedFlashCount = '9fe2289c',  // mArmetRedFlashCount.u32
  mArmetLuminanceFlashFrame = 'b2276b2', // mArmetLuminanceFlashFrame.u32
  mArmetLuminanceFlashCount = 'ee8e6346', // mArmetLuminanceFlashCount.u32
  // string entry
  mUse = 'd96ea34b', // mUse.bool
  mText = '73abc186', // mText.Str
  // texture entry (also uses mUse)
  mBinary = '3c774805', // mBinary.Binary
  // favorite palette color
  mPalletColors_0 = '4ea12842', // mPalletColors[0].C4u8
  mPalletColors_1 = 'e8d623f6', // mPalletColors[1].C4u8
  mPalletColors_2 = 'd93e396b', // mPalletColors[2].C4u8
  mPalletColors_3 = '7f4932df', // mPalletColors[3].C4u8
  mPalletColors_4 = 'baee0c51', // mPalletColors[4].C4u8
  mPalletColors_5 = '1c9907e5', // mPalletColors[5].C4u8
  mPalletColors_6 = '2d711d78', // mPalletColors[6].C4u8
  mPalletColors_7 = '8b0616cc', // mPalletColors[7].C4u8
  mPalletColors_8 = '7d4e6625', // mPalletColors[8].C4u8

  // connections
  mId = '1d833e74', // mId.u32
  mIdA = '27c2201a', // mIdA.u32
  mIdB = '60625aca', // mIdB.u32
  // nodon (also uses mId)
  mActorType = 'c97982da', // mActorType.Enum
  mPos = '2bb4be37', // mPos.V2f
  mZ = '47003162', // mZ.f32
  mScale = 'b0705703', // mScale.V2f
  mScaleZ = '8dcc7ee1', // mScaleZ.f32
  mRotate = '3a4d462d', // mRotate.f32
  mOrder = 'a6f9c289', // mOrder.s32
  mProperty = '5c83d3bc', // mProperty
  mLock = '24a774b8', // mLock.bool
  // nodon properties
  mS32 = '34deb31a', // mS32[].s32
	mU32 = '4349b622', // mU32[].u32
	mF32 = 'c864d5bf', // mF32[].f32
	mV3f = 'fb532a17', // mV3f[].V3f
	mU64 = 'fc6ddc0c', // mU64[].u64
};