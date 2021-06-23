// TODO: FIX ME

import { BinaryWriter } from './BinaryWriter';
// import { assertBrowserEnv } from '../utils';
import { LzwCompressor } from './LwzCompressor';

/**
 * GIF RGBA palette color definition
 */
export type GifPaletteColor = [
   /** Red (0 to 255) */
   number,
   /** Green (0 to 255) */
   number,
   /** Blue (0 to 255) */
   number,
   /** Alpha (0 to 255) */
   number
];

/**
 * Optional GIF encoder settings
 */
export interface GifImageSettings {
  /** Use transparency */
  transparentBg: boolean;
  /** Delay between animated GIF frames, measured in milliseconds */
  delay: number;
  /** Color depth as bits per pixel. Defaults to 8 */
  colorDepth: number;
  /** -1 = no repeat, 0 = repeat forever. Anything else is repeat count */
  repeat: number;
};

/** 
 * GIF image encoder
 * 
 * Supports static single-frame GIF export as well as animated GIF
 * @category File Encoder
 */
export class GifImage extends BinaryWriter {

  /**
   * Default GIF encoder settings
   */
  static defaultSettings: GifImageSettings = {
    transparentBg: false,
    delay: 100,
    repeat: -1,
    colorDepth: 8
  };

  mimeType = 'gif/image';
  /** Image width */
  width: number;
  /** Image height */
  height: number;
  /** GIF global RGBA color palette. Max 256 colors, alpha channel is ignored */
  palette: GifPaletteColor[];
  /** GIF image settings, such as whether it should loop, the delay between frames, etc */
  settings: GifImageSettings;
  /** Number of current GIF frames */
  frameCount: number = 0;

  private compressor: LzwCompressor;

  /**
   * Create a new GIF image object
   * @param width image width
   * @param height image height
   * @param settings whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
   */
  constructor(width: number, height: number, settings: Partial<GifImageSettings> = {}) {
    super();
    this.width = width;
    this.height = height;
    this.settings = { ...GifImage.defaultSettings, ...settings };
    this.compressor = new LzwCompressor(width, height, settings.colorDepth);
  }

  /**
   * Add a frame to the GIF image
   * @param pixels Raw pixels to encode, must be an uncompressed 8bit array of palette indices with a size matching image width * image height
   */
  writeFrame(pixels: Uint8Array) {
    if (this.frameCount === 0)
      this.writeFirstFrame(pixels);
    else
      this.writeAdditionalFrame(pixels);
    this.frameCount += 1;
  }

  private writeFirstFrame(pixels: Uint8Array) {
    const paletteSize = this.palette.length;
    // calc colorDepth
    for (var p = 1; 1 << p < paletteSize; p += 1)
      continue;

    this.settings.colorDepth = p;
    this.writeHeader();
    this.writeColorTable();
    this.writeNetscapeExt();
    this.writeFrameHeader();
    this.writePixels(pixels);
  }

  private writeAdditionalFrame(pixels: Uint8Array) {
    this.writeFrameHeader();
    this.writePixels(pixels);
  }

  private writeHeader() {
    this.writeChars('GIF89a');
    // Logical Screen Descriptor
    this.writeU16(this.width);
    this.writeU16(this.height);
    this.writeU8(
      0x80 | // 1 : global color table flag = 1 (gct used)
      (this.settings.colorDepth - 1) // 6-8 : gct size
    );
    this.writeU8(0);
    this.writeU8(0);
  }

  private writeColorTable() {
    const palette = new Uint8Array(3 * Math.pow(2, this.settings.colorDepth));
    let ptr = 0;
    for(let index = 0; index < this.palette.length; index += 1) {
      const [r, g, b, a] = this.palette[index];
      palette[ptr++] = r;
      palette[ptr++] = g;
      palette[ptr++] = b;
    }
    this.writeBytes(palette);
  }

  private writeNetscapeExt() {
    this.writeBytes([
      0x21, // extension introducer
      0xFF, // app extension label
      11, // block size
    ]);
    this.writeChars('NETSCAPE2.0');
    this.writeU8(3); // subblock size
    this.writeU8(1); // loop subblock id
    this.writeU16(this.settings.repeat); // loop flag
  }

  private writeFrameHeader() {
    // graphics control ext block
    const transparentFlag = this.settings.transparentBg ? 0x1 : 0x0;
    this.writeBytes([
      0x21, // extension introducer
      0xF9, // graphic control label
      0x4, // block size
      0x0 | transparentFlag // bitflags
    ]);
    this.writeU16(this.settings.delay); // loop flag
    this.writeBytes([
      0x0,
      0x0
    ]);
    // image desc block
    this.writeU8(0x2C);
    this.writeU16(0); // image left
    this.writeU16(0); // image top
    this.writeU16(this.width);
    this.writeU16(this.height);
    this.writeU8(0);
  }

  private writePixels(pixels: Uint8Array) {
    this.compressor.colorDepth = this.settings.colorDepth;
    this.compressor.reset();
    this.compressor.encode(pixels, this);
  }

  getUrl() {
    const buffer = this.getArrayBuffer();
    const blob = new Blob([buffer], { type: this.mimeType });
    return URL.createObjectURL(blob);
  }

 /**
   * Returns the GIF image data as an {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image | Image} object
   * 
   * Note: This method does not work outside of browser environments
   */
  getImage(): HTMLImageElement {
    // assertBrowserEnv();
    const img = new Image(this.width, this.height);
    img.src = this.getUrl();
    return img;
  }
}