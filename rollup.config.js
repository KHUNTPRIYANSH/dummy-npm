import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { defineConfig } from "rollup";

export default defineConfig({
  input: {
    index: "src/index.js",
    NameSphere: "src/components/NameSphere.jsx",
    // Add more input entries for other components if needed
  },
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
    globals: {
      react: "React",
    },
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: "runtime",
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-transform-runtime"],
    }),
  ],
  external: [
    "react",
    "react-dom",
    "three",
    "@react-three/fiber",
    "@react-three/drei",
  ],
});
