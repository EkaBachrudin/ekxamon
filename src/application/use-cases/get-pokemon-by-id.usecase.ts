import { PokemonRepository } from '../../domain/repositories/pokemon.repository';
import { Pokemon } from '../../domain/entities/pokemon';

export class GetPokemonByIdUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(id: number): Promise<Pokemon> {
    return this.pokemonRepository.getPokemonById(id);
  }
}
