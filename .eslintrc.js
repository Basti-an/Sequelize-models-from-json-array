module.exports = {
  extends: "airbnb-base",
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    es6: true,
  },
  rules: {
    "max-len": ["error", { code: 100 }],
    quotes: ["error", "double"],
    "operator-linebreak": "off",
    "class-methods-use-this": "off",
    camelcase: "off",
    "no-console": "off",
    "no-bitwise": "off",
    "consistent-return": "off",
    "no-multi-str": "off",
    "use-isnan": "error",
    "no-plusplus": "off",
    "no-await-in-loop": "off",
    "no-param-reassign": "off",
    "no-restricted-globals": "off",
  },
};
