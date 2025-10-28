import { pokemonApiClient } from '../axios/axios-client';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';
import { Pokemon, PokemonList, EvolutionStage } from '../../../domain/entities/pokemon';

// Helper function to extract Pokemon ID from URL
function extractPokemonId(url: string): number {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2], 10);
}

export class PokemonAxiosRepository implements PokemonRepository {
  async getPokemonList(offset = 0, limit = 20): Promise<PokemonList> {
    const response = await pokemonApiClient.get<PokemonList>(
      `/pokemon?offset=${offset}&limit=${limit}`
    );
    
    const pokemonsWithDetails = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const id = extractPokemonId(pokemon.url);
        const detailsResponse = await pokemonApiClient.get(`/pokemon/${id}`);
        return {
          ...pokemon,
          id,
          imageUrl: detailsResponse.data.sprites.front_default,
          types: detailsResponse.data.types.map((t: {type: {name: string}}) => t.type.name)
        };
      })
    );
    
    return {
      ...response.data,
      results: pokemonsWithDetails
    };
  }

  async searchPokemon(query: string, signal?: AbortSignal): Promise<Pokemon[]> {
    const response = await pokemonApiClient.get<PokemonList>(
      `/pokemon?limit=100000`,
      { signal }
    );
    
    const pokemonsWithIds = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const id = extractPokemonId(pokemon.url);
        const detailsResponse = await pokemonApiClient.get(`/pokemon/${id}`, { signal });
        
        return {
          ...pokemon,
          id,
          imageUrl: detailsResponse.data.sprites.front_default,
          types: detailsResponse.data.types.map((t: {type: {name: string}}) => t.type.name)
        };
      })
    );
    
    const filtered = pokemonsWithIds.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered;
  }

  async getPokemonByType(type: string): Promise<Pokemon[]> {
    const response = await pokemonApiClient.get(`/type/${type}`);
    const pokemons = response.data.pokemon;
    
    const pokemonsWithDetails = await Promise.all(
      pokemons.map(async (p: {pokemon: {url: string, name: string}}) => {
        const id = extractPokemonId(p.pokemon.url);
        const detailsResponse = await pokemonApiClient.get(`/pokemon/${id}`);
        
        return {
          id,
          name: p.pokemon.name,
          url: p.pokemon.url,
          imageUrl: detailsResponse.data.sprites.front_default,
          types: detailsResponse.data.types.map((t: {type: {name: string}}) => t.type.name)
        };
      })
    );
    
    return pokemonsWithDetails;
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    const pokemonResponse = await pokemonApiClient.get(`/pokemon/${id}`);
    
    let description: string | undefined;
    let species: string | undefined;
    let genderRate = -1;
    let weaknesses: string[] = [];
    let evolutionChain: EvolutionStage[] = [];
    
    try {
      const speciesResponse = await pokemonApiClient.get(`/pokemon-species/${id}/`);
      const speciesData = speciesResponse.data;
      
      genderRate = speciesData.gender_rate ?? -1;
      
      const englishEntry = speciesData.flavor_text_entries.find(
        (entry: {language: {name: string}}) => entry.language.name === 'en'
      );
      
      if (englishEntry) {
        description = englishEntry.flavor_text
          .replace(/\f/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      const englishGenus = speciesData.genera.find(
        (genus: {language: {name: string}}) => genus.language.name === 'en'
      );
      if (englishGenus) {
        species = englishGenus.genus.replace(' Pokémon', '');
      }
      
      const types = pokemonResponse.data.types.map((t: {type: {name: string}}) => t.type.name);
      weaknesses = await this.getTypeWeaknesses(types);
      
      if (speciesData.evolution_chain?.url) {
        evolutionChain = await this.getEvolutionChain(speciesData.evolution_chain.url);
      }
    } catch (error) {
      console.error(`Failed to fetch species or type data for Pokemon ${id}:`, error);
    }
    
    return {
      id: pokemonResponse.data.id,
      name: pokemonResponse.data.name,
      url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
      imageUrl: pokemonResponse.data.sprites.front_default,
      types: pokemonResponse.data.types.map((typeInfo: {type: {name: string}}) => typeInfo.type.name),
      description,
      weight: pokemonResponse.data.weight,
      height: pokemonResponse.data.height,
      abilities: pokemonResponse.data.abilities.map((a: {ability: {name: string}}) => a.ability.name),
      species,
      genderRate,
      weaknesses,
      evolutionChain,
    };
  }

  private async getTypeWeaknesses(types: string[]): Promise<string[]> {
    const weaknesses = new Set<string>();
    
    for (const typeName of types) {
      try {
        const typeResponse = await pokemonApiClient.get(`/type/${typeName}`);
        const damageRelations = typeResponse.data.damage_relations;
        
        damageRelations.double_damage_from.forEach((type: {name: string}) => {
          weaknesses.add(type.name);
        });
      } catch (error) {
        console.error(`Failed to fetch weaknesses for type ${typeName}:`, error);
      }
    }
    
    return Array.from(weaknesses);
  }
  
  private async getEvolutionChain(chainUrl: string): Promise<EvolutionStage[]> {
    try {
      const response = await pokemonApiClient.get(chainUrl);
      const chainData = response.data.chain;
      const evolutionChain: EvolutionStage[] = [];
      
      let currentStage = chainData;
      while (currentStage) {
        const speciesName = currentStage.species.name;
        
        const pokemonResponse = await pokemonApiClient.get(`/pokemon/${speciesName}`);
        const pokemonData = pokemonResponse.data;
        
        const minLevel = currentStage.evolves_to[0]?.evolution_details[0]?.min_level;
        
        evolutionChain.push({
          species: speciesName,
          imageUrl: pokemonData.sprites.front_default,
          types: pokemonData.types.map((t: {type: {name: string}}) => t.type.name),
          minLevel
        });
        
        currentStage = currentStage.evolves_to[0];
      }
      
      return evolutionChain;
    } catch (error) {
      console.error(`Failed to fetch evolution chain:`, error);
      return [];
    }
  }
}
