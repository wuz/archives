const BaseRule = require("./BaseRule");

/*
  @name Description
  @desc A rule that requires a archives block to have a description
*/
class Description extends BaseRule {
  constructor(block) {
    super(block);
    this.DESC_REGEX = /\@desc:?\s+(.+)$/gim;
    this.ERRORS = {
      NO_DESC_ERROR: fn => ({
        error: `Expected ${this.getType()} ${fn} to have @desc tag`,
        name: "no-desc-tag"
      })
    };
  }

  parse() {
    if (!this.block.leadingComments) return [];
    const matches = [...this.matchAll(this.archiveComment, this.DESC_REGEX)];
    const match = matches[0] && matches[0][1];
    const { name } = this.block.id;
    const errors = [];
    if (!match) errors.push(this.ERRORS.NO_DESC_ERROR(name));
    return errors;
  }
}

module.exports = Description;
