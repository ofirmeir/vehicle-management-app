import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

export const createServer = () => {
  const app = express();
  app.disable("x-powered-by");
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "OK" });
    app.use(express.urlencoded());
  });

  return app;
};
