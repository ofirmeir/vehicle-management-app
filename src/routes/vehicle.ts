import { Express, Request, Response } from "express";
import repository from "../data/repository";

const statusChange = (current?: string, next?: string): boolean => {
  // If current status is "Maintenance" only allow transition to "Available"
  if (current === "Maintenance" && current !== next) {
    return next === "Available";
  }
  // All other transitions allowed
  return true;
};

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
    const vehicle = await repository.createVehicle(vehiclePayload);
    res.json({
      vehicle,
    });
  });

  app.put("/vehicles/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    // fetch existing vehicle to validate status transition
    const existing = await repository.getVehicle(id);
    if (!existing) {
      return res.status(404).json({
        error: { message: "Vehicle not found" },
      });
    }

    const vehiclePayload = {
      license_plate: req.body.license_plate,
      status: req.body.status,
    };

    // validate status change according to statusChange logic
    if (!statusChange(existing.status, vehiclePayload.status)) {
      return res.status(400).json({
        error: {
          message: `Invalid status change from '${existing.status}' to '${vehiclePayload.status}'.`,
        },
      });
    }

    const vehicle = await repository.updateVehicle(
      parseInt(req.params.id),
      vehiclePayload,
    );
    res.json({
      vehicle,
    });
  });

  app.delete("/vehicles/:id", async (req: Request, res: Response) => {
    const result = await repository.deleteVehicle(parseInt(req.params.id));
    res.json({
      vehicle_deleted: result,
    });
  });
};
