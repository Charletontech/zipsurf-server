const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  "http://127.0.0.1:5500", 
  "http://localhost:5500",
  "http://localhost:3000",
  "https://zipsurf.veetech.site",
  "https://zipsurf.online"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      // Check if origin is in allowed list or is a subdomain of veetech.site or zipsurf.online
      const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                        origin.endsWith('.veetech.site') || 
                        origin.endsWith('.zipsurf.online');
      
      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(
          new Error(
            "The CORS policy for this site does not allow access from the specified Origin."
          ),
          false
        );
      }
    },
    credentials: true,
  })
);

// ... Rate Limiting ...
// Body Parsing with Raw Body Support for Webhooks
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Welcome to the ZipSurf API!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

module.exports = app;
