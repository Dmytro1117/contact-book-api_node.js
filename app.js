const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
dotenv.config();
const swaggerDocument = require("./swagger.json");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRouter");
const contactsRouter = require("./routes/contactsRoutes");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "Error",
    code: 404,
    message: "API documentation on routes: /api-docs",
    data: "Not found",
  });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({
    status: "Error",
    code: status,
    message,
  });
});

module.exports = app;
