#! /usr/bin/env node
const esprima = require("esprima");
var es = require("escodegen");
const fs = require("fs");
const path = require("path");
const matchAll = require("string.prototype.matchall");
require("array-flat-polyfill");
const BaseRule = require("./rules/BaseRule");

const rules = require("./rules");

const allowedType = ["FunctionDeclaration", "ClassDeclaration"];

/* 
  @name Test
  @desc This is a test class
*/
class Test {
  constructor() {
    this.test = "test";
  }
  classMethod() {
    if (false) {
      return this.test;
    } else {
      return "meme";
    }
  }
}

function printErrors(errors, fileName) {
  const relativeFile = path.relative(process.cwd(), fileName);
  console.log(relativeFile);
  console.log(
    relativeFile
      .split("")
      .map(() => "=")
      .join("")
  );
  if (errors.length === 0) {
    console.log("No Errors!");
  } else {
    errors.forEach(error => console.error(error));
  }
}

/* 
  @name parseAst
  @cc 1
  @desc Function to parse the AST of a file
  @arg ast: the syntax tree of the code
  @arg options: an object containing options for parsing
  @ret Array errors
*/
function parseAst(ast, options = {}) {
  const { body } = ast;
  const errors = body.reduce((acc, block) => {
    if (!block) return acc;
    if (!allowedType.includes(block.type)) return acc;
    const typeRules = rules[block.type];
    const errs = Object.keys(typeRules).flatMap(rule => {
      if (typeof typeRules[rule] === "function") {
        const ruleInstance = new typeRules[rule](block);
        return ruleInstance.parse();
      }
      return typeRules[rule].parse(block);
    });
    return [...acc, ...errs];
  }, []);
  return errors;
}

/* 
  @name trimHashbang
  @cc 3
  @desc Function to trim hashbangs from a file
  @arg code: a string containing the code to trim
  @ret String code
*/
function trimHashbang(code) {
  if (code.substring(0, 2) === "#!") {
    var end = code.indexOf("\n");
    var filler = "";
    for (var i = 0; i < end; ++i) {
      filler += " ";
    }
    code = filler + code.substring(end, code.length);
  }
  return code;
}

/*
  @name main
  @cc 1
  @desc main function for archives script
*/
function main() {
  const fileName = process.argv[1];
  const file = trimHashbang(fs.readFileSync(fileName, "utf-8"));
  const ast = esprima.parseModule(file, {
    range: true,
    tokens: true,
    comment: true,
    loc: true
  });
  const astWithComments = es.attachComments(ast, ast.comments, ast.tokens);
  const errors = parseAst(astWithComments, fileName);
  printErrors(errors, fileName);
}

main();
