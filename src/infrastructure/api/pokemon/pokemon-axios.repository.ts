import { pokemonApiClient } from '../axios/axios-client';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';
import { Pokemon, PokemonList } from '../../../domain/entities/pokemon';

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
    
    // Add IDs to Pokemon results
    const pokemonsWithIds = response.data.results.map(pokemon => ({
      ...pokemon,
      id: extractPokemonId(pokemon.url)
    }));
    
    return {
      ...response.data,
      results: pokemonsWithIds
    };
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    const response = await pokemonApiClient.get<PokemonList>(
      `/pokemon?limit=100`
    );
    
    // Add IDs to Pokemon results
    const pokemonsWithIds = response.data.results.map(pokemon => ({
      ...pokemon,
      id: extractPokemonId(pokemon.url)
    }));
    
    // Filter results based on query
    const filtered = pokemonsWithIds.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered;
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    const response = await pokemonApiClient.get<any>(`/pokemon/${id}`);
    
    return {
      id: response.data.id,
      name: response.data.name,
      url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
      imageUrl: response.data.sprites.front_default,
      types: response.data.types.map((typeInfo: any) => typeInfo.type.name),
    };
  }
}
