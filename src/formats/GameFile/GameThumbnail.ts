export class GameThumbnail {

  get [Symbol.toStringTag]() { return 'Thumbnail Image' };

  jpegData: Uint8Array;

  constructor(jpegData: Uint8Array) {
    this.jpegData = jpegData;
  }

  getBlob() {
    return new Blob([this.jpegData], { type: 'image/jpeg' });
  }

  getUrl() {
    const blob = this.getBlob();
    return URL.createObjectURL(blob);
  }

}