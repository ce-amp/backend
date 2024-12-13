require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/auth.routes");
const designerRoutes = require("./src/routes/designer.routes");
const playerRoutes = require("./src/routes/player.routes");
const userRoutes = require("./src/routes/user.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerDocument = require("yamljs");

const app = express();

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz Game API",
      version: "1.0.0",
      description: "API documentation for the Quiz Game application",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "{protocol}://{hostname}:{port}",
        description: "Dynamic server",
        variables: {
          protocol: {
            enum: ["http", "https"],
            default: "http",
          },
          hostname: {
            default: "localhost",
          },
          port: {
            default: "8000",
          },
        },
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
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Expose swagger.json
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Expose swagger.yaml
app.get("/swagger.yaml", (req, res) => {
  res.setHeader("Content-Type", "text/yaml");
  res.send(swaggerDocument.stringify(swaggerSpec, 10));
});

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
