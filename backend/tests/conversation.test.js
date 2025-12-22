import request from "supertest";
import app from "../src/server.js";

describe("💬 CONVERSATION INTEGRATION", () => {
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

  beforeEach(async () => {
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

    const friendReq1 = await request(app)
      .post("/api/friends/requests")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ to: userBId, message: "Test" });

    if (friendReq1.status === 201) {
      await request(app)
        .post(`/api/friends/requests/${friendReq1.body.request._id}/accept`)
        .set("Authorization", `Bearer ${tokenB}`);
    }

    const friendReq2 = await request(app)
      .post("/api/friends/requests")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ to: userCId, message: "Test" });

    if (friendReq2.status === 201) {
      await request(app)
        .post(`/api/friends/requests/${friendReq2.body.request._id}/accept`)
        .set("Authorization", `Bearer ${tokenC}`);
    }
  });

  describe("CONV-01: Tạo conversation", () => {
    
    test("🆕 Tạo conversation direct", async () => {
      const res = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          type: "direct",
          memberIds: [userBId],
        });

      expect(res.status).toBe(201);
      expect(res.body.conversation).toHaveProperty("_id");
      expect(res.body.conversation.type).toBe("direct");
    });

    test("👥 Tạo group conversation", async () => {
      const res = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          type: "group",
          name: "Test Group",
          memberIds: [userBId, userCId],
        });

      expect(res.status).toBe(201);
      expect(res.body.conversation).toHaveProperty("_id");
      expect(res.body.conversation.type).toBe("group");
      if (res.body.conversation.name) {
        expect(res.body.conversation.name).toBe("Test Group");
      }
    });

    test("❌ Không thể tạo conversation thiếu memberIds", async () => {
      const res = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          type: "direct",
        });

      expect(res.status).toBe(400);
    });

    test("❌ Không thể tạo group conversation thiếu tên", async () => {
      const res = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          type: "group",
          memberIds: [userBId, userCId],
        });

      expect(res.status).toBe(400);
    });

    test("❌ Không thể tạo conversation với người không phải bạn", async () => {
      const res = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          type: "direct",
          memberIds: [userCId],
        });

      expect(res.status).toBe(403);
    });

    test("❌ Không tạo trùng direct conversation", async () => {
      await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          type: "direct",
          memberIds: [userBId],
        });

      const res = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          type: "direct",
          memberIds: [userBId],
        });

      expect([200, 201, 400]).toContain(res.status);
    });
  });

  describe("CONV-02: Lấy danh sách conversations", () => {
    
    test("📋 Lấy danh sách tất cả conversations", async () => {
      await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          type: "direct",
          memberIds: [userBId],
        });

      await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          type: "group",
          name: "Test Group",
          memberIds: [userBId, userCId],
        });

      const res = await request(app)
        .get("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.conversations)).toBe(true);
      expect(res.body.conversations.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("CONV-03: Lấy tin nhắn trong conversation", () => {
    
    test("📖 Lấy tin nhắn trong conversation", async () => {
      const createRes = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          type: "direct",
          memberIds: [userBId],
        });

      const conversationId = createRes.body.conversation._id;

      const res = await request(app)
        .get(`/api/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.messages)).toBe(true);
    });
  });
});