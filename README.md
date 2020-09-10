# Create Sequelize Models from JSON-Array
Creates Sequelize model files from JSON files containing examples of instances of the desired models. 
Field names and types of the sequelize models will be inferred from the JSON input.

To see in action what this does exactly, setup the project, take a look at the json files in the examples folder and run `npm run test` 🚀

## Why?
Sometimes you have to import data from a new JSON API to your database and find out that the returned objects contain hundreds of fields.
Writing a Sequelize model by Hand for that amount of fields would be an incredible waste of time - 
This (very) small program tries to help by looking at your JSON objects (simple .json file containing an array of objects) and subsequently creates the Sequelize Models for you automatically!

## Setup
`npm i` followed by `npm run test` to verify that a models folder was created containing valid Sequelize model files.

## Creating Models
In order to run the program, you need to supply at least a model name and a filepath to your JSON file as command line arguments.
You can also supply more than one JSON file, but the name for those models will be inferred from the JSON file name in that case.

### simple example:
`npm run start pokedex ./examples/pokemon.json`

### example with multiple filenames:
`node index cars ./examples/cars.json ./examples/people.json ./examples/pokemon.json ./examples/narcosEpisodes.json`

## Limitations
Currently the program cannot handle nested values - these would require creating multiple models and their associations

## TODOS
* implement 1:1 and 1:N associations by generating multiple models per input file
* implement support for wildcard paths ("./examples/*")

## Shoutouts:
* Biuni/PokemonGO-Pokedex for pokemon dataset
* pixelastic/fakeusers for people dataset
