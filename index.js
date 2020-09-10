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
createModel(modelName, inputPath);

// create other models from otherInputPaths
otherInputPaths.forEach((path) => {
  const inferredModelName = path.split("/")[path.split("/").length - 1].split(".json")[0];
  createModel(inferredModelName, path);
});

// cleanup generated models by formatting them using eslint
const eslintProcess = exec("eslint ./models --fix", (error) => {
  if (error) {
    throw error;
  }
});

eslintProcess.on("exit", () => {
  console.log("\nFinished generating Sequelize models.");
  // stop non-determinate progress bar
  stopFuse(intervalId);
});
