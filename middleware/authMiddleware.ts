import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  const { method } = req;
  if (method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    jwt.verify(token, `${process.env.SECRET_KEY}`, (err, decoded) => {
      if (err) {
        res.status(404).json({ status: "fail", message: "Token lifetime Expired!" });
      } else {
        res.locals.jwt = decoded;
        next();
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(401);
  }
};
