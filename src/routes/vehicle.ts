import { Express, Request, Response } from "express";
import repository from "../data/repository";

export const createVehicleRoutes = (app: Express) => {
  app.get("/vehicles", async (req: Request, res: Response) => {
    const vehicles = await repository.getVehicles();
    res.json({
      vehicles,
    });
  });

  app.get("/vehicles/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const vehicle = await repository.getVehicle(id);
    res.json({
      vehicle,
    });
  });

  app.post("/vehicles", async (req: Request, res: Response) => {
    const vehiclePayload = {
      license_plate: req.body.license_plate,
      status: req.body.status,
    };
    try {
      const vehicle = await repository.createVehicle(vehiclePayload);
      res.json({
        vehicle,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: {
          message:
            error instanceof Error
              ? error.message
              : "There was an error creating a vehicle",
        },
      });
    }
  });

  app.put("/vehicles/:id", async (req: Request, res: Response) => {
    const vehiclePayload = {
      license_plate: req.body.license_plate,
      status: req.body.status,
    };
    try {
      const vehicle = await repository.updateVehicle(
        parseInt(req.params.id),
        vehiclePayload,
      );
      res.json({
        vehicle,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: {
          message:
            error instanceof Error
              ? error.message
              : "There was an error updating the vehicle",
        },
      });
    }
  });

  app.delete("/vehicles/:id", async (req: Request, res: Response) => {
    const result = await repository.deleteVehicle(parseInt(req.params.id));
    res.json({
      vehicle_deleted: result,
    });
  });
};
