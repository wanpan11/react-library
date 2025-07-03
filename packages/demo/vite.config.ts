import path from "path";
import { defineConfig, UserConfig } from "vite";

export default defineConfig(() => {
  const config: UserConfig = {
    root: path.resolve(__dirname, "./"),
  };

  return config;
});
