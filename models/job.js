"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Jobs {
  /* Filtering */
  static async search(searchName, minSalary, hasEquity) {
    const results = await db.query(
      `
    SELECT title, company_handle
    FROM jobs
    WHERE title ILIKE $1
    AND salary > $2
    AND equity > $3
    `,
      [`%${searchName}%`, minSalary, hasEquity]
    );
    if (results.rows.length === 0) {
      return "No results found.";
    } else {
      return results.rows;
    }
  }

  /* Create a new job */

  static async create({ id, title, salary, equity, company_handle }) {
    const duplicateCheck = await db.query(
      `SELECT handle
           FROM jobs
           WHERE id = $1`,
      [id]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job: ${id}`);

    const result = await db.query(
      `INSERT INTO jobs
           (id, title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, title, salary, equity, company_handle`,
      [id, title, salary, equity, company_handle]
    );
    const company = result.rows[0];

    return company;
  }

  /* Find all jobs */

  static async findAll() {
    const jobsRes = await db.query(
      `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle
           FROM jobs
           ORDER BY id`
    );
    return jobsRes.rows;
  }

  /* Find a specific job from ID */

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id,
        title,
        salary,
        equity,
        company_handle
           FROM jobs
           WHERE id = $1`,
      [id]
    );

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /* Update jobs data, should never update ID or company associated with a job */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      company_handle: "company_handle",
    });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs  
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity, 
                                company_handle as "company_handle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /* DELETE a company when an id is passed in */

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }
}

module.exports = Jobs;
