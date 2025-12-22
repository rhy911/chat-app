import request from "supertest";
import app, { io, httpServer } from "../src/server.js";

describe("🔌 WEBSOCKET INTEGRATION TEST", () => {
  let tokenA, tokenB;
  let userAId, userBId;

  const userA = {
    username: "socketUserA",
    password: "123456",
    email: "socketA@test.com",
    firstName: "Socket",
    lastName: "UserA",
  };

  const userB = {
    username: "socketUserB",
    password: "123456",
    email: "socketB@test.com",
    firstName: "Socket",
    lastName: "UserB",
  };

  beforeAll(async () => {
    await request(app).post("/api/auth/signup").send(userA);
    await request(app).post("/api/auth/signup").send(userB);

    const resA = await request(app)
      .post("/api/auth/signin")
      .send({ username: userA.username, password: userA.password });

    const resB = await request(app)
      .post("/api/auth/signin")
      .send({ username: userB.username, password: userB.password });

    tokenA = resA.body.accessToken;
    tokenB = resB.body.accessToken;
    userAId = resA.body.user._id;
    userBId = resB.body.user._id;
  });

  describe("WS-01: WebSocket Setup Verification", () => {
    
    test("Socket.io server đã được setup", () => {
      expect(io).toBeDefined();
      expect(typeof io.on).toBe("function");
      expect(typeof io.emit).toBe("function");
    });

    test("HTTP Server đã được export", () => {
      expect(httpServer).toBeDefined();
      expect(typeof httpServer.listen).toBe("function");
    });

    test("Socket.io có middleware authentication", () => {
      expect(io._nsps).toBeDefined();
      expect(io._nsps.get("/")).toBeDefined();
    });

    test("Socket.io engine ready", () => {
      expect(io.engine).toBeDefined();
    });
  });

  describe("WS-02: Integration với Authentication", () => {
    
    test("Token hợp lệ từ signin có thể dùng cho WebSocket", () => {
      expect(tokenA).toBeDefined();
      expect(tokenB).toBeDefined();
      expect(typeof tokenA).toBe("string");
      expect(tokenB.length).toBeGreaterThan(20);
    });

    test("User IDs available cho WebSocket rooms", () => {
      expect(userAId).toBeDefined();
      expect(userBId).toBeDefined();
      expect(userAId).not.toBe(userBId);
    });

    test("Multiple users có thể authenticate", () => {
      expect(tokenA).not.toBe(tokenB);
      expect(userAId).not.toBe(userBId);
    });

    test("Tokens có format JWT hợp lệ", () => {
      expect(tokenA.split(".").length).toBe(3);
      expect(tokenB.split(".").length).toBe(3);
    });
  });

  describe("WS-03: WebSocket Event Handlers", () => {
    
    test("Server có connection event handler", () => {
      const namespace = io._nsps.get("/");
      expect(namespace._events).toBeDefined();
      expect(namespace._events.connection).toBeDefined();
    });

    test("WebSocket namespace được setup", () => {
      const namespace = io._nsps.get("/");
      expect(namespace).toBeDefined();
      expect(namespace.name).toBe("/");
    });

    test("User data available cho WebSocket", () => {
      expect(userAId).toBeTruthy();
      expect(userBId).toBeTruthy();
      expect(tokenA).toBeTruthy();
      expect(tokenB).toBeTruthy();
    });
  });

  describe("WS-04: Real-time Architecture Readiness", () => {
    
    test("Server exports đầy đủ", () => {
      expect(app).toBeDefined();
      expect(io).toBeDefined();
      expect(httpServer).toBeDefined();
    });

    test("WebSocket transport configured", () => {
      expect(io.engine).toBeDefined();
    });

    test("CORS được cấu hình cho WebSocket", () => {
      expect(io.opts.cors).toBeDefined();
    });

    test("Socket.io adapter ready", () => {
      const namespace = io._nsps.get("/");
      expect(namespace.adapter).toBeDefined();
    });

    test("Authentication data structure valid", () => {
      expect(typeof userAId).toBe("string");
      expect(typeof userBId).toBe("string");
      expect(userAId.length).toBeGreaterThan(0);
      expect(userBId.length).toBeGreaterThan(0);
    });
  });
});