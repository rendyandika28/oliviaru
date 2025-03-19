import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string): string {
  const secret = useRuntimeConfig().jwtSecretKey;
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): { userId: string } | null {
  const secret = useRuntimeConfig().jwtSecretKey;
  try {
    const decoded = jwt.verify(token, secret) as unknown as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}
