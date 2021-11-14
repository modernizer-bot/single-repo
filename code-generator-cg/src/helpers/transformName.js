function snakeToCamel(str) {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

function snakeToPascal(str) {
  const name = snakeToCamel(str);
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return nameCapitalized;
}

module.exports = { snakeToCamel, snakeToPascal };
