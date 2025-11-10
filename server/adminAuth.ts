import { randomBytes } from "crypto";

interface AdminSession {
  token: string;
  createdAt: number;
  expiresAt: number;
}

class AdminAuthService {
  private sessions: Map<string, AdminSession> = new Map();
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  generateToken(): string {
    return randomBytes(32).toString("hex");
  }

  createSession(): string {
    const token = this.generateToken();
    const now = Date.now();
    
    this.sessions.set(token, {
      token,
      createdAt: now,
      expiresAt: now + this.SESSION_DURATION,
    });

    // Clean up expired sessions
    this.cleanupExpiredSessions();

    return token;
  }

  validateToken(token: string): boolean {
    const session = this.sessions.get(token);
    if (!session) return false;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(token);
      return false;
    }

    return true;
  }

  revokeToken(token: string): void {
    this.sessions.delete(token);
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [token, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(token);
      }
    }
  }
}

export const adminAuthService = new AdminAuthService();

export function adminAuthMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7); // Remove "Bearer "
  
  if (!adminAuthService.validateToken(token)) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  next();
}

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === adminPassword;
}
