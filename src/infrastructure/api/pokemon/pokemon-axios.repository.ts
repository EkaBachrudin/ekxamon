import { pokemonApiClient } from '../axios/axios-client';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';
import { Pokemon, PokemonList } from '../../../domain/entities/pokemon';

export class PokemonAxiosRepository implements PokemonRepository {
  async getPokemonList(offset = 0, limit = 20): Promise<PokemonList> {
    const response = await pokemonApiClient.get<PokemonList>(
      `/pokemon?offset=${offset}&limit=${limit}`
    );
    return response.data;
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    const response = await pokemonApiClient.get<PokemonList>(
      `/pokemon?limit=100`
    );
    
    // Filter results based on query (since PokeAPI doesn't have a search endpoint)
    const filtered = response.data.results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered;
  }
}
