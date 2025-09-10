import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to delete files safely when a user is deleted
export const deleteFile = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(__dirname, "..", filePath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
};
