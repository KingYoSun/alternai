import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import bodyParser from "body-parser";
import AiGenerateImageRequest from "./api/AiGenerateImage";
import { z, type AnyZodObject } from "zod";
import { NovelAiApi } from "shared";

const dataSchema = (schema): any =>
  z.object({
    body: schema,
  });

const validate =
  (schema: AnyZodObject) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> => {
    try {
      await schema.passthrough().parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
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
  () => {
    validate(dataSchema(NovelAiApi.AiGenerateImageRequestSchema));
  },
  (req: Request, res: Response): void => {
    AiGenerateImageRequest(req.body)
      .then((body) => res.status(body.status).send(body.message))
      .catch((e) => {
        throw e;
      });
  },
);

app.listen(port, () => {
  console.log(`Express app is listening on port ${port}`);
});
