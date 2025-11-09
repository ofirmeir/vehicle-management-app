import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vehicle Management API",
      version: "1.0.0",
      description: "API documentation for the Vehicle Management service",
    },
    components: {
      schemas: {
        Vehicle: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            license_plate: { type: "string", example: "ABC-123" },
            status: { type: "string", example: "Available" }
          }
        }
      }
    }
  },
  // files containing annotations as above
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
