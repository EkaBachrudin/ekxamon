import { PokemonList } from "../entities/pokemon";

export interface PokemonRepository {
  getPokemonList(offset?: number, limit?: number): Promise<PokemonList>;
}
