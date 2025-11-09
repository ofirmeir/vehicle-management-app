import { readFile } from "fs/promises";
import path from "path";
import repository from "./data/repository";
import Vehicle from "./data/models/Vehicle";

type SeedVehicle = {
  licensePlate: string;
  status: string;
  createdAt?: string;
};

(async function main() {
  try {
    const filePath = path.resolve(__dirname, "..", "vehicles.json");
    const raw = await readFile(filePath, "utf8");
    const vehicles: SeedVehicle[] = JSON.parse(raw);

    // ensure DB and tables are available
    await repository.sequelizeClient.sync();

    for (const v of vehicles) {
      const license_plate = v.licensePlate;
      const status = v.status;
      const created_at = v.createdAt ? new Date(v.createdAt) : undefined;

      const existing = await Vehicle.findOne({ where: { license_plate } });
      if (existing) {
        console.log(`skip existing: ${license_plate}`);
        continue;
      }

      const data: any = { license_plate, status };
      if (created_at) data.created_at = created_at;

      await Vehicle.create(data);
      console.log(`inserted: ${license_plate}`);
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
})();
