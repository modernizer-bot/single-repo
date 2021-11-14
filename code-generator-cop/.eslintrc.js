module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  parser: "babel-eslint",
  extends: ["prettier", "airbnb-base"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    "no-console": 0,
    "comma-dangle": 0,
    "operator-linebreak": 0,
    "implicit-arrow-linebreak": 0,
    "function-paren-newline": 0,
    "no-empty-pattern": 0,
    "no-use-before-define": 0,
    camelcase: 0,
    quotes: [2, "double", { avoidEscape: true }],
  },
};
