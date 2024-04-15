import path from "path";
import { defineConfig, UserConfig } from "vite";

export default defineConfig(() => {
  const config: UserConfig = {
    root: path.resolve(__dirname, "./demo"),
    resolve: {
      alias: {
        "@pak": path.resolve(__dirname, "./package/"),
      },
    },
  };

  return config;
});
