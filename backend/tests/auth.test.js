import request from "supertest";
import app from "../src/server.js";

describe("🔐 INTEGRATION TEST - Authentication", () => {
  
  const testUser = {
    username: "testuser",
    password: "123456",
    email: "testuser@gmail.com",
    firstName: "Test",
    lastName: "User",
  };

  describe("IT-AUTH-01: User Registration", () => {
    
    test("Đăng ký thành công với thông tin hợp lệ", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send(testUser);

      expect([200, 201, 204]).toContain(res.status);
    });

    test("Không cho đăng ký với username trùng", async () => {
      await request(app)
        .post("/api/auth/signup")
        .send(testUser);

      const res = await request(app)
        .post("/api/auth/signup")
        .send(testUser);

      expect(res.status).toBe(409);
    });

    test("Không cho đăng ký thiếu thông tin bắt buộc", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "incomplete",
        });

      expect(res.status).toBe(400);
    });

    test("Không cho đăng ký với email đã tồn tại", async () => {
      await request(app)
        .post("/api/auth/signup")
        .send(testUser);

      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          ...testUser,
          username: "different_username",
        });

      expect([409, 500]).toContain(res.status);
    });
  });

  describe("IT-AUTH-02: User Login", () => {
    
    beforeEach(async () => {
      await request(app)
        .post("/api/auth/signup")
        .send(testUser);
    });

    test("Đăng nhập thành công với credentials đúng", async () => {
      const res = await request(app)
        .post("/api/auth/signin")
        .send({
          username: testUser.username,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body.accessToken).toBeTruthy();
      expect(res.body).toHaveProperty("user");
    });

    test("Từ chối đăng nhập với password sai", async () => {
      const res = await request(app)
        .post("/api/auth/signin")
        .send({
          username: testUser.username,
          password: "wrongpassword",
        });

      expect(res.status).toBe(401);
    });

    test("Từ chối đăng nhập với username không tồn tại", async () => {
      const res = await request(app)
        .post("/api/auth/signin")
        .send({
          username: "nonexistent",
          password: "anypassword",
        });

      expect(res.status).toBe(401);
    });

    test("Từ chối đăng nhập thiếu thông tin", async () => {
      const res = await request(app)
        .post("/api/auth/signin")
        .send({
          username: testUser.username,
        });

      expect(res.status).toBe(400);
    });

    test("Từ chối đăng nhập thiếu username", async () => {
      const res = await request(app)
        .post("/api/auth/signin")
        .send({
          password: testUser.password,
        });

      expect(res.status).toBe(400);
    });
  });

  describe("IT-AUTH-03: Token Validation", () => {
    
    let validToken;

    beforeEach(async () => {
      await request(app)
        .post("/api/auth/signup")
        .send(testUser);

      const loginRes = await request(app)
        .post("/api/auth/signin")
        .send({
          username: testUser.username,
          password: testUser.password,
        });

      validToken = loginRes.body.accessToken;
    });

    test("Truy cập protected route với token hợp lệ", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
    });

    test("Chặn truy cập protected route không có token", async () => {
      const res = await request(app)
        .get("/api/users/me");

      expect(res.status).toBe(401);
    });

    test("Chặn truy cập protected route với token không hợp lệ", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", "Bearer invalid_token_12345");

      expect(res.status).toBe(403);
    });

    test("Chặn truy cập với token format sai (không có Bearer)", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", validToken);

      expect(res.status).toBe(401);
    });

    test("Chặn truy cập với Authorization header rỗng", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", "");

      expect(res.status).toBe(401);
    });
  });

  describe("IT-AUTH-04: Logout", () => {
    
    test("Logout thành công", async () => {
      await request(app)
        .post("/api/auth/signup")
        .send(testUser);

      const loginRes = await request(app)
        .post("/api/auth/signin")
        .send({
          username: testUser.username,
          password: testUser.password,
        });

      const token = loginRes.body.accessToken;

      const logoutRes = await request(app)
        .post("/api/auth/signout")
        .set("Authorization", `Bearer ${token}`);

      expect(logoutRes.status).toBe(204);
    });
  });

  describe("IT-AUTH-05: Refresh Token", () => {
    
    test("Refresh token endpoint tồn tại", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({});

      expect([400, 401, 403]).toContain(res.status);
    });
  });
});