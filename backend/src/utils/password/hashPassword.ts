import bcrypt from "bcrypt";
import { envs } from "../../index";

export default function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, Number(envs.SALT_ROUNDS));
}