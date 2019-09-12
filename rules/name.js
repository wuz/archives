const BaseRule = require("./BaseRule");

class Name extends BaseRule {
  constructor(block) {
    super(block);
    this.NAME_REGEX = /\@name:?\s+([a-zA-Z]+)$/gim;
    this.ERRORS = {
      NAME_ERROR: (expected, recieved) =>
        `Expected ${this.getType()} name to be ${expected}. Recieved ${recieved} instead.`,
      NO_NAME_ERROR: fn => `Expected ${this.getType()} ${fn} to have @name tag`
    };
  }

  parse() {
    if (!this.block.leadingComments) return [];
    const matches = [...this.matchAll(this.archiveComment, this.NAME_REGEX)];
    const match = matches[0] && matches[0][1];
    const { name } = this.block.id;
    const errors = [];
    if (!match) errors.push(this.ERRORS.NO_NAME_ERROR(name));
    if (match !== name) errors.push(this.ERRORS.NAME_ERROR(name, match));
    return errors;
  }
}

module.exports = Name;
