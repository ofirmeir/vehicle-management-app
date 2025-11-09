import { createServer } from "./server";
import repository from "./data/repository";

const server = createServer();

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  try {
    await repository.sequelizeClient.sync();
    console.log("Successfully migrated tables to the database.");
    // Optionally seed DB on startup when SEED_DB=true
    if (process.env.SEED_DB === "true") {
      try {
        // Dynamically import the seeder module so it runs on import (ESM-friendly)
        await import("./seed.js");
        console.log("Database seeded on startup (SEED_DB=true).");
      } catch (seedErr) {
        console.error("Seeding on startup failed:", seedErr);
      }
    }
  } catch (error) {
    console.log("Failed to migrate tables to the database");
    console.log(error);
  }

  console.log(`Server is running on port ${port}`);
});
