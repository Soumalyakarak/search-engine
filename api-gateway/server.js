import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(morgan("dev"));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "api-gateway" });
});

// Auth service proxy
// /api/auth/login-user → http://localhost:6001/api/login-user
app.use("/api/auth", createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || "http://localhost:6001",
  changeOrigin: true,
  xfwd: true,
  pathRewrite: { "^/": "/api/" },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
      proxyReq.removeHeader("origin");
      proxyReq.removeHeader("referer");
      fixRequestBody(proxyReq, req, res);
    },
  },
}));

// Search service proxy
// /api/search?q=tree → http://localhost:4000/search?q=tree
app.use("/api/search", createProxyMiddleware({
  target: process.env.SEARCH_SERVICE_URL || "http://localhost:4000",
  changeOrigin: true,
  xfwd: true,
  pathRewrite: { "^/": "/search" },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
      proxyReq.removeHeader("origin");
      proxyReq.removeHeader("referer");
      fixRequestBody(proxyReq, req, res);
    },
  },
}));

app.use("/api/contests", createProxyMiddleware({
  target: process.env.SEARCH_SERVICE_URL || "http://localhost:4000",
  changeOrigin: true,
  xfwd: true,
  pathRewrite: { "^/": "/contests/" },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
      proxyReq.removeHeader("origin");
      proxyReq.removeHeader("referer");
      fixRequestBody(proxyReq, req, res);
    },
  },
}));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use((err, _req, res, _next) => {
  console.error("Gateway error:", err);
  res.status(500).json({ message: "Internal gateway error" });
});

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});