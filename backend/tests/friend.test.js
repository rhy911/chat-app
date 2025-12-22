import request from "supertest";
import app from "../src/server.js";

describe("👥 FRIEND INTEGRATION", () => {
  let tokenA, tokenB, tokenC;
  let userAId, userBId, userCId;

  const userA = {
    username: "userA",
    password: "123456",
    email: "a@test.com",
    firstName: "A",
    lastName: "User",
  };

  const userB = {
    username: "userB",
    password: "123456",
    email: "b@test.com",
    firstName: "B",
    lastName: "User",
  };

  const userC = {
    username: "userC",
    password: "123456",
    email: "c@test.com",
    firstName: "C",
    lastName: "User",
  };

  beforeAll(async () => {
    await request(app).post("/api/auth/signup").send(userA);
    await request(app).post("/api/auth/signup").send(userB);
    await request(app).post("/api/auth/signup").send(userC);

    const resA = await request(app)
      .post("/api/auth/signin")
      .send({ username: userA.username, password: userA.password });

    const resB = await request(app)
      .post("/api/auth/signin")
      .send({ username: userB.username, password: userB.password });

    const resC = await request(app)
      .post("/api/auth/signin")
      .send({ username: userC.username, password: userC.password });

    tokenA = resA.body.accessToken;
    tokenB = resB.body.accessToken;
    tokenC = resC.body.accessToken;
    userAId = resA.body.user._id;
    userBId = resB.body.user._id;
    userCId = resC.body.user._id;
  });

  describe("FR-01: Gửi và quản lý lời mời kết bạn", () => {
    test("📨 Gửi và chấp nhận lời mời kết bạn", async () => {
      const sendRes = await request(app)
        .post("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ to: userBId, message: "Kết bạn nhé" });

      expect(sendRes.status).toBe(201);
      expect(sendRes.body.request).toBeDefined();

      const requestId = sendRes.body.request._id;

      const acceptRes = await request(app)
        .post(`/api/friends/requests/${requestId}/accept`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(acceptRes.status).toBe(200);
      expect(acceptRes.body.message).toBe("Chấp nhận lời mời kết bạn thành công");
    });

    test("❌ Không thể gửi lời mời cho chính mình", async () => {
      const res = await request(app)
        .post("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ to: userAId, message: "Test" });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("chính mình");
    });

    test("❌ Không thể gửi lời mời trùng", async () => {
      await request(app)
        .post("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ to: userCId, message: "Test" });

      const res = await request(app)
        .post("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ to: userCId, message: "Test again" });

      expect(res.status).toBe(400);
    });

    test("❌ Không thể gửi lời mời cho user không tồn tại", async () => {
      const res = await request(app)
        .post("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ to: "507f1f77bcf86cd799439011", message: "Test" });

      expect(res.status).toBe(404);
    });

    test("❌ Không thể gửi lời mời khi đã là bạn bè", async () => {
      const res = await request(app)
        .post("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ to: userBId, message: "Second" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Hai người đã là bạn bè");
    });

    test("❌ Từ chối lời mời kết bạn", async () => {
      const sendRes = await request(app)
        .post("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({ to: userCId, message: "Test" });

      const requestId = sendRes.body.request._id;

      const declineRes = await request(app)
        .post(`/api/friends/requests/${requestId}/decline`)
        .set("Authorization", `Bearer ${tokenC}`);

      expect(declineRes.status).toBe(204);
    });

    test("❌ Không thể chấp nhận lời mời không tồn tại", async () => {
      const res = await request(app)
        .post(`/api/friends/requests/507f1f77bcf86cd799439011/accept`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.status).toBe(404);
    });

    test("❌ Không thể chấp nhận lời mời của người khác", async () => {
      const sendRes = await request(app)
        .post("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenC}`)
        .send({ to: userBId, message: "Test" });

      const requestId = sendRes.body.request._id;

      const res = await request(app)
        .post(`/api/friends/requests/${requestId}/accept`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(403);
    });
  });

  describe("FR-02: Quản lý danh sách bạn bè", () => {
    test("👥 Lấy danh sách bạn bè", async () => {
      const res = await request(app)
        .get("/api/friends")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.friends)).toBe(true);
      expect(res.body.friends.length).toBeGreaterThanOrEqual(1);
    });

    test("📥 Lấy danh sách lời mời kết bạn", async () => {
      const res = await request(app)
        .get("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenC}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("sent");
      expect(res.body).toHaveProperty("received");
      expect(Array.isArray(res.body.sent)).toBe(true);
      expect(Array.isArray(res.body.received)).toBe(true);
      expect(res.body.received.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("FR-03: Edge cases và validation", () => {
    test("❌ Không thể decline request không tồn tại", async () => {
      const res = await request(app)
        .post(`/api/friends/requests/507f1f77bcf86cd799439011/decline`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.status).toBe(404);
    });

    test("❌ Không thể decline request của người khác", async () => {
      const userE = {
        username: "userE",
        password: "123456",
        email: "e@test.com",
        firstName: "E",
        lastName: "User",
      };

      await request(app).post("/api/auth/signup").send(userE);

      const resE = await request(app)
        .post("/api/auth/signin")
        .send({ username: userE.username, password: userE.password });

      const tokenE = resE.body.accessToken;
      const userEId = resE.body.user._id;

      const sendRes = await request(app)
        .post("/api/friends/requests")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({ to: userEId, message: "Test" });

      expect(sendRes.status).toBe(201);
      const requestId = sendRes.body.request._id;

      const res = await request(app)
        .post(`/api/friends/requests/${requestId}/decline`)
        .set("Authorization", `Bearer ${tokenC}`);

      expect(res.status).toBe(403);
    });

    test("✅ Lấy danh sách bạn bè khi chưa có bạn nào", async () => {
      const userD = {
        username: "userD",
        password: "123456",
        email: "d@test.com",
        firstName: "D",
        lastName: "User",
      };

      await request(app).post("/api/auth/signup").send(userD);

      const resD = await request(app)
        .post("/api/auth/signin")
        .send({ username: userD.username, password: userD.password });

      const tokenD = resD.body.accessToken;

      const res = await request(app)
        .get("/api/friends")
        .set("Authorization", `Bearer ${tokenD}`);

      expect(res.status).toBe(200);
      expect(res.body.friends).toEqual([]);
    });
  });
});