import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import searchRoutes from "./routes/search.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// app.use(
//   cors({
//     origin:  process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );


app.use(cookieParser()); //read cookies

app.use("/search", searchRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Search service running at http://localhost:${PORT}`);
});
