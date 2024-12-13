require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/auth.routes");
const designerRoutes = require("./src/routes/designer.routes");
const playerRoutes = require("./src/routes/player.routes");
const userRoutes = require("./src/routes/user.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz Game API",
      version: "1.0.0",
      description: "API documentation for the Quiz Game application",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/designer", designerRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/users", userRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
