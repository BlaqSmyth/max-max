import { createServer } from "http";
import { createApp } from "./app";
import { setupVite, serveStatic, log } from "./vite";

(async () => {
  const app = await createApp();

  if (app.get("env") === "development") {
    const server = createServer(app);
    await setupVite(app, server);
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
      log(`serving on port ${port}`);
    });
  } else {
    serveStatic(app);
    const server = createServer(app);
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
      log(`serving on port ${port}`);
    });
  }
})();
