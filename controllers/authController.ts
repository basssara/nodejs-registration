import { IUser } from "./../types/IUser";
import connection from "../utils/mysql";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";

export async function SignUp(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    connection.query<IUser[]>(
      "SELECT * FROM users WHERE email=?",
      [email],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res
            .status(404)
            .json({ success: "false", message: "Try fetch data later!" });
        }
        if (results.length > 0) {
          return res.status(200).json({ message: "User already exist!" });
        } else {
          const hashed = await bcrypt.hash(password, 7);
          connection.query(
            "INSERT INTO users SET email=?, password=?",
            [email, hashed],
            async (err, resulst) => {
              if (err) {
                console.error(err);
                return res.status(404).json({ success: "fail", data: results });
              } else {
                const accessToken = jwt.sign(
                  { email, password },
                  `${process.env.SECRET_KEY}`,
                  {
                    expiresIn: "5m",
                  }
                );
                const refreshToken = jwt.sign(
                  { email, password },
                  `${process.env.SECRET_KEY}`,
                  {
                    expiresIn: "30d",
                  }
                );
                res.cookie("refreshToken", refreshToken, {
                  maxAge: 30 * 24 * 60 * 60 * 1000,
                  httpOnly: true,
                });
                return res.status(200).json({
                  success: "ok",
                  tokens: {
                    accessToken,
                    refreshToken,
                  },
                });
              }
            }
          );
        }
      }
    );
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: "Something went wrong!" });
  }
}

export async function SignIn(req: Request, res: Response) {
  const { email, password } = req.body;
  connection.query<IUser[]>(
    "SELECT id,email,password FROM users WHERE email=?",
    [email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(404)
          .json({ status: "fail", message: "Try fetch data later!" });
      } else {
        const hashedPassword = results.map((v) => {
          return v.password;
        });
        const comparedPassword = bcrypt.compareSync(
          password,
          hashedPassword[0]
        );
        if (!comparedPassword) {
          return res.status(400).json({ message: "Incorrect password!" });
        }
        const accessToken = jwt.sign(
          { email, password },
          `${process.env.SECRET_KEY}`,
          {
            expiresIn: "5m",
          }
        );
        const refreshToken = jwt.sign(
          { email, password },
          `${process.env.SECRET_KEY}`,
          {
            expiresIn: "30d",
          }
        );
        res.cookie("refreshToken", refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.status(200).json({
          status: "ok",
          message: "Welcome!",
          tokens: { accessToken, refreshToken },
        });
      }
    }
  );
}

export async function getUsers(req: Request, res: Response) {
  try {
    connection.query("SELECT * FROM users", (error, results) => {
      if (error) {
        console.log("Error while fetching", error);
        throw error;
      } else {
        return res.status(200).json({ success: true, data: results });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ success: false });
  }
}
