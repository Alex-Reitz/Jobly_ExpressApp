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

  test("works: 1 item", function () {
    const result = sqlForPartialUpdate({ f1: "v1" }, { f1: "f1", fF2: "f2" });
    expect(result).toEqual({
      setCols: '"f1"=$1',
      values: ["v1"],
    });
  });
});
