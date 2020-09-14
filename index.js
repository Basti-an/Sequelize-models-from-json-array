const fs = require("fs");
const { exec } = require("child_process");

const generateSequelizeModel = require("./generateModel");
const { startFuse, stopFuse } = require("./fuse");

// process has to be called with at least 2 command line arguments for modelName and inputPath
if (process.argv.length < 4) {
  throw Error("Not enough arguments provided, script expects a modelName and an input file path");
}

const [modelName, inputPath] = process.argv.slice(2, 4);

// all further args, used for creating multiple models
const otherInputPaths = process.argv.slice(4);

// some checks for our inputPaths
try {
  [inputPath, ...otherInputPaths].forEach((path) => {
    const fileExtension = path.split(".")[path.split(".").length - 1];
    if (fileExtension.toLowerCase() !== "json") {
      throw Error("wrong file extension");
    }
  });
} catch (e) {
  throw Error("file does not have the necessary .json file extension");
}

function createModel(name, path) {
  const examples = JSON.parse(fs.readFileSync(path));

  console.log(`\nFound ${examples.length} examples for model: ${name}`);
  console.log(`Generating model: ${name}`);

  generateSequelizeModel(name, examples);
  console.log(`Generated model: ${name}`);
}

// start a nice animated progress bar
const intervalId = startFuse(30, 1, 38);

// create main model
const associations = {};
associations[modelName] = createModel(modelName, inputPath);

// create other models from otherInputPaths
otherInputPaths.forEach((path) => {
  const inferredModelName = path.split("/")[path.split("/").length - 1].split(".json")[0];
  associations[inferredModelName] = createModel(inferredModelName, path);
});

function writeIndexFile(associations) {
  // create index file for models containing associations
  let indexTemplate = fs.readFileSync("./models/index.js.tmp").toString();
  const importStatements = [];
  const modelNames = [];
  const relations = [];
  Object.keys(associations).forEach((name) => {
    // create imports
    const importStatement = `const ${name} = require("./${name}")(sequelize, Sequelize);`;
    importStatements.push(importStatement);
    /**
     * @TODO relations
     */
    modelNames.push(name);
  });
  indexTemplate = indexTemplate.replace("{{imports}}", importStatements.join("\n"));
  indexTemplate = indexTemplate.replace("{{relations}}", relations.join(""));
  indexTemplate = indexTemplate.replace("{{modelNames}}", modelNames.join(",\n"));
  fs.writeFileSync("./models/index.js", indexTemplate);
}

writeIndexFile(associations);

// cleanup generated models by formatting them using eslint
const eslintProcess = exec("eslint ./models --fix", (error) => {
  if (error) {
    console.log(error);
    throw error;
  }
});

eslintProcess.on("exit", () => {
  console.log("\nFinished generating Sequelize models.");
  // stop non-determinate progress bar
  stopFuse(intervalId);
});
