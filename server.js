const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 5000;

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MySQL Connection Pools
const ticketDb = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zoo_ticket_booking'
});

const animalsDb = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'animals'
});

const eventsDb = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zoo_management'
});

// ✅ Ensure Uploads Directory Exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Storage for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB Limit

/* ========== 🦁 ANIMALS ROUTES ========== */

// ✅ GET: Fetch All Animals
app.get('/animals', (req, res) => {
  animalsDb.query('SELECT * FROM animals', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error fetching animals' });
    res.json(results);
  });
});

// ✅ POST: Add New Animal
app.post('/add-animal', upload.single('image'), (req, res) => {
  const { name, age, gender, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !age || !gender || !description || !image) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  animalsDb.query(
    'INSERT INTO animals (name, age, gender, description, image) VALUES (?, ?, ?, ?, ?)',
    [name, age, gender, description, image],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error adding animal' });
      res.status(201).json({ message: '✅ Animal added successfully', animalId: result.insertId });
    }
  );
});

// ✅ DELETE: Remove Animal by ID
app.delete('/delete-animal/:id', (req, res) => {
  animalsDb.query('DELETE FROM animals WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error deleting animal' });
    res.json({ message: '🗑️ Animal deleted successfully' });
  });
});

/* ========== 🎟️ TICKET BOOKING ROUTES ========== */



/* ========== 🎉 EVENTS ROUTES ========== */

// ✅ GET: Fetch All Events
app.get('/events', (req, res) => {
  eventsDb.query('SELECT * FROM events', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error fetching events' });
    res.json(results);
  });
});
app.get('/bookings', (req, res) => {
  ticketDb.query(
    'SELECT id, name, email, phone, student, child, foreigner, regular, visit_date, total_price, payment_status FROM bookings ORDER BY visit_date DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error fetching bookings' });
      res.json(results);
    }
  );
});
// ✅ POST: Book Tickets (Default payment_status = 'PENDING')
app.post('/book-tickets', (req, res) => {
  const { name, email, phone, student, child, foreigner, regular, visit_date, total_price } = req.body;

  if (!name || !email || !phone || !visit_date || total_price == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  ticketDb.query(
    `INSERT INTO bookings (name, email, phone, student, child, foreigner, regular, visit_date, total_price, payment_status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
    [name, email, phone, student, child, foreigner, regular, visit_date, total_price],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error booking tickets' });
      res.json({ message: '🎟️ Booking successful', bookingId: result.insertId });
    }
  );
});
// ✅ POST: Update Payment Status to "PAID"
app.put("/update-payment/:id", (req, res) => {
  const bookingId = req.params.id;

  if (!bookingId) {
    return res.status(400).json({ error: "❌ Booking ID is required" });
  }

  // ✅ Use .query() instead of .execute()
  const updateQuery = "UPDATE bookings SET payment_status = 'PAID' WHERE id = ?";
  
  ticketDb.query(updateQuery, [bookingId], (err, result) => {
    if (err) {
      console.error("❌ Error updating payment:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "✅ Payment updated successfully", payment_status: "PAID" });
    } else {
      res.status(404).json({ error: "❌ Booking not found" });
    }
  });
});

app.get('/get-payment-status/:id', (req, res) => {
  const { id } = req.params;

  ticketDb.query(
    'SELECT payment_status FROM bookings WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error fetching payment status' });
      if (result.length === 0) return res.status(404).json({ error: 'Booking not found' });
      res.json({ payment_status: result[0].payment_status });
    }
  );
});

// ✅ DELETE: Remove Booking by ID
app.delete('/delete-booking/:id', (req, res) => {
  const bookingId = req.params.id;

  if (!bookingId) {
    return res.status(400).json({ error: '❌ Booking ID is required' });
  }

  ticketDb.query('DELETE FROM bookings WHERE id = ?', [bookingId], (err, result) => {
    if (err) {
      console.error("❌ Error deleting booking:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }

    if (result.affectedRows > 0) {
      res.json({ message: '🗑️ Booking deleted successfully' });
    } else {
      res.status(404).json({ error: '❌ Booking not found' });
    }
  });
});



// ✅ POST: Add New Event
app.post('/add-event', upload.single('eventImage'), (req, res) => {
  const { eventName, eventDate } = req.body;
  const eventImage = req.file ? req.file.filename : null;

  if (!eventName || !eventDate || !eventImage) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  eventsDb.query(
    'INSERT INTO events (eventName, eventDate, eventImage) VALUES (?, ?, ?)',
    [eventName, eventDate, eventImage],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error adding event' });
      res.json({ message: '✅ Event added successfully', eventId: result.insertId });
    }
  );
});

// ✅ PUT: Update Event
app.put('/update-event/:id', upload.single('eventImage'), (req, res) => {
  const { eventName, eventDate } = req.body;
  const eventImage = req.file ? req.file.filename : null;

  eventsDb.query(
    'UPDATE events SET eventName = ?, eventDate = ?, eventImage = ? WHERE id = ?',
    [eventName, eventDate, eventImage, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error updating event' });
      res.json({ message: '✅ Event updated successfully' });
    }
  );
});

// ✅ DELETE: Remove Event by ID
app.delete('/delete-event/:id', (req, res) => {
  eventsDb.query('DELETE FROM events WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error deleting event' });
    res.json({ message: '🗑️ Event deleted successfully' });
  });
});


const feedbackDb = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "zoo_feedbacks"
});

// ✅ Add feedback to database
app.post("/feedback", (req, res) => {
  const { name, email, message } = req.body;
  const sql = "INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)";
  feedbackDb.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving feedback");
    } else {
      res.status(200).send("Feedback added successfully");
    }
  });
});

// ✅ Get all feedback for admin dashboard
app.get("/feedback", (req, res) => {
  feedbackDb.query("SELECT * FROM feedback ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching feedback");
    } else {
      res.json(results);
    }
  });
});

// ✅ Delete feedback by ID
app.delete("/feedback/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM feedback WHERE id = ?";
  feedbackDb.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting feedback");
    } else {
      res.status(200).send("Feedback deleted successfully");
    }
  });
});

//-----------------------------------------------------------------------------------------------

const bcrypt = require("bcryptjs");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config();

// 🔹 CORS Middleware (Move this above session)
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Allow only frontend origin
    credentials: true, // ✅ Allow cookies & session
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Specify allowed headers
  })
);

app.use(express.json());

// 🔹 JSON Middleware
app.use(express.json());

// 🔹 MySQL Connection
const db = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "zoo_login",
});

// 🔹 Session Store
const sessionStore = new MySQLStore({}, db);

// 🔹 Session Middleware (Ensure it's before routes)
app.use(session({
    key: "user_session",
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: false, // ❌ Change to 'true' in production (for HTTPS)
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60, // 1 hour
    },
}));

// 🔹 User Registration Route

app.post("/register", async (req, res) => {
    try {
        const { name, email, password, contact, age } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password || !contact || !age) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Validate contact number (must be 10 digits)
        if (!/^\d{10}$/.test(contact)) {
            return res.status(400).json({ error: "Contact number must be exactly 10 digits" });
        }

        // Validate age (must be between 1 and 100)
        if (isNaN(age) || age < 1 || age > 100) {
            return res.status(400).json({ error: "Enter a valid age (1-100)" });
        }

        // Check if the email already exists in the database
        const checkUserQuery = "SELECT * FROM users WHERE email = ?";
        db.query(checkUserQuery, [email], async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: "Email already registered" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the database
            const sql = "INSERT INTO users (name, email, password, contact, age, role) VALUES (?, ?, ?, ?, ?, 'user')";
            db.query(sql, [name, email, hashedPassword, contact, age], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                res.status(201).json({ message: "User registered successfully" });
            });
        });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 🔹 User Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        const user = results[0];

        try {
            const match = await bcrypt.compare(password, user.password);
            
            if (!match) {
                console.error("Invalid password for user:", email);
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // ✅ Store user in session
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            };

            console.log("User logged in:", req.session.user);

            res.json({ message: "Login successful", user: req.session.user });

        } catch (bcryptError) {
            console.error("Bcrypt error:", bcryptError);
            res.status(500).json({ error: "Password processing error" });
        }
    });
});

// 🔹 Check Logged-in User Session
app.get("/profile", (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: "Not logged in" });
    }
});

// 🔹 Logout and Destroy Session
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

// 🔹 Start Server
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "User deleted successfully" });
  });
});


// 🔹 Start Server
// 🔹 Fetch All Users (Only Admin)



// 🚀 Start Server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
