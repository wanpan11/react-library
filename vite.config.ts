import path from "path";
import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  const config: UserConfig = {
    root: path.resolve(__dirname, "./test"),
    build: {
      outDir: path.resolve(__dirname, "dist"),
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@pak": path.resolve(__dirname, "./package/"),
      },
    },
  };

  console.log("config ===> ", config);

  return config;
});
