import express, {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import bodyParser from "body-parser";
import AiGenerateImageRequest from "./api/AiGenerateImage.ts";
import { z, type AnyZodObject } from "zod";
import cors from "cors";
import RedisCli from "./client/redis.ts";
import { SettingsGetRequest, SettingsPutRequst } from "./api/Settings.ts";
import getUserData from "./api/UserData.ts";
import NextcloudCli from "./client/nextcloud/index.ts";
import { SettingsRequestSchema } from "shared/types/Settings.ts";
import { AiGenerateImageRequestSchema } from "shared/types/NovelAiApi/GenImage.ts";

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

const redis = new RedisCli();

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

app.get("/user-data", (async (_req, res: Response) => {
  const userDataRes = await getUserData({ redis });
  res.status(userDataRes.status).send(userDataRes.message);
}) as RequestHandler);

app.get("/settings", (async (_req, res: Response) => {
  const body = await SettingsGetRequest({ redis });

  res.status(body.status).send(body.message);
}) as RequestHandler);

app.put("/settings", (async (req: Request, res: Response) => {
  await validate(dataSchema(SettingsRequestSchema));
  const body = await SettingsPutRequst({ redis, settings: req.body });

  if (body != null) {
    res.status(body.status).send(body.message);
  } else {
    res.status(500).send("response body is null");
  }
}) as RequestHandler);

app.post("/post-test", (req: Request, res: Response) => {
  console.log(`PostTest!: ${JSON.stringify(req.body)}`);
  res.send(`Received: ${JSON.stringify(req.body)}`);
});

app.post("/generate-image", (async (req: Request, res: Response) => {
  await validate(dataSchema(AiGenerateImageRequestSchema));
  const body = await AiGenerateImageRequest({ redis, options: req.body }).catch(
    (e) => {
      res.status(500).send(e);
    },
  );

  if (body != null) {
    res.status(body.status).send(body.message);
  } else {
    res.status(500).send("response body is null");
  }
}) as RequestHandler);

app.get("/nextcloud", (async (_req, res: Response) => {
  try {
    const cli = new NextcloudCli({ redis });
    await cli.init();
    res.status(200).send("Nextcloud is connected");
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
}) as RequestHandler);

app.listen(port, () => {
  console.log(`Express app is listening on port ${port}`);
});
