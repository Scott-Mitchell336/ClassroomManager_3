const express = require("express");
const studentRouter = express.Router();
const db = require("../db");

// Get all students
studentRouter.get("/student", async (req, res) => {
  const result = await db.query("SELECT * FROM student");
  res.json(result.rows);
});

// Get a student by id
studentRouter.get("/student/:id", async (req, res, next) => {
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
studentRouter.post("/student", async (req, res, next) => {
  // Move destructuring inside try block and add validation first
  if (!req.body.name || !req.body.cohort || !req.body.instructorid) {
    return res.status(400).json({
      error: "Bad Request - 400",
      message: "Missing required fields: name, cohort, and instructorid",
    });
  }

  try {
    const { name, cohort, instructorid } = req.body;

    const result = await db.query(
      "INSERT INTO student (name, cohort, instructorid) VALUES ($1, $2, $3) RETURNING *",
      [name, cohort, instructorid]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Database errors - specific error handling
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Bad Request - 400",
        message: "Student already exists",
      });
    }
    next(error);
  }
});

// Update a student
studentRouter.put("/student/:id", async (req, res, next) => {
  // Validate required fields first
  if (!req.body.name || !req.body.cohort || !req.body.instructorid) {
    return res.status(400).json({
      error: "Bad Request - 400",
      message: "Missing required fields: name, cohort, and instructorid",
    });
  }

  try {
    // First check if student exists
    const checkResult = await db.query("SELECT * FROM student WHERE id = $1", [
      req.params.id,
    ]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "Student not found",
      });
    }

    const existingStudent = checkResult.rows[0];

    // Check instructor permission before attempting update
    if (existingStudent.instructorid !== Number(req.body.instructorid)) {
      return res.status(403).json({
        error: "Forbidden - 403",
        message: "You don't have permission to update this student",
      });
    }

    const updateResult = await db.query(
      "UPDATE student SET name = $1, cohort = $2 WHERE id = $3 AND instructorid = $4 RETURNING *",
      [req.body.name, req.body.cohort, req.params.id, req.body.instructorid]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    // Log the error for debugging
    console.error("Update error:", error);
    next(error);
  }
});

// Delete a student by id
studentRouter.delete("/student/:id", async (req, res, next) => {
  try {
    // First check if student exists and get their instructor
    const {
      rows: [existingStudent],
    } = await db.query("SELECT * FROM student WHERE id = $1", [req.params.id]);

    if (!existingStudent) {
      return res.status(404).send("Student not found.");
    }

    // Check if instructor has permission
    if (existingStudent.instructorid !== Number(req.body.instructorid)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You don't have permission to delete this student",
      });
    }

    // If authorized, proceed with deletion
    const {
      rows: [deletedStudent],
    } = await db.query("DELETE FROM student WHERE id = $1 RETURNING *", [
      req.params.id,
    ]);

    res.json(deletedStudent);
  } catch (error) {
    next(error);
  }
});

module.exports = studentRouter;
