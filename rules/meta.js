const BaseRule = require("./BaseRule");

class Meta extends BaseRule {
  constructor(block) {
    super(block);
    this.ERRORS = {
      NO_DOC_ERROR: fn => `Expected function ${fn} to have archives docblock`
    };
  }

  parse() {
    if (!this.block.leadingComments) return [];
    const errors = [];
    const { name } = this.block.id;
    if (!this.block.leadingComments)
      errors.push(this.ERRORS.NO_DOC_ERROR(name));
    return errors;
  }
}

module.exports = Meta;
