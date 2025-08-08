import { Pokemon, PokemonList } from "../entities/pokemon";

export interface PokemonRepository {
  getPokemonList(offset: number, limit: number): Promise<PokemonList>;
  getPokemonById(id: number): Promise<Pokemon>;
  searchPokemon(query: string, signal?: AbortSignal): Promise<Pokemon[]>;
  getPokemonByType(type: string): Promise<Pokemon[]>;
}
