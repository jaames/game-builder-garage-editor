export class GameThumbnail {

  public jpegData: Uint8Array;

  constructor(jpegData: Uint8Array) {
    this.jpegData = jpegData;
  }

  public getBlob() {
    return new Blob([this.jpegData], { type: 'image/jpeg' });
  }

  public getUrl() {
    const blob = this.getBlob();
    return URL.createObjectURL(blob);
  }

}