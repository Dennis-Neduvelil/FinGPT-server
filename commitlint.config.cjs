module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 72],
    "header-min-length": [2, "always", 20],
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
    ],
  },
};
