require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const PDFDocument = require("pdfkit");
const multer = require("multer");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);
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

    const totalLeads = await pool.query(
      "SELECT COUNT(*) FROM leads"
    );

    const pendingFollowups = await pool.query(
      "SELECT COUNT(*) FROM followups WHERE status='Pending'"
    );

    const destinations = await pool.query(
      "SELECT COUNT(DISTINCT destination) FROM customers"
    );

    res.json({
      totalCustomers: Number(
        totalCustomers.rows[0].count
      ),
      totalLeads: Number(
        totalLeads.rows[0].count
      ),
      pendingFollowups: Number(
        pendingFollowups.rows[0].count
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
app.post("/customers", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      destination,
      passport_number,
      passport_expiry
    } = req.body;

    const result = await pool.query(
      `INSERT INTO customers
      (
        name,
        phone,
        email,
        destination,
        passport_number,
        passport_expiry
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        name,
        phone,
        email,
        destination,
        passport_number,
        passport_expiry
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to add customer"
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
      error: "Failed to fetch customers"
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
      message: "Customer deleted"
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to delete customer"
    });
  }
});
app.get("/passport-alerts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM customers
      WHERE passport_expiry IS NOT NULL
      AND passport_expiry <= CURRENT_DATE + INTERVAL '180 days'
      ORDER BY passport_expiry ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch alerts",
    });
  }
});
app.get("/documents/customer/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    const customer = result.rows[0];

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=customer-${id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(24)
       .text("Active Travels CRM", {
         align: "center",
       });

    doc.moveDown();

    doc.fontSize(18)
       .text("Customer Summary");

    doc.moveDown();

    doc.fontSize(12)
       .text(`Name: ${customer.name || ""}`);

    doc.text(`Phone: ${customer.phone || ""}`);

    doc.text(`Email: ${customer.email || ""}`);

    doc.text(
      `Destination: ${customer.destination || ""}`
    );

    doc.text(
      `Passport Number: ${
        customer.passport_number || ""
      }`
    );

    doc.text(
      `Passport Expiry: ${
        customer.passport_expiry || ""
      }`
    );

    doc.end();
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to generate PDF",
    });
  }
});
app.post("/followups", async (req, res) => {
  try {
    const {
      customer_id,
      task,
      due_date
    } = req.body;

    const result = await pool.query(
      `INSERT INTO followups
      (customer_id, task, due_date)
      VALUES ($1,$2,$3)
      RETURNING *`,
      [customer_id, task, due_date]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to create follow-up"
    });
  }
});
app.get("/followups", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        followups.*,
        customers.name
      FROM followups
      JOIN customers
      ON customers.id = followups.customer_id
      ORDER BY due_date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch follow-ups"
    });
  }
});
app.get("/followups", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        followups.*,
        customers.name
      FROM followups
      JOIN customers
      ON customers.id = followups.customer_id
      ORDER BY due_date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch follow-ups"
    });
  }
});
app.post("/leads/:id/convert", async (req, res) => {
  try {
    const { id } = req.params;

    const leadResult = await pool.query(
      "SELECT * FROM leads WHERE id=$1",
      [id]
    );

    if (leadResult.rows.length === 0) {
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    const lead = leadResult.rows[0];

    const customerResult = await pool.query(
      `INSERT INTO customers
      (name, phone, destination)
      VALUES ($1,$2,$3)
      RETURNING *`,
      [
        lead.name,
        lead.phone,
        lead.destination,
      ]
    );

    await pool.query(
      "DELETE FROM leads WHERE id=$1",
      [id]
    );

    res.json(customerResult.rows[0]);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to convert lead",
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM admins WHERE username=$1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const admin = result.rows[0];

    const validPassword =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Login failed",
    });
  }
});
app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM customers WHERE id=$1",
      [id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch customer",
    });
  }
});
app.get("/customers/:id/followups", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM followups
       WHERE customer_id = $1
       ORDER BY due_date ASC`,
      [id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch followups"
    });
  }
});
app.post(
  "/documents/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("UPLOAD HIT");
      console.log(req.body);
      console.log(req.file);

      const { customer_id } = req.body;

      const result = await pool.query(
        `INSERT INTO documents
        (customer_id,file_name,file_path)
        VALUES ($1,$2,$3)
        RETURNING *`,
        [
          customer_id,
          req.file.originalname,
          req.file.filename,
        ]
      );

      res.json(result.rows[0]);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Upload failed",
      });
    }
  }
);
app.get(
  "/customers/:id/documents",
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT *
         FROM documents
         WHERE customer_id=$1
         ORDER BY uploaded_at DESC`,
        [id]
      );

      res.json(result.rows);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to fetch documents",
      });
    }
  }
);
app.post(
  "/documents/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const { customer_id } = req.body;

      const result = await pool.query(
        `INSERT INTO documents
        (customer_id, file_name, file_path)
        VALUES ($1,$2,$3)
        RETURNING *`,
        [
          customer_id,
          req.file.originalname,
          req.file.filename,
        ]
      );

      res.json(result.rows[0]);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Upload failed",
      });
    }
  }
);
app.get(
  "/customers/:id/documents",
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT *
         FROM documents
         WHERE customer_id=$1
         ORDER BY uploaded_at DESC`,
        [id]
      );

      res.json(result.rows);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to fetch documents",
      });
    }
  }
);
app.get("/documents", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        documents.*,
        customers.name
      FROM documents
      LEFT JOIN customers
      ON documents.customer_id = customers.id
      ORDER BY documents.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch documents"
    });
  }
});
app.post("/visa-applications", async (req, res) => {
  try {
    const {
      customer_id,
      country,
      visa_type,
      status,
      application_date,
      remarks
    } = req.body;

    const result = await pool.query(
      `INSERT INTO visa_applications
      (customer_id,country,visa_type,status,application_date,remarks)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        customer_id,
        country,
        visa_type,
        status,
        application_date,
        remarks
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create visa application"
    });
  }
});
app.get("/visa-applications", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        visa_applications.*,
        customers.name
      FROM visa_applications
      JOIN customers
      ON customers.id = visa_applications.customer_id
      ORDER BY visa_applications.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch visa applications"
    });
  }
});
app.put("/visa-applications/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE visa_applications
       SET status=$1
       WHERE id=$2
       RETURNING *`,
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to update visa status"
    });
  }
});
app.get(
  "/customers/:id/visa-applications",
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT *
         FROM visa_applications
         WHERE customer_id=$1
         ORDER BY id DESC`,
        [id]
      );

      res.json(result.rows);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to fetch visa applications",
      });
    }
  }
);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
