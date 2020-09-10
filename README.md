# sequelize-model-from-json-array
Create Sequelize models for NodeJS (.js) from JSON files containing examples of your models. Field names and types of the sequelize models will be inferred from the JSON input.

To see in action what this does exactly, setup the project, take a look at the json files in the examples folder and run `npm run test` 🚀

## Why?
Sometimes you have to import data from a new JSON API to your database and find out that the returned objects contain hundreds of fields.
Writing a Sequelize model by Hand for that amount of fields would be an incredible waste of time - 
this small project tries to help by looking at examples (simple .json file containing an array of objects) and subsequently create the Sequelize Models for you automatically!

## Setup
To setup the project, simply clone it into a clean directory, run `npm i` or `yarn` to install the only external dependency ESLint (used for cleaning up the generated model file)

## Creating Models
In order to run the program, you need to supply at least a model name and a filepath to your JSON file containing the examples used for inferring data types.
You can also supply more than one JSON file, but the name for those models will be inferred from the JSON file name in that case.

### simple example:
`npm run start pokedex ./examples/pokemon.json`

### example with multiple filenames:
`node index cars ./examples/cars.json ./examples/people.json ./examples/pokemon.json ./examples/narcosEpisodes.json`

## Limitations
Currently the program cannot handle nested values - these would require creating multiple models and their associations
I'm going to implement simple 1:1 and 1:N associations in the near future.

## Shoutouts:
* Biuni/PokemonGO-Pokedex for pokemon dataset
* pixelastic/fakeusers for people dataset
