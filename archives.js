#! /usr/bin/env node
require("array-flat-polyfill");
const esprima = require("esprima");
var es = require("escodegen");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const matchAll = require("string.prototype.matchall");
const program = require("commander");
const BaseRule = require("./rules/BaseRule");
const initialConfig = require("./default-config.json");

const rules = require("./rules");

const allowedType = [
  "FunctionDeclaration",
  "ClassDeclaration",
  "ClassExpression",
  "ArrowFunctionExpression"
];

const getConfigItem = selectorFunc => {
  let config;
  const rcPath = path.resolve(__dirname, ".archivesrc");
  if (program.config) {
    config = JSON.parse(config);
  } else if (fs.existsSync(rcPath)) {
    const stats = fs.lstatSync(rcPath);
    config = JSON.parse(fs.readFileSync(rcPath, "utf-8"));
  } else {
    config = initialConfig;
  }
  return selectorFunc(config);
};

const relativeFile = fileName => path.relative(process.cwd(), fileName);

function printErrors(errors, fileName) {
  if (errors.length === 0) return;
  console.log(chalk.underline(fileName));
  errors.forEach(error => console.error(error));
  console.log();
}

const getErrorColor = errorType => {
  if (errorType === "warn") {
    return chalk.yellow(errorType);
  }
  return chalk.red(errorType);
};

const addErrorData = block => error => {
  const errorType = getConfigItem(config => config[error.name] || "error");
  return `  ${block.loc.start.line}:${block.loc.start.column} ${getErrorColor(
    errorType
  )} ${error.error} ${chalk.white(error.name)}`;
};

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
    if (block.type === "VariableDeclaration") {
      const oldComments = block.leadingComments;
      const oldId = block.declarations[0].id;
      block = block.declarations[0].init;
      block.id = oldId;
      block.leadingComments = oldComments;
    }
    if (block.type === "ExpressionStatement") {
      const oldComments = block.leadingComments;
      block = block.expression.right;
      block.leadingComments = oldComments;
    }
    if (!allowedType.includes(block.type)) return acc;
    const typeRules = rules[block.type];
    const errs = Object.keys(typeRules)
      .flatMap(rule => {
        if (typeof typeRules[rule] === "function") {
          const ruleInstance = new typeRules[rule](block);
          return ruleInstance.parse();
        }
        return typeRules[rule].parse(block);
      })
      .map(addErrorData(block));
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
  @name parseFile
*/

function parseFile(fileName) {
  const file = trimHashbang(fs.readFileSync(fileName, "utf-8"));
  let ast;
  try {
    ast = esprima.parseModule(file, {
      range: true,
      tokens: true,
      comment: true,
      loc: true
    });
  } catch (e) {
    if (program.allFiles) {
      console.log(chalk.underline(fileName));
      console.error(`  ${e.description} on line ${e.lineNumber}`);
      console.log();
    }
  }
  if (!ast) return;
  const astWithComments = es.attachComments(ast, ast.comments, ast.tokens);
  const errors = parseAst(astWithComments, fileName);
  printErrors(errors, fileName);
}

/*
  @name main
  @cc 1
  @desc main function for archives script
*/
function main(lintPath, additionalLintPaths) {
  const config = program.config || initialConfig;
  const paths = [lintPath, ...additionalLintPaths];
  paths.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.error(`${filePath} is not a file or directory`);
      return;
    }
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(filePath);
      files.forEach(file => parseFile(path.resolve(__dirname, filePath, file)));
    }
    if (stats.isFile()) {
      parseFile(filePath);
    }
  });
}

function listTags() {
  console.log("meme");
}

function listRules() {
  console.log("meme");
}

program
  .version("0.0.1")
  .arguments("<file> [additional_files...]")
  .option("-t, --list-tags", "list all possible tags", listTags)
  .option("-r, --list-rules", "list all rules", listRules)
  .option("-d, --disable <rules>", "disable rules")
  .action(main);

program.parse(process.argv);
