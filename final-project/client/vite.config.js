/* eslint-disable no-unused-vars */
import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url"; // Import from 'url'
import { dirname } from "path"; // Import from 'path'

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // https: {
    //   key: fs.readFileSync(
    //     path.resolve(__dirname, "../server/ssl/localhost+2-key.pem")
    //   ),
    //   cert: fs.readFileSync(
    //     path.resolve(__dirname, "../server/ssl/localhost+2.pem")
    //   ),
    // },
  },
});
