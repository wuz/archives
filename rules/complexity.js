const complexity = require("escomplex");
var es = require("escodegen");
const BaseRule = require("./BaseRule");

/*
  @name Complexity
  @desc A rule for setting a functions cyclomatic complexity and making sure it doesn't accidentally change
*/

class Complexity extends BaseRule {
  constructor(block) {
    super(block);
    this.CC_REGEX = /\@cc:?\s+([0-9]+)$/gim;
    this.ERRORS = {
      CC_ERROR: (expected, recieved) =>
        `Expected function to have complexity of ${expected}. Function complexity is ${recieved} instead.`,
      NO_CC_ERROR: fn => `Expected function ${fn} to have @cc tag`
    };
  }

  parse() {
    if (!this.block.leadingComments) return [];
    const matches = [...this.matchAll(this.archiveComment, this.CC_REGEX)];
    const match = matches[0] && matches[0][1];
    const js = es.generate(this.block);
    const complex = complexity.analyse(js);
    const { name } = this.block.id;
    const errors = [];
    if (!match) errors.push(this.ERRORS.NO_CC_ERROR(name));
    if (Number(match) !== complex.cyclomatic)
      errors.push(this.ERRORS.CC_ERROR(complex.cyclomatic, match));
    return errors;
  }
}

module.exports = Complexity;
