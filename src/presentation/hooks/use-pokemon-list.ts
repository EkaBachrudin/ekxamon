import { useQuery } from '@tanstack/react-query';
import { GetPokemonListUseCase } from '../../application/use-cases/get-pokemon-list.usecase';
import { PokemonRepository } from '../../domain/repositories/pokemon.repository';

export const usePokemonList = (repository: PokemonRepository) => {
  const getPokemonListUseCase = new GetPokemonListUseCase(repository);

  return useQuery({
    queryKey: ['pokemon-list'],
    queryFn: () => getPokemonListUseCase.execute(),
  });
};
