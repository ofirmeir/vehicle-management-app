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
  /**
   * @openapi
   * /vehicles:
   *   get:
   *     summary: Get all vehicles
   *     tags:
   *       - Vehicles
   *     responses:
   *       200:
   *         description: A list of vehicles
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 vehicles:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Vehicle'
   */
  app.get("/vehicles", async (req: Request, res: Response) => {
    const vehicles = await repository.getVehicles();
    res.json({
      vehicles,
    });
  });

  /**
   * @openapi
   * /vehicles/{id}:
   *   get:
   *     summary: Get a vehicle by id
   *     tags:
   *       - Vehicles
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: A single vehicle
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 vehicle:
   *                   $ref: '#/components/schemas/Vehicle'
   */
  app.get("/vehicles/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const vehicle = await repository.getVehicle(id);
    res.json({
      vehicle,
    });
  });

  /**
   * @openapi
   * /vehicles:
   *   post:
   *     summary: Create a new vehicle
   *     tags:
   *       - Vehicles
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               license_plate:
   *                 type: string
   *                 example: "ABC123"
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Created vehicle
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 vehicle:
   *                   $ref: '#/components/schemas/Vehicle'
   */
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

  /**
   * @openapi
   * /vehicles/{id}:
   *   put:
   *     summary: Update an existing vehicle
   *     tags:
   *       - Vehicles
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               license_plate:
   *                 type: string
   *                 example: "ABC123"
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Updated vehicle
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 vehicle:
   *                   $ref: '#/components/schemas/Vehicle'
   *       400:
   *         description: Invalid status transition
   */
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
    const id = parseInt(req.params.id);

    // fetch existing vehicle to ensure it exists and check status
    const existing = await repository.getVehicle(id);
    if (!existing) {
      return res.status(404).json({
        error: { message: "Vehicle not found" },
      });
    }

    // only allow deletion when status is 'Available'
    if (existing.status !== "Available") {
      return res.status(400).json({
        error: {
          message: `Only vehicles with status 'Available' can be deleted. Current status: '${existing.status}'`,
        },
      });
    }

    const result = await repository.deleteVehicle(id);
    res.json({
      vehicle_deleted: result,
    });
  });
};
