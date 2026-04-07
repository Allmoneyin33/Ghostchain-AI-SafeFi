import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { secureAccess, rotateKeys, keyStore } from "./src/lib/ghostchain.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Ghostchain Secure API
  app.post("/api/private/chat", secureAccess, async (req, res) => {
    res.json({ ok: true, secure: true, message: "Ghostchain Secured Response" });
  });

  // Endpoint to get the current key (FOR DEMO ONLY - in real app, this would be handled securely)
  app.get("/api/ghostchain/key", (req, res) => {
    res.json({ currentKey: keyStore.current });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔑 Initial Ghostchain Key: ${keyStore.current}`);
  });
}

startServer();
