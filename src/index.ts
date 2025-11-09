import { createServer } from "./server";
import repository from "./data/repository";

const server = createServer();

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  try {
    await repository.sequelizeClient.sync();
    console.log("Successfully migrated tables to the database.");
  } catch (error) {
    console.log("Failed to migrate tables to the database");
    console.log(error);
  }

  console.log(`Server is running on port ${port}`);
});
