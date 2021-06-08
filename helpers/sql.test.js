process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", function () {
  test("Returns an object", function () {
    const result = sqlForPartialUpdate(
      { name: "Davis-Davis" },
      { name: "Davis-David" }
    );
    expect(result).toBeInstanceOf(Object);
  });
});
