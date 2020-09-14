# Create Sequelize Models from JSON-Array
Creates Sequelize model files from JSON files containing example instances of the desired models. 
Field names and types of the sequelize models will be inferred from the JSON input.

To see in action what this does exactly, setup the project, take a look at the kantoPokedex.json file in the examples folder and run `npm run test` 🚀

## Why?
Sometimes you have to import data from a new JSON API to your database and find out that the returned objects contain hundreds of fields.
Writing the sequelize models and their associations by hand would be a bad way to spend your time.
This small program tries to help you out by looking at your JSON objects and subsequently creates the Sequelize Models and their associations for you automatically!

## Setup
`npm i` followed by `npm run test` to verify that a models folder was created containing valid Sequelize model files.

## Creating Models
In order to run the program, you need to supply at least a model name and a filepath to your JSON file as command line arguments.
You can also supply more than one JSON file, but the name for those models will be inferred from the JSON file name in that case.

### simple example:
`node index pokedex ./examples/kantoPokedex.json`

### example with multiple filenames:
`node index people ./examples/people.json ./examples/narcosEpisodes.json`

## TODOS
* implement support for wildcard paths ("./examples/*") and named command line arguments

## Shoutouts:
* [https://pokeapi.co/](PokeAPI) for amazing pokemon dataset
* [https://github.com/pixelastic/fakeusers](pixelastic/fakeusers) for people dataset
