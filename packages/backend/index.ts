import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import AiGenerateImageRequest from "./api/AiGenerateImage";
import { z, AnyZodObject } from "zod";
import { NovelAiApi } from "shared";

const dataSchema = (schema) =>
  z.object({
    body: schema,
  });

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.passthrough().parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (e) {
      return res.status(400).send(e);
    }
  };

const app: express.Express = express();
const port = 8090;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_req, res: Response) => {
  res.send("Status is Healthy");
});

app.post("/post-test", (req: Request, res: Response) => {
  console.log(`PostTest!: ${JSON.stringify(req.body)}`);
  res.send(`Received: ${JSON.stringify(req.body)}`);
});

app.post(
  "/generate-image",
  validate(dataSchema(NovelAiApi.AiGenerateImageRequestSchema)),
  async (req: Request, res: Response) => {
    const body = await AiGenerateImageRequest(req.body);
    res.status(body.status).send(body.message);
  },
);

app.listen(port, () => {
  console.log(`Express app is listening on port ${port}`);
});
