import supertest from "supertest";
import { promises as fs } from "fs";
import sharp from "sharp";
import app from "../../index";
import { Image } from "./../../classes/Image";

const request = supertest(app);
const THUMB_PATH = "./assets/thumb";

it("should throw error if data is not valid for an image", async () => {
  const response = await request.get("/images");
  expect(response.status).toBe(400);
});

it("should return resisedImage if already existing", async () => {
  await fs.writeFile(`${THUMB_PATH}/test_300_300.jpg`, "");
  spyOn(Image, "checkExistence").and.returnValue(
    new Promise<true>((solve) => solve(true)),
  );
  const response = await request.get(
    "/images?filename=test&width=300&height=300",
  );
  expect(response.status).toBe(200);
  await fs.unlink(`${THUMB_PATH}/test_300_300.jpg`);
});

it("should create new resized image", async () => {
  await createImage();
  const response = await request.get(
    "/images?filename=test&width=300&height=300",
  );
  expect(response.status).toBe(201);
  expect(response.type).toBe("image/jpeg");
  await deleteImages();
});

async function createImage() {
  const image =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0" +
    "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO" +
    "3gAAAABJRU5ErkJggg==";
  const data = image.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  await fs.writeFile(`${Image.SOURCE_PATH}/test.jpg`, buf);
}

async function deleteImages() {
  sharp.cache(false);
  await fs.unlink(`${Image.SOURCE_PATH}/test.jpg`);
  await fs.unlink(`${Image.THUMB_PATH}/test_300_300.jpg`);
  sharp.cache(true);
}
