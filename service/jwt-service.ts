import jwt from "jsonwebtoken";
import connection from "../utils/mysql";
// export function GenerateToken(args: object) {
//   const accessToken = jwt.sign(args, `${process.env.SECRET_KEY}`, {
//     expiresIn: "5m",
//   });
//   const refreshToken = jwt.sign(args, `${process.env.SECRET_KEY}`, {
//     expiresIn: "30d",
//   });
//   console.log(args);
// }

export class Tokens {
  accessToken(payload: object) {
    jwt.sign(arguments, `${process.env.SECRET_KEY}`, {
      expiresIn: "5m",
    });
  }
  refreshToken(payload: object) {
    jwt.sign(arguments, `${process.env.SECRET_KEY}`, {
      expiresIn: "30d",
    });
  }
}
