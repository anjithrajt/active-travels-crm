require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Active Travels CRM API Running",
  });
});

app.post("/leads", async (req, res) => {
  try {
    const {
      name,
      phone,
      destination,
      status,
      notes
    } = req.body;

    const result = await pool.query(
      `INSERT INTO leads
       (name, phone, destination, status, notes)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        name,
        phone,
        destination,
        status || "New",
        notes
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to add lead"
    });
  }
});
app.get("/leads", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leads ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch leads"
    });
  }
});

app.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM leads WHERE id=$1",
      [id]
    );

    res.json({
      message: "Lead deleted"
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to delete lead"
    });
  }
});
app.get("/dashboard/stats", async (req, res) => {
  try {
    const totalCustomers = await pool.query(
      "SELECT COUNT(*) FROM customers"
    );

    const destinations = await pool.query(
      "SELECT COUNT(DISTINCT destination) FROM customers"
    );

    res.json({
      totalCustomers: Number(
        totalCustomers.rows[0].count
      ),
      destinations: Number(
        destinations.rows[0].count
      ),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch stats",
    });
  }
});
app.put("/leads/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE leads
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to update status",
    });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
