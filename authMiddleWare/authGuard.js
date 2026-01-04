import jwt from "jsonwebtoken";
import User from "../model/user_model.js";

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated, no token" });
  }
  try {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");
    // if(!req.user) {return res.status(404).json({message: "User not found"})}
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authenticated, invalid token" });
  }
};

//Role protectors
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next(); // If the role of user in the request matches the allowed role, proceed
    } else return res.status(403).json({ message: "Access denied" });
  };
};
