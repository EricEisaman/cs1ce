import css from "rollup-plugin-css-only";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import { string } from "rollup-plugin-string";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-replace';

console.log("process.env: ");
console.log(process.env);

const prod = (process.env.PROD === "true");
const buildType = process.env.BUILD_TYPE;
const version = process.env.VERSION;
let i, o;

switch (buildType) {
  case "engine":
    i = "src/engine/main.js";
    o = prod
      ? `dist/${process.env.VERSION}/cs1-engine.min.js`
      : `public/staging/cs1-engine.js`;
    break;
  case "app":
    i = "src/app/main.js";
    o = prod
      ? `dist/${process.env.VERSION}/cs1-app.min.js`
      : `public/staging/cs1-app.js`;
    break;
  case "socket":
    i = "src/engine/modules/socket.js";
    o = prod
      ? `dist/${process.env.VERSION}/cs1-socket.min.js`
      : `public/staging/cs1-socket.min.js`;
    break;
}

console.log("prod: ", prod);
console.log("buildType: ", buildType);
console.log("version: ", version);
console.log("i: ", i);
console.log("o: ", o);

export default {
  input: i,
  output: {
    file: o,
    format: "iife", // immediately-invoked function expression — suitable for <script> tags
    sourcemap: (buildType=='game') || !prod,
    name: "CS1"
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    ,
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    json(),
    string({
      // Required to be specified
      include: "**/*.html",

      // Undefined by default
      exclude: ["**/index.html"]
    }),
    css({ output: "public/bundle.css" }),
    //resolve(), // tells Rollup how to find date-fns in node_modules
    //cleanup({comments: 'none'}),
    prod && terser() // minify, but only in production
  ]
};
