module.exports = {
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        message:
          "Do not import default from lodash-es. Use a namespace import (* as) instead.",
        selector:
          'ImportDeclaration[source.value="lodash-es"] ImportDefaultSpecifier',
      },
    ],
  },
};
