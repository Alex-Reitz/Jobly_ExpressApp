process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

describe("sqlForPartialUpdate", function () {
  test("Updates SQL", function () {
    const response = await request(app).patch(`/companies/${}`).send({});
    expect(response.body).toHaveProperty("");
  });
});
