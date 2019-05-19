import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import { useReqLogging } from "./middleware";

const app = express();

const port = process.env.port || 3000;

app.use(helmet());
app.use(bodyParser.json());
app.use(useReqLogging());

app.get("/", (_req, res) => {
    res.status(200).send({
        status: res.statusCode,
    });
});

app.listen(port, async () => {
    console.info(`Server listening on port ${port}`);
});
