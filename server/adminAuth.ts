import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "max-and-max-admin-secret-key";
const TOKEN_EXPIRY = "24h";

export function createSession(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function validateToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded?.role === "admin";
  } catch {
    return false;
  }
}

export function revokeToken(_token: string): void {
  // JWT tokens are stateless — logout is handled client-side by discarding the token
}

export const adminAuthService = { createSession, validateToken, revokeToken };

export function adminAuthMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);

  if (!validateToken(token)) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  next();
}

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === adminPassword;
}
