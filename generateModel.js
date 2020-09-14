const fs = require("fs");

const { toCamelCase, isInt } = require("./utilities");

// these are more specific sub types which should not be overwritten by generic types
const specialTypes = ["DataTypes.STRING(\"MAX\")"];

function inferDataType(value, key, associatedModels) {
  if (value === null) {
    return null;
  }

  if (typeof value === "boolean") {
    return "DataTypes.BOOLEAN";
  }

  if (typeof value === "number") {
    if (isInt(value)) {
      return "DataTypes.INTEGER";
    }
    return "DataTypes.FLOAT";
  }

  if (typeof value === "string") {
    // check if string can be parsed as date
    if (!isNaN(new Date(value).getTime()) && isNaN(parseInt(value, 10))) {
      // the second check for isNaN(parseInt(value)) is required because
      // some generic string values like "001" are parsed as dates although they aren't datestrings
      // therefore if the value can also be parsed as an integer, it cannot be a valid datestring
      return "DataTypes.DATE";
    }
    if (value.length > 140) {
      // NVARCHAR(255) is the type created when using DataTypes.STRING by default
      // in oder to fit bigger strings, we can use DataTypes.String(n) or DataTypes.String("MAX")
      // 140 chars is used as a heuristic, because I assume that other examples might be longer
      return "DataTypes.STRING('MAX')";
    }
    return "DataTypes.STRING";
  }

  if (typeof value === "object") {
    // having an object here hints at a structure with associations and therefore
    // should'nt be expressed as a single Sequelize Model
    if (Array.isArray(value)) {
      // if the elements are not complex objects, we can STUFF them as a comma separated string
      if (value[0] && typeof value[0] !== "object") {
        return "DataTypes.STRING('MAX')";
      }
      // we found a 1:n association to another model
      // so lets save our array as examples and create a model for that later
      if (!associatedModels[key]) {
        associatedModels[key] = { name: toCamelCase(key), relation: "1:n", examples: [] };
      }
      associatedModels[key].examples.push(...value);
    } else {
      // we found a 1:1 association to another model
      // so lets save the value as an example and create a model for that later
      if (!associatedModels[key]) {
        associatedModels[key] = { relation: "1:1", examples: [] };
      }
      associatedModels[key].examples.push(value);
    }
    return "DataTypes.NESTED";
  }

  return null;
}

function generateSequelizeModel(modelName, examples) {
  const body = {};
  const associatedModels = [];

  examples.forEach((example) => {
    Object.entries(example).forEach(([key, value]) => {
      const camelCasedKey = toCamelCase(key);

      // don't try to override special cases
      if (
        body[camelCasedKey] &&
        specialTypes.includes(body[camelCasedKey].type)
      ) {
        return;
      }

      const inferredType = inferDataType(value, key, associatedModels);

      body[camelCasedKey] = {
        type: inferredType || (body[camelCasedKey]
          ? body[camelCasedKey].type
          : "???"),
        field: key,
      };
    });
  });

  // delete all keys with nested data, as we cannot support them without associations
  Object.entries(body).forEach(([key, value]) => {
    if (value.type === "DataTypes.NESTED") {
      console.log(`Deleted a key containing nested data: "${key}"`);
      delete body[key];
    }
  });

  // create pretty printed JSON and replace the stringified types by literals
  // e.g: {"type": "DataTypes.STRING"} => {"type": DataTypes.STRING}
  // the resulting file should be formatted using Eslint or something similar
  const payload = JSON.stringify(body, null, 4).replace(/"(DataTypes.*)"/g, "$1");

  const template = `
    ${payload.length === 2 ? "// eslint-disable-next-line no-unused-vars" : ""}
    const ${modelName} = (sequelize, DataTypes) => {
      return sequelize.define(
        "${modelName}",
        ${payload}
        ,{
          timestamps: false,
        }
      );
    };
    module.exports = ${modelName};
  `;
  if (!fs.existsSync("./models")) {
    fs.mkdirSync("./models");
  }
  fs.writeFileSync(`./models/${modelName}.js`, template);

  Object.entries(associatedModels).forEach(([key, model]) => {
    // Warning: this generates an endless loop if models have circular references!
    generateSequelizeModel(toCamelCase(key), model.examples);
  });
  return {
    model: modelName,
    associations: {
      "1:n": Object.values(associatedModels).filter((model) => model.relation === "1:n"),
      "1:1": Object.values(associatedModels).filter((model) => model.relation === "1:1"),
    },
  };
}

module.exports = generateSequelizeModel;
