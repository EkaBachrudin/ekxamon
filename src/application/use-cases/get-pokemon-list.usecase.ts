import { PokemonRepository } from '../../domain/repositories/pokemon.repository';
import { PokemonList } from '../../domain/entities/pokemon';

export class GetPokemonListUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(offset = 0, limit = 20): Promise<PokemonList> {
    return this.pokemonRepository.getPokemonList(offset, limit);
  }
}
