"use strict";

/** Routes for Jobs */

const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const router = new express.Router();

/* POST request to add a new job  Auth = admin*/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

/* GET request to show all jobs, returns json, Auth=none */
router.get("/", async function (req, res, next) {
  try {
    let jobs;
    if (Object.keys(req.query).length === 0) {
      jobs = await Job.findAll();
      return res.json({ jobs });
    }
    let searchName = req.query.name || "";
    let minSalary = parseInt(req.query.min_salary) || 0;
    let hasEquity = req.query.hasEquity || False;

    jobs = await Job.searchFilter(searchName, minSalary, hasEquity);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

/* GET request to a specific id for a job */

router.get("/:id", async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/* PATCH rquest to update a job, Auth=admin */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/* DELETE request to delete a job, Auth=admin */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
