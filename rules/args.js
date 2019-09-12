const BaseRule = require("./BaseRule");

class Args extends BaseRule {
  constructor(block) {
    super(block);
    this.ARGS_REGEX = /\@arg:?\s+([a-zA-Z0-9_]+):?\s+(.+)\n/gim;
    this.ERRORS = {
      NO_ARG_ERROR: (fn, arg) =>
        `Expected ${this.getType()} ${fn} to have @arg tag for argument ${arg}`,
      WRONG_ARG_ERROR: (fn, arg) =>
        `Unexpected argument ${arg} for ${this.getType()} ${fn}.`
    };
  }

  findIdentifier(param) {
    if (param.type === "Identifier") {
      return param.name;
    } else if (param.type === "AssignmentPattern") {
      return param.left.name;
    }
  }

  parse() {
    if (!this.block.leadingComments) return [];
    const errors = [];
    const matches = [...this.matchAll(this.archiveComment, this.ARGS_REGEX)];
    const argNames = matches.map(match => match[1]);
    const argDesc = matches.map(match => match[2]);
    const { name: fnName } = this.block.id;
    const { params } = this.block;
    if (!params && params.length === 0) return errors;
    const paramNames = params.map(this.findIdentifier).filter(name => !!name);
    paramNames.forEach(name => {
      if (!argNames.includes(name))
        errors.push(this.ERRORS.NO_ARG_ERROR(fnName, name));
    });
    argNames.forEach(argName => {
      if (!paramNames.includes(argName))
        errors.push(this.ERRORS.WRONG_ARG_ERROR(fnName, argName));
    });
    return errors;
  }
}

module.exports = Args;
