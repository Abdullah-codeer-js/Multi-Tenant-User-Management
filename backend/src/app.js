
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swagger");
const { env } = require("../config/env");

const authRoutes = require("../routes/authRoutes");
const companyRoutes = require("../routes/companyRoutes");
const userRoutes = require("../routes/userRoutes");
const employeeRoutes = require("../routes/employeeRoutes");
const loggingMiddleware = require("../middleware/loggingMiddleware");
const notFoundMiddleware = require("../middleware/notFoundMiddleware");
const errorMiddleware = require("../middleware/errorMiddleware");

const app = express();

app.use(loggingMiddleware);
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Multi-Tenant User Management API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
