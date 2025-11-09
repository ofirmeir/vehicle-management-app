import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { createRoutes } from "./routes";
import errorHandler from "./middleware/error-handler";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

export const createServer = () => {
  const app = express();
  app.disable("x-powered-by");
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors());

  // Serve Swagger UI at /api-docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "OK" });
    app.use(express.urlencoded());
  });

  createRoutes(app);

  app.use(errorHandler);
  
  return app;
};
