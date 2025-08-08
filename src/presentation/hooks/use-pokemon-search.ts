import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PokemonRepository } from '../../domain/repositories/pokemon.repository';
import { Pokemon } from '../../domain/entities/pokemon';
import { SearchPokemonUseCase } from '../../application/use-cases/search-pokemon.usecase';

export const usePokemonSearch = (repository: PokemonRepository) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const searchPokemonUseCase = new SearchPokemonUseCase(repository);
  
  const { data, isLoading } = useQuery<Pokemon[], Error>({
    queryKey: ['searchPokemon', debouncedQuery],
    queryFn: ({ signal }) => searchPokemonUseCase.execute(debouncedQuery, signal),
    enabled: debouncedQuery.length > 0,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    query,
    setQuery,
    results: data || [],
    isSearching: isLoading,
  };
};
