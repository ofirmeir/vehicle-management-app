import Vehicle from "../models/Vehicle";
import BaseRepository, { Constructor } from "./BaseRepository";

export function AddVehicleRepository<TBase extends Constructor<BaseRepository>>(
  Base: TBase,
) {
  return class extends Base {
    getVehicles() {
      return Vehicle.findAll({
        limit: this.defaultLimit,
      });
    }

    getVehicle(id: number) {
      return Vehicle.findByPk(id);
    }

    createVehicle(vehicleAttributes: {
      license_plate: string;
      status: string;
    }) {
      return Vehicle.create(vehicleAttributes);
    }

    async updateVehicle(
      id: number,
      vehicleAttributes: { license_plate?: string; status?: string },
    ) {
      const vehicleToUpdate = await this.getVehicle(id);
      if (!vehicleToUpdate) {
        throw new Error("Vehicle not found");
      }

      const definedVehicleAttributes = Object.fromEntries(
        Object.entries(vehicleAttributes).filter(([_, v]) => v !== undefined),
      );
      vehicleToUpdate.set(definedVehicleAttributes);
      await vehicleToUpdate.save();
      return vehicleToUpdate;
    }

    deleteVehicle(id: number) {
      return Vehicle.destroy({
        where: {
          id,
        },
      });
    }
  };
}
