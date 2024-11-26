import { Image } from "./../../classes/Image";
import { promises as fs } from "fs";
import sharp from "sharp";

describe("get paths methods", () => {
  const img = new Image("test", "300", "300");

  it("should return original path", () => {
    expect(img.getOriginalPath()).toEqual("./assets/full/test.jpg");
  });

  it("should return thumb path", () => {
    expect(img.getThumbPath()).toEqual("./assets/thumb/test_300_300.jpg");
  });
});

describe("check validity", () => {
  it('should return "missing filename" error', async () => {
    await expectAsync(Image.check("", "2", "3")).toBeRejectedWith(
      new Error("missing filename"),
    );
  });

  it("should check for negative height", async () => {
    await expectAsync(Image.check("test", "2", "-3")).toBeRejectedWith(
      new Error("wrong height"),
    );
  });

  it("should check for NaN values for width", async () => {
    await expectAsync(Image.check("test", "a", "3")).toBeRejectedWith(
      new Error("wrong width"),
    );
  });

  it("should check for too large values for width", async () => {
    await expectAsync(Image.check("test", "10000", "3")).toBeRejectedWith(
      new Error("wrong width"),
    );
  });

  it('should return "no such file"', async () => {
    await expectAsync(Image.check("test", "100", "300")).toBeRejectedWith(
      new Error("no such file"),
    );
  });

  it("should be fine if image exists", async () => {
    spyOn(Image, "checkExistence").and.returnValue(
      new Promise<true>((solve) => solve(true)),
    );
    await expectAsync(Image.check("test", "100", "300")).toBeResolved();
  });
});

describe("check image existance", () => {
  it("should return true", async () => {
    await fs.writeFile(`${Image.THUMB_PATH}/test_300_300.jpg`, "");
    expect(
      await Image.checkExistence(`${Image.THUMB_PATH}/test_300_300.jpg`),
    ).toBeTrue();
    await fs.unlink(`${Image.THUMB_PATH}/test_300_300.jpg`);
  });

  it("should return false", async () => {
    expect(
      await Image.checkExistence(`${Image.THUMB_PATH}/test_300_300.jpg`),
    ).toBeFalse();
  });
});

describe("check image creation", () => {
  const img = new Image("test", "300", "300");

  beforeAll(async () => {
    const image =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0" +
      "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO" +
      "3gAAAABJRU5ErkJggg==";
    // strip off the data: url prefix to get just the base64-encoded bytes
    const data = image.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(data, "base64");
    await fs.writeFile(`${Image.SOURCE_PATH}/test.jpg`, buf);
  });

  afterAll(async () => {
    sharp.cache(false);
    await fs.unlink(`${Image.SOURCE_PATH}/test.jpg`);
    await fs.unlink(`${Image.THUMB_PATH}/test_300_300.jpg`);
    sharp.cache(true);
  });

  it("should create img with 300 height & width", async () => {
    await img.resizeImage();
    const result = sharp(`${Image.THUMB_PATH}/test_300_300.jpg`);
    const { info } = await result.png().toBuffer({ resolveWithObject: true });
    expect(info.width).toBe(300);
    expect(info.height).toBe(300);
  });
});