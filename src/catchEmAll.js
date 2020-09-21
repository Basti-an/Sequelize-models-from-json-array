const fetch = require("node-fetch");
const fs = require("fs");

// get OG pokemon from poke API and write them to a JSON file

const examples = [];

async function fetchPokemonData(pokemon) {
  const { url } = pokemon;
  const response = await fetch(url);
  const pokeData = await response.json();
  return pokeData;
}

async function fetchKantoPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const allPokemon = await response.json();
  for (let i = 0; i < allPokemon.results.length; i++) {
    const pokemon = allPokemon.results[i];
    const pokeData = await fetchPokemonData(pokemon);
    examples.push(pokeData);
    console.log(pokeData.id);
  }
  fs.writeFileSync("./examples/kantoPokedex.json", JSON.stringify(examples, null, 4));
}

fetchKantoPokemon();
