import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'dist' directory
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Fallback to index.html for SPA routing (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
