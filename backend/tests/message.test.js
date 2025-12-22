import request from "supertest";
import app from "../src/server.js";

describe("✉️ MESSAGE INTEGRATION", () => {
  let tokenA, tokenB, tokenC;
  let userAId, userBId, userCId;
  let conversationId, groupConversationId;

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

    const friendReq3 = await request(app)
      .post("/api/friends/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ to: userCId, message: "Test" });

    if (friendReq3.status === 201) {
      await request(app)
        .post(`/api/friends/requests/${friendReq3.body.request._id}/accept`)
        .set("Authorization", `Bearer ${tokenC}`);
    }

    const convo = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        type: "direct",
        memberIds: [userBId],
      });

    conversationId = convo.body.conversation._id;

    const groupConvo = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        type: "group",
        name: "Test Group",
        memberIds: [userBId, userCId],
      });

    groupConversationId = groupConvo.body.conversation._id;
  });

  describe("MSG-01: Gửi tin nhắn", () => {
    
    test("📩 Gửi tin nhắn direct", async () => {
      const res = await request(app)
        .post("/api/messages/direct")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          recipientId: userBId,
          conversationId,
          content: "Hello bạn!",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toHaveProperty("content");
      expect(res.body.message.content).toBe("Hello bạn!");
    });

    test("❌ Không thể gửi tin nhắn với conversationId không tồn tại", async () => {
      const res = await request(app)
        .post("/api/messages/direct")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          recipientId: userBId,
          conversationId: "507f1f77bcf86cd799439011",
          content: "Test",
        });

      expect(res.status).toBe(404);
    });

    test("❌ Không cho gửi tin nhắn khi không phải thành viên conversation", async () => {
      const res = await request(app)
        .post("/api/messages/direct")
        .set("Authorization", `Bearer ${tokenC}`)
        .send({
          recipientId: userBId, 
          conversationId,      
          content: "Hack thử",
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Bạn không thuộc conversation này");
    });

    test("❌ Không cho gửi tin nhắn group khi thiếu content", async () => {
      const res = await request(app)
        .post("/api/messages/group")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          conversationId: groupConversationId,
        });

      expect([400, 403, 404]).toContain(res.status);
    });

    test("❌ Không thể gửi tin nhắn direct thiếu content", async () => {
      const res = await request(app)
        .post("/api/messages/direct")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          recipientId: userBId,
          conversationId,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Thiếu nội dung");
    });

    test("❌ Không thể gửi tin nhắn thiếu recipientId", async () => {
      const res = await request(app)
        .post("/api/messages/direct")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          conversationId,
          content: "Test without recipientId",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Cần cung cấp recipientId hoặc memberIds");
    });

    test("📩 Gửi tin nhắn group thành công", async () => {
      const res = await request(app)
        .post("/api/messages/group")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          conversationId: groupConversationId,
          content: "Hello group!",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toHaveProperty("content");
      expect(res.body.message.content).toBe("Hello group!");
    });

    test("❌ Không thể gửi tin nhắn group thiếu content", async () => {
      const res = await request(app)
        .post("/api/messages/group")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          conversationId: groupConversationId,
        });

      expect(res.status).toBe(400);
    });

    test("✅ Member khác trong group cũng gửi được tin nhắn", async () => {
      const res = await request(app)
        .post("/api/messages/group")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          conversationId: groupConversationId,
          content: "Message from User B",
        });

      expect(res.status).toBe(201);
      expect(res.body.message.content).toBe("Message from User B");
      expect(res.body.message.senderId).toBe(userBId);
    });

    test("✅ UserC cũng gửi được tin nhắn vào group", async () => {
      const res = await request(app)
        .post("/api/messages/group")
        .set("Authorization", `Bearer ${tokenC}`)
        .send({
          conversationId: groupConversationId,
          content: "Message from User C",
        });

      expect(res.status).toBe(201);
      expect(res.body.message.content).toBe("Message from User C");
      expect(res.body.message.senderId).toBe(userCId);
    });

    test("✅ Gửi nhiều tin nhắn direct liên tiếp", async () => {
      for (let i = 1; i <= 3; i++) {
        const res = await request(app)
          .post("/api/messages/direct")
          .set("Authorization", `Bearer ${tokenA}`)
          .send({
            recipientId: userBId,
            conversationId,
            content: `Message ${i}`,
          });

        expect(res.status).toBe(201);
        expect(res.body.message.content).toBe(`Message ${i}`);
      }
    });

    test("✅ Gửi tin nhắn với content dài", async () => {
      const longContent = "A".repeat(500);
      
      const res = await request(app)
        .post("/api/messages/direct")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          recipientId: userBId,
          conversationId,
          content: longContent,
        });

      expect(res.status).toBe(201);
      expect(res.body.message.content).toBe(longContent);
    });

    test("✅ UserB reply lại tin nhắn của UserA", async () => {
      const res = await request(app)
        .post("/api/messages/direct")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          recipientId: userAId,
          conversationId,
          content: "Reply from B",
        });

      expect(res.status).toBe(201);
      expect(res.body.message.senderId).toBe(userBId);
    });

    test("✅ Gửi nhiều tin nhắn group liên tiếp", async () => {
      for (let i = 1; i <= 3; i++) {
        const res = await request(app)
          .post("/api/messages/group")
          .set("Authorization", `Bearer ${tokenA}`)
          .send({
            conversationId: groupConversationId,
            content: `Group message ${i}`,
          });

        expect(res.status).toBe(201);
      }
    });
  });

  describe("MSG-02: Lấy tin nhắn", () => {
    
  });
});