const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all students
router.get("/student", async (req, res) => {
  const result = await db.query("SELECT * FROM student");
  res.json(result.rows);
});

// Get a student by id
router.get("/student/:id", async (req, res, next) => {
  const { instructorid } = req.body;
  try {
    const {
      rows: [student],
    } = await db.query(
      "SELECT * FROM student WHERE id = $1 AND instructorId = $2",
      [req.params.id, instructorid]
    );

    if (!student) {
      return res.status(404).send("Student not found.");
    }

    res.send(student);
  } catch (error) {
    next(error);
  }
});

// Create a new student
router.post("/student", async (req, res) => {
  const { name, cohort, instructorid } = req.body;
  const result = await db.query(
    "INSERT INTO student (name, cohort, instructorid) VALUES ($1, $2, $3) RETURNING *",
    [name, cohort, instructorid]
  );
  res.json(result.rows[0]);
});

// Update a student
router.put("/student/:id", async (req, res, next) => {
  // const { instructorid } = req.body;
  try {
    const {
      rows: [student],
    } = await db.query(
      "UPDATE student SET name = $1, cohort = $2 WHERE id = $3 AND instructorId = $4 RETURNING *",
      [req.body.name, req.body.cohort, req.params.id, req.body.instructorid]
    );

    if (!student) {
      return res.status(404).send("Student not found.");
    }

    res.send(student);
  } catch (error) {
    next(error);
  }
});

// Delete a student by id
router.delete("/student/:id", async (req, res, next) => {
  try {
    const {
      rows: [student],
    } = await db.query(
      "DELETE FROM student WHERE id = $1 AND instructorId = $2 RETURNING *",
      [req.params.id, req.body.instructorid]
    );

    if (!student) {
      return res.status(404).send("Student not found.");
    }

    res.send(student);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
