import { RowDataPacket } from "mysql2";

export interface IUser extends RowDataPacket {
  name: string;
  email: string;
  password: string;
}
