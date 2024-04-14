import { defineConfig } from "rollup";
import resolver from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
const config = defineConfig({
  input: "./index.ts",
  output: {
    file: "./lib/main.js",
  },
  external: ["chalk"],
  plugins: [resolver(), commonjs(), json(), terser(), esbuild()],
});
export default config;
