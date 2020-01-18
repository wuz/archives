const BaseRule = require("./BaseRule");

/*
  @name Meta
  @desc A rule that checks for meta information, like the presence of a archives block
*/
class Meta extends BaseRule {
  constructor(block) {
    super(block);
    this.ERRORS = {
      NO_DOC_ERROR: fn => ({
        error: `Expected function ${fn} to have archives docblock`,
        name: "no-archives-block"
      })
    };
  }

  parse() {
    const errors = [];
    const { name } = this.block.id;
    if (!this.block.leadingComments)
      errors.push(this.ERRORS.NO_DOC_ERROR(name));
    return errors;
  }
}

module.exports = Meta;
