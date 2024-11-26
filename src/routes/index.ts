import express from "express";
import path from "path";
import { Image } from "./../classes/Image";

const routes = express.Router();

function createImage(filename: string, width: string, height: string): Image {
  return new Image(filename, width, height);
}

routes.get("/images", async (req: express.Request, res: express.Response) => {
  try {
    await Image.check(
      req.query.filename as string,
      req.query.width as string,
      req.query.height as string,
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
    return;
  }

  const img = createImage(
    req.query.filename as string,
    req.query.width as string,
    req.query.height as string,
  );

  if (!(await Image.checkExistence(img.getThumbPath()))) {
    try {
      await img.resizeImage();
      res.status(201).sendFile(path.resolve(img.getThumbPath()));
    } catch (err) {
      console.log(err);
      res.status(500).send("failed to resise image");
    }
  } else {
    console.log("AICI");
    res.status(200).sendFile(path.resolve(img.getThumbPath()));
  }
});

export default routes;
