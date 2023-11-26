import express from "express";

const app: express.Express = express();
const port = 8090;

app.get("/", (_req, res) => {
  res.send("Healthy");
});

app.listen(port, () => {
  console.log(`Express app is listening on port ${port}`);
});
