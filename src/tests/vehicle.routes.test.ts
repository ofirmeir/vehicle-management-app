import { createServer } from "../server";
import repository from "../data/repository";

// Mock the repository so tests don't touch the DB
jest.mock("../data/repository", () => {
  return {
    __esModule: true,
    default: {
      getVehicles: jest.fn(),
      getVehicle: jest.fn(),
      createVehicle: jest.fn(),
      updateVehicle: jest.fn(),
      deleteVehicle: jest.fn(),
      sequelizeClient: { sync: jest.fn() },
    },
  };
});

const mockRepo: any = repository;

describe("Vehicle routes (native fetch)", () => {
  const app = createServer();
  let server: any;
  let baseUrl: string;

  beforeAll(
    () =>
      new Promise<void>((resolve) => {
        server = app.listen(0, () => {
          const addr = server.address();
          const port = typeof addr === "object" && addr ? addr.port : 3000;
          baseUrl = `http://127.0.0.1:${port}`;
          resolve();
        });
      }),
  );

  afterAll(
    () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  async function getJson(path: string) {
    const res = await fetch(baseUrl + path);
    return { status: res.status, body: await res.json() };
  }

  async function postJson(path: string, payload: any) {
    const res = await fetch(baseUrl + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { status: res.status, body: await res.json() };
  }

  async function putJson(path: string, payload: any) {
    const res = await fetch(baseUrl + path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { status: res.status, body: await res.json() };
  }

  async function deleteJson(path: string) {
    const res = await fetch(baseUrl + path, { method: "DELETE" });
    return { status: res.status, body: await res.json() };
  }

  it("returns health check", async () => {
    const res = await getJson("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "OK" });
  });

  it("GET /vehicles returns vehicles", async () => {
    const vehicles = [{ id: 1, license_plate: "ABC123", status: "Available" }];
    mockRepo.getVehicles.mockResolvedValue(vehicles);

    const res = await getJson("/vehicles");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ vehicles });
    expect(mockRepo.getVehicles).toHaveBeenCalled();
  });

  it("GET /vehicles/:id returns a vehicle", async () => {
    const vehicle = { id: 4, license_plate: "XYZ123", status: "InUse" };
    mockRepo.getVehicle.mockResolvedValue(vehicle);

    const res = await getJson("/vehicles/4");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ vehicle });
    expect(mockRepo.getVehicle).toHaveBeenCalledWith(4);
  });

  it("POST /vehicles creates a vehicle", async () => {
    const payload = { license_plate: "XYZ124", status: "Maintenance" };
    const created = { id: 5, ...payload };
    mockRepo.createVehicle.mockResolvedValue(created);

    const res = await postJson("/vehicles", payload);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ vehicle: created });
    expect(mockRepo.createVehicle).toHaveBeenCalledWith(payload);
  });

  it("PUT /vehicles/:id rejects invalid status change from Maintenance to InUse", async () => {
    const existing = { id: 4, license_plate: "XYZ123", status: "Maintenance" };
    mockRepo.getVehicle.mockResolvedValue(existing);

    const res = await putJson("/vehicles/4", {
      license_plate: "XYZ123",
      status: "InUse",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    const body: any = res.body;
    expect(body.error.message).toContain("Invalid status change");
  });

  it("PUT /vehicles/:id allows Maintenance -> Available and updates", async () => {
    const existing = { id: 4, license_plate: "XYZ123", status: "Maintenance" };
    const updated = { id: 4, license_plate: "XYZ123", status: "Available" };
    mockRepo.getVehicle.mockResolvedValue(existing);
    mockRepo.updateVehicle.mockResolvedValue(updated);

    const res = await putJson("/vehicles/4", {
      license_plate: "XYZ123",
      status: "Available",
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ vehicle: updated });
    expect(mockRepo.updateVehicle).toHaveBeenCalledWith(4, {
      license_plate: "XYZ123",
      status: "Available",
    });
  });

  it("DELETE /vehicles/:id rejects deletion when status is not Available", async () => {
    const existing = { id: 4, license_plate: "XYZ123", status: "InUse" };
    mockRepo.getVehicle.mockResolvedValue(existing);

    const res = await deleteJson("/vehicles/4");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    const body: any = res.body;
    expect(body.error.message).toContain(
      "Only vehicles with status 'Available' can be deleted",
    );
  });

  it("DELETE /vehicles/:id deletes when status is Available", async () => {
    const existing = { id: 4, license_plate: "XYZ123", status: "Available" };
    mockRepo.getVehicle.mockResolvedValue(existing);
    mockRepo.deleteVehicle.mockResolvedValue(1);

    const res = await deleteJson("/vehicles/4");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ vehicle_deleted: 1 });
    expect(mockRepo.deleteVehicle).toHaveBeenCalledWith(4);
  });
});
