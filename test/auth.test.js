const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

jest.mock("../db");
const db = require("../db");

// Add beforeAll to set up test environment
beforeAll(() => {
  process.env.JWT = "test-secret-key";
});

describe("/auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new instructor and return token", async () => {
      const mockInstructor = {
        id: 1,
        username: "testuser",
        password: "testpass",
      };

      db.query.mockResolvedValueOnce({ rows: [mockInstructor] });

      const res = await request(app).post("/auth/register").send({
        username: "testuser",
        password: "testpass",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(jwt.verify(res.body.token, process.env.JWT).id).toBe(
        mockInstructor.id
      );
    });

    it("should handle database errors during registration", async () => {
      db.query.mockRejectedValueOnce(new Error("Database error"));

      const res = await request(app).post("/auth/register").send({
        username: "testuser",
        password: "testpass",
      });

      expect(res.statusCode).toBe(500);
    });
  });

  describe("POST /login", () => {
    it("should login existing instructor and return token", async () => {
      const mockInstructor = {
        id: 1,
        username: "testuser",
        password: "testpass",
      };

      db.query.mockResolvedValueOnce({ rows: [mockInstructor] });

      const res = await request(app).post("/auth/login").send({
        username: "testuser",
        password: "testpass",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(jwt.verify(res.body.token, process.env.JWT).id).toBe(
        mockInstructor.id
      );
    });

    it("should return 401 for invalid credentials", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).post("/auth/login").send({
        username: "wronguser",
        password: "wrongpass",
      });

      expect(res.statusCode).toBe(401);
    });

    it("should handle database errors during login", async () => {
      db.query.mockRejectedValueOnce(new Error("Database error"));

      const res = await request(app).post("/auth/login").send({
        username: "testuser",
        password: "testpass",
      });

      expect(res.statusCode).toBe(500);
    });
  });
});
