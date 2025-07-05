import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";

export default {
  input: "./src/index.tsx",
  output: { dir: "dist" },
  external: ["react", "react-dom", "react-router-dom", "react/jsx-runtime"],
  plugins: [
    del({ targets: "dist/*" }),
    typescript({
      tsconfig: "../../tsconfig.json",
      compilerOptions: {
        declaration: true,
        declarationDir: "./dist/types",
        outDir: "./dist",
      },
    }),
  ],
};
