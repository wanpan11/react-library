import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.tsx",
  output: { dir: "dist" },
  external: ["react", "react-dom", "react-router-dom", "react/jsx-runtime"],
  plugins: [
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
