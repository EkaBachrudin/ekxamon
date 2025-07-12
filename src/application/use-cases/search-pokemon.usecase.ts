import { PokemonRepository } from "../../domain/repositories/pokemon.repository";
import { Pokemon } from "../../domain/entities/pokemon";

export class SearchPokemonUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(query: string): Promise<Pokemon[]> {
    return this.pokemonRepository.searchPokemon(query);
  }
}
