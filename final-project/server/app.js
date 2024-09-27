const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { Server } = require("socket.io");

const employeeRouter = require("./routes/employeeRoutes");
const attendanceRouter = require("./routes/attandanceRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const leaveRouter = require("./routes/leaveRoutes");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// const options = {
//   key: fs.readFileSync(path.join(__dirname, "ssl/192.168.1.8-key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "ssl/192.168.1.8.pem")),
// };

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://10.10.101.209:5173",
      "https://localhost:5173",
      "https://192.168.1.8:5173",
      "https://bhf9dmsr-5173.asse.devtunnels.ms",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://10.10.101.209:5173",
      "https://localhost:5173",
      "https://192.168.1.8:5173",
      "https://bhf9dmsr-5173.asse.devtunnels.ms",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// API routes
app.use("/api", employeeRouter);
app.use("/api", attendanceRouter);
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", leaveRouter);

// Error handling middleware
app.use(errorHandler);

// Socket.IO setup for real-time chat
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinDivision", (divisionId) => {
    socket.join(`division-${divisionId}`);
    console.log(`User ${socket.id} joined division ${divisionId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { message, userId, divisionId } = data;
    try {
      console.log("Message received:", message);
      const chat = await sequelize.models.Chats.create({
        message,
        user_id: userId,
        division_id: divisionId,
      });

      const user = await sequelize.models.Users.findByPk(userId, {
        include: [
          {
            model: sequelize.models.Employees,
            attributes: ["profile_picture"],
          },
        ],
      });

      io.to(`division-${divisionId}`).emit("receiveMessage", {
        ...chat.toJSON(),
        user: {
          username: user.username,
          profile_picture: user.Employee.profile_picture,
        },
      });
    } catch (error) {
      console.error("Error saving chat to database:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Sync the database and start the server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synchronized");
    server.listen(PORT, () => {
      console.log(`Server is running on https://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to sync database:", error);
  });
