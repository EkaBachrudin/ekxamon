import { useQuery } from '@tanstack/react-query';
import { Pokemon } from '../../domain/entities/pokemon';
import { GetPokemonByIdUseCase } from '../../application/use-cases/get-pokemon-by-id.usecase';

export const usePokemonDetail = (id: number, getPokemonById: GetPokemonByIdUseCase) => {
  return useQuery<Pokemon, Error>({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonById.execute(id),
    enabled: !!id,
  });
};
