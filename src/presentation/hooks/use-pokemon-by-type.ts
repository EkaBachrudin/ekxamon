import { useState, useEffect } from 'react';
import { PokemonRepository } from '../../domain/repositories/pokemon.repository';
import { Pokemon } from '../../domain/entities/pokemon';

export const usePokemonByType = (repository: PokemonRepository, type: string) => {
  const [data, setData] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!type) {
      setData([]);
      return;
    }

    const fetchPokemonByType = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await repository.getPokemonByType(type);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch Pokémon by type'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonByType();
  }, [repository, type]);

  return { data, isLoading, error };
};
