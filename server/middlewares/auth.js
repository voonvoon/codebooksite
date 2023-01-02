import jwt from "jsonwebtoken";   //this  create token(use jwt.sign()) and verify it(jwt.verify())
import User from "../models/user.js";


export const requireSignin = (req, res, next) => {
    try {
      const decoded = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json(err);   //401= unauthorized
    }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);  //this req.user is from above middleware
    if (user.role !== 1) {
      return res.status(401).send("Unauthorize");
    } else {
      next();
    }
  } catch(err) {
      console.log(err)
  }
}