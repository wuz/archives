const BaseRule = require("./BaseRule");

/*
  @name Name
  @desc A rule that requires a archive object to have a description
*/
class Name extends BaseRule {
  constructor(block) {
    super(block);
    this.NAME_REGEX = /\@name:?\s+([a-zA-Z]+)$/gim;
    this.ERRORS = {
      NAME_ERROR: (expected, recieved) => ({
        error: `Expected ${this.getType()} name to be ${expected}. Recieved ${recieved} instead.`,
        name: "incorrect-name-tag"
      }),
      NO_NAME_ERROR: fn => ({
        error: `Expected ${this.getType()} ${fn} to have @name tag`,
        name: "no-name-tag"
      })
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
