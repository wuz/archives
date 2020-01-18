const name = require("./name");
const complexity = require("./complexity");
const meta = require("./meta");
const description = require("./description");
const args = require("./args");

module.exports = {
  FunctionDeclaration: {
    name,
    complexity,
    meta,
    description,
    args
  },
  ArrowFunctionExpression: {
    name,
    complexity,
    meta,
    description,
    args
  },
  ClassDeclaration: {
    name,
    meta,
    description
  },
  ClassExpression: {
    name,
    meta,
    description
  }
};
