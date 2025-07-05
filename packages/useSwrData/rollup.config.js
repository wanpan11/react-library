import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "./dist/index.js",
      format: "es",
    },
    {
      file: "./dist/index.min.js",
      format: "es",
      plugins: [terser()],
    },
  ],
  external: ["react", "react/jsx-runtime", "swr"],
  plugins: [
    del({ targets: "dist/*" }),
    typescript({
      tsconfig: "../../tsconfig.json",
      exclude: ["**/*.test.ts", "**/*.test.tsx"],
      compilerOptions: {
        declaration: true,
        declarationDir: "./dist",
        outDir: "./dist",
      },
    }),
  ],
};
