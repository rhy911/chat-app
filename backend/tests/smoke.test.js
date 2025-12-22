import request from "supertest";
import app from "../src/server.js";

describe("🔥 SMOKE TEST - Kiểm tra hệ thống cơ bản", () => {
  
  test("ST-01: Server khởi động không crash", () => {
    expect(app).toBeDefined();
  });

  test("ST-02: Swagger API Documentation truy cập được", async () => {
    const res = await request(app).get("/api-docs");
    expect(res.status).toBeLessThan(500);
  });

  test("ST-03: Health check endpoint", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBeLessThan(500);
  });
});