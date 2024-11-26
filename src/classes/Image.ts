import sharp from "sharp";
import { promises as fs } from "fs";

export class Image {
  static SOURCE_PATH = "./assets/full";
  static THUMB_PATH = "./assets/thumb";

  filename: string;
  width: number;
  height: number;

  getOriginalPath(): string {
    return `${Image.SOURCE_PATH}/${this.filename}.jpg`;
  }

  getThumbPath(): string {
    return `${Image.THUMB_PATH}/${this.filename}_${this.width}_${this.height}.jpg`;
  }

  static async checkExistence(path: string): Promise<boolean> {
    try {
      await fs.readFile(`${path}`, "utf8");
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static checkWidthHeight(x: string): boolean {
    const value = parseInt(x);
    if (Number.isNaN(value) || value < 0 || value > 5000) {
      return false;
    }
    return true;
  }

  static async check(
    filename: string,
    width: string,
    height: string,
  ): Promise<void> {
    if (filename === undefined || filename === "") {
      throw new Error("missing filename");
    }
    if (!Image.checkWidthHeight(width)) {
      throw new Error("wrong width");
    }
    if (!Image.checkWidthHeight(height)) {
      throw new Error("wrong height");
    }
    if (!(await Image.checkExistence(`${Image.SOURCE_PATH}/${filename}.jpg`))) {
      throw new Error("no such file");
    }
  }

  async resizeImage(): Promise<void> {
    await sharp(`${this.getOriginalPath()}`)
      .resize(this.width, this.height, { fit: "cover" })
      .toFile(this.getThumbPath());
  }

  constructor(filename: string, width: string, height: string) {
    this.filename = filename;
    this.width = parseInt(width);
    this.height = parseInt(height);
  }
}
