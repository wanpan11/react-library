import { fileURLToPath } from "node:url";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";

const getFileUrl = path => {
  return fileURLToPath(new URL(path, import.meta.url));
};

export default {
  input: [getFileUrl("./package/useContainer/index.tsx"), getFileUrl("./package/CacheRoute/index.tsx")],
  output: {
    dir: "dist",
    entryFileNames: "[name]-[format].js",
  },
  plugins: [typescript(), babel()],
};
