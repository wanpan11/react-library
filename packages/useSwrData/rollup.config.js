import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.ts",
  output: {
    dir: "dist",
    entryFileNames: "[name]-[format].js",
  },
  plugins: [
    typescript({
      compilerOptions: { declaration: true, declarationDir: "./dist/types" },
    }),
  ],
};
