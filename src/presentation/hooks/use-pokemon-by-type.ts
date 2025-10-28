import { useQuery } from '@tanstack/react-query';
import { PokemonRepository } from '../../domain/repositories/pokemon.repository';
import { Pokemon } from '../../domain/entities/pokemon';

export const usePokemonByType = (repository: PokemonRepository, type: string) => {
  const { data, isLoading, error } = useQuery<Pokemon[], Error>({
    queryKey: ['pokemonByType', type],
    queryFn: () => repository.getPokemonByType(type),
    enabled: !!type,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isLoading, error };
};
