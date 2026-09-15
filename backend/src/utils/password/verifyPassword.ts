import bcrypt from "bcrypt";

export default async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, storedHash);
  } catch (error) {
    console.error("- Failed to compare password:", error);
    return false;
  }
}