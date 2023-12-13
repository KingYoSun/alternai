import express, {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import bodyParser from "body-parser";
import AiGenerateImageRequest from "./api/AiGenerateImage";
import { z, type AnyZodObject } from "zod";
import { NovelAiApi } from "shared";
import cors from "cors";
import RedisCli from "./client/redis";

const dataSchema = (schema): any =>
  z.object({
    body: schema,
  });

const validate =
  async (schema: AnyZodObject) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> => {
    console.log("validation start");
    try {
      await schema.passthrough().parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e) {
      return e;
    }
  };

const app: express.Express = express();
const port = 8090;

app.use(
  cors({
    origin: "http://localhost:5173", // アクセス許可するオリジン
    credentials: true, // レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, // レスポンスstatusを200に設定
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_req, res: Response) => {
  res.send("Status is Healthy");
});

app.get("/redis", (async (_req, res: Response) => {
  await new RedisCli().init();
  res.status(200).send("connected!");
}) as RequestHandler);

app.post("/post-test", (req: Request, res: Response) => {
  console.log(`PostTest!: ${JSON.stringify(req.body)}`);
  res.send(`Received: ${JSON.stringify(req.body)}`);
});

app.post("/generate-image", (req: Request, res: Response): void => {
  console.log("validation step...");
  validate(dataSchema(NovelAiApi.AiGenerateImageRequestSchema))
    .then(() => {
      AiGenerateImageRequest(req.body)
        .then((body) => res.status(body.status).send(body.message))
        .catch((e) => {
          throw e;
        });
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

app.listen(port, () => {
  console.log(`Express app is listening on port ${port}`);
});
