const express = require("express");
const { sequelize } = require("./models"); // Assuming your sequelize instance is exported from models/index.js
const cors = require("cors");
const employeeRouter = require("./routes/employeeRoutes");
const attandanceRouter = require("./routes/attandanceRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const helmet = require("helmet");
// server.js atau app.js
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware and routes setup
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log("Middleware - Request Body:", req.body);
  next();
});

app.use(helmet());

app.post("/test", (req, res) => {
  console.log("Test Route Body:", req.body);
  res.json({ data: req.body });
});
app.use("/api", employeeRouter);
app.use("/api", attandanceRouter);
app.use("/api", userRouter);
app.use("/api", authRouter);

app.use(errorHandler);

// Sync the database
sequelize
  .sync({ force: false }) // Set `force: true` to drop tables before recreating them, but use with caution
  .then(() => {
    console.log("Database synchronized");
    // Start the server after the database is synced
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to sync database:", error);
  });
