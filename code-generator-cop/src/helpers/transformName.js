class Convert {
  static snakeToCamel(str) {
    return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));
  }

  static snakeToPascal(str) {
    const name = Convert.snakeToCamel(str);
    const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return nameCapitalized;
  }
}

module.exports = Convert;
