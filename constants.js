import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
export const PKG_ROOT = path.join(path.dirname(__filename));