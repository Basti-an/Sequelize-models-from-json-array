/**
 * converts a key from snake_case, kebap-case, ALL_CAPS or a combination thereof to camelCase
 */
function toCamelCase(key) {
  // I don't like keys SCREAMING at me, so lowercase if the whole key is uppercase
  const keyWithoutLowerCasedChars = key
    .split("")
    .filter((c) => c === c.toUpperCase())
    .join("");
  if (keyWithoutLowerCasedChars === key) {
    key = key.toLowerCase();
  }

  // replace snake_case with camelCase
  let camel = key.replace(/_(.)/g, (m, c) => c.toUpperCase());

  // replace kebap-case with camelCase
  camel = camel.replace(/-(.)/g, (m, c) => c.toUpperCase());

  // lowercase first char
  // this throws index error if key is an empty string, which is ok for our use case
  camel = camel[0].toLowerCase() + camel.slice(1);

  return camel;
}

function isInt(n) {
  return n % 1 === 0;
}

module.exports = { isInt, toCamelCase };
