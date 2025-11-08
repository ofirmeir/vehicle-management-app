import { createServer } from "./server";

const server = createServer();

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
