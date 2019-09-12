const matchAll = require("string.prototype.matchall");

module.exports = class BaseRule {
  constructor(block) {
    this.IS_ARCHIVES_REGEX = /(\@)+(?:.+)/gim;
    this.block = block;
    if (!block.leadingComments) {
      this.archiveComment = "";
    } else {
      this.archiveComment = block.leadingComments.find(comment => {
        const isBlockComment = comment.type === "Block";
        const isArchivesComment =
          [...matchAll(comment.value, this.IS_ARCHIVES_REGEX)].length > 0;
        return isBlockComment && isArchivesComment;
      }).value;
    }
    this.matchAll = matchAll;
  }

  getType() {
    if (this.block.type === "ClassDeclaration") {
      return "class";
    }
    return "function";
  }

  parse() {
    return [];
  }
};
