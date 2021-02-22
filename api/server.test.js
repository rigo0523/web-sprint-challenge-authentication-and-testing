// Write your tests here
test("sanity", () => {
  expect(true).toBe(true);
});

//tests
const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

//it tests users
const testUser = { username: "test", password: "test" };

describe("server.js", () => {
  //describe 1 GET /api/jokes
  describe("GET request for Dad Jokes", () => {
    test("should return a status code of 400 when not logged in", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(400);
    });
    test("should return json", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.type).toBe("application/json");
    });
  });
  //describe 2 POST /api/auth/register  --- new user
  describe("POST registering new user", () => {
    test("should return with a status code of 201 when adding new user", async () => {
      await db("users").truncate();
      const res = await request(server)
        .post("/api/auth/register")
        .send(testUser);
      expect(res.status).toBe(201);
    });
    test("POST should return a status of 500 if user is registered already", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send(testUser); //sending the same user from testUser
      expect(res.status).toBe(500);
    });
  });
  //describe 3 POST /api/auth/login
  describe("POST login with user", () => {
    test("should return a status code of 200 with logged in user", async () => {
      const res = await request(server).post("/api/auth/login").send(testUser);
      expect(res.status).toBe(200);
    });
    test("POST should return with status 401 if invalid credentials", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "testing123", password: "testing123" });
      expect(res.status).toBe(401);
    });
  });
});
