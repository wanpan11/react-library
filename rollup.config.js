import { fileURLToPath } from "node:url";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";

const getFileUrl = path => {
  return fileURLToPath(new URL(path, import.meta.url));
};

export default {
  input: {
    createContainer: getFileUrl("./package/createContainer/index.tsx"),
    cacheRoute: getFileUrl("./package/cacheRoute/index.tsx"),
  },
  output: {
    dir: "dist",
    entryFileNames: "[name]-[format].js",
  },
  plugins: [typescript(), babel({ babelHelpers: "runtime" })],
};
