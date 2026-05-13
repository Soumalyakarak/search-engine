import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {

  const token = req.cookies?.access_token;

  if (!token) {
    console.log("No token found");
    return res.status(401).json({
      message: "Unauthorized - No token",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT error:", error.message);
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
};
