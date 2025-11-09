import { Express } from "express";
import { createVehicleRoutes } from "./vehicle";

export const createRoutes = (app: Express) => {
  createVehicleRoutes(app);
};
