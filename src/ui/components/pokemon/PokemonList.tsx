import { useState } from 'react';
import Link from 'next/link';
import { usePokemonList } from '../../../presentation/hooks/use-pokemon-list';
import { usePokemonSearch } from '../../../presentation/hooks/use-pokemon-search';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';

const PAGE_SIZE = 20;

interface PokemonListProps {
  repository: PokemonRepository;
}

export default function PokemonList({ repository }: PokemonListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const offset = currentPage * PAGE_SIZE;
  
  const { 
    query, 
    setQuery, 
    results: searchResults, 
    isSearching 
  } = usePokemonSearch(repository);
  
  const { data, isLoading, error } = usePokemonList(
    repository,
    offset,
    PAGE_SIZE
  );

  const totalPages = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 0;

  // Determine which data to display
  const showSearchResults = query.trim() !== '';
  const displayResults = showSearchResults ? searchResults : data?.results;
  const displayLoading = isSearching || isLoading;

  if (error) return <div>Error loading Pokémon</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pokémon List</h1>
      
      {displayLoading && <div>Loading...</div>}
      
      <div className="mb-4">
        <input
          key="search-input"
          type="text"
          placeholder="Search Pokémon..."
          className="w-full p-2 border rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      {showSearchResults && (
        <div className="mb-2 text-sm text-gray-600">
          Showing {searchResults.length} results for "{query}"
        </div>
      )}
      
      <ul className="space-y-2 mb-6">
        {displayResults?.map((pokemon) => (
          <li key={pokemon.name} className="p-2 border rounded">
            <Link href={`/pokemon-detail/${pokemon.id}`} className="text-blue-600 hover:underline">
              {pokemon.name}
            </Link>
          </li>
        ))}
        
        {showSearchResults && searchResults.length === 0 && (
          <li className="p-2 text-center text-gray-500">No Pokémon found</li>
        )}
      </ul>

      {!showSearchResults && !displayLoading && (
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          >
            Previous
          </button>
          
          <div>
            Page {currentPage + 1} of {totalPages}
          </div>
          
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
