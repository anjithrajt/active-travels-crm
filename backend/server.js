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

app.post("/customers", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      passport_no,
      passport_expiry,
      destination,
      notes,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO customers
      (name, phone, email, passport_no, passport_expiry, destination, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        name,
        phone,
        email,
        passport_no,
        passport_expiry,
        destination,
        notes,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to add customer",
    });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch customers",
    });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM customers WHERE id = $1",
      [id]
    );

    res.json({
      message: "Customer deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to delete customer",
    });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
