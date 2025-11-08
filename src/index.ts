import { createServer } from "./server";
import repository from "./data/repository";

const server = createServer();

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  try {
    await repository.sequelizeClient.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error);
  }

  console.log(`Server is running on port ${port}`);
});
