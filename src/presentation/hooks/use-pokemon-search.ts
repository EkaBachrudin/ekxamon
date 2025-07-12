import { useState, useEffect } from 'react';
import { SearchPokemonUseCase } from '../../application/use-cases/search-pokemon.usecase';
import { PokemonRepository } from '../../domain/repositories/pokemon.repository';
import { Pokemon } from '../../domain/entities/pokemon';

export const usePokemonSearch = (repository: PokemonRepository) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchPokemonUseCase = new SearchPokemonUseCase(repository);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      try {
        const searchResults = await searchPokemonUseCase.execute(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
      setIsSearching(false);
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isSearching
  };
};
