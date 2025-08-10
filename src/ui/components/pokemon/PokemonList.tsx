import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePokemonList } from '../../../presentation/hooks/use-pokemon-list';
import { usePokemonSearch } from '../../../presentation/hooks/use-pokemon-search';
import { usePokemonByType } from '../../../presentation/hooks/use-pokemon-by-type';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';

const PAGE_SIZE = 10;

interface PokemonListProps {
  repository: PokemonRepository;
  page: number;
}

export default function PokemonList({ repository, page }: PokemonListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page - 1);
  const offset = currentPage * PAGE_SIZE;

  // Sync currentPage when page prop changes and validate page
  useEffect(() => {
    if (isNaN(page) || page < 1) {
      router.push('/pokemon-list?page=1');
      return;
    }
    setCurrentPage(page - 1);
  }, [page]);
  
  const { 
    query, 
    setQuery, 
    results: searchResults, 
    isSearching 
  } = usePokemonSearch(repository);
  
  const [selectedType, setSelectedType] = useState<string>('');
  const [showTypeResults, setShowTypeResults] = useState(false);
  const { data: typeData, isLoading: isTypeLoading } = usePokemonByType(
    repository,
    selectedType
  );
  
  const { data, isLoading, error } = usePokemonList(
    repository,
    offset,
    PAGE_SIZE
  );

  const totalPages = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 0;
  
  // Determine which data to display
  const showSearchResults = query.trim() !== '';
  const showTypeFilter = selectedType !== '';
  
  // Handle type filter change
  useEffect(() => {
    if (selectedType) {
      setShowTypeResults(true);
      // Reset page to 1 when type changes
      router.push(`/pokemon-list?page=1`);
    } else {
      setShowTypeResults(false);
    }
  }, [selectedType]);
  
  // Calculate pagination for type results
  const typeResultsCount = typeData?.length || 0;
  const typeTotalPages = Math.ceil(typeResultsCount / PAGE_SIZE);
  
  // Get paginated type results
  const paginatedTypeResults = typeData?.slice(offset, offset + PAGE_SIZE);
  const displayResults = showSearchResults ? searchResults : data?.results;
  const displayLoading = isSearching || isLoading;

  if (error) return <div>Error loading Pokémon</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pokémon List</h1>
      
      {displayLoading && <div>Loading...</div>}
      
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            key="search-input"
            type="text"
            placeholder="Search Pokémon..."
            className="w-full p-2 border rounded"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="normal">Normal</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="electric">Electric</option>
            <option value="grass">Grass</option>
            <option value="ice">Ice</option>
            <option value="fighting">Fighting</option>
            <option value="poison">Poison</option>
            <option value="ground">Ground</option>
            <option value="flying">Flying</option>
            <option value="psychic">Psychic</option>
            <option value="bug">Bug</option>
            <option value="rock">Rock</option>
            <option value="ghost">Ghost</option>
            <option value="dragon">Dragon</option>
            <option value="dark">Dark</option>
            <option value="steel">Steel</option>
            <option value="fairy">Fairy</option>
          </select>
        </div>
      </div>
      
      {showSearchResults && !showTypeFilter && (
        <div className="mb-2 text-sm text-gray-600">
          Showing {searchResults.length} results for "{query}"
        </div>
      )}
      
      {showTypeFilter && (
        <div className="mb-2 text-sm text-gray-600">
          Showing {typeResultsCount} Pokémon of type: {selectedType}
        </div>
      )}
      
      <ul className="space-y-2 mb-6">
        {(showTypeResults ? paginatedTypeResults : displayResults)?.map((pokemon) => (
          <li key={pokemon.name} className="p-2 border rounded flex items-center">
            {pokemon.imageUrl && (
              <img 
                src={pokemon.imageUrl} 
                alt={pokemon.name} 
                className="w-16 h-16 mr-3"
                loading="lazy"
              />
            )}
            <div>
              <Link href={`/pokemon-detail/${pokemon.id}`} className="text-blue-600 hover:underline">
                {pokemon.name}
              </Link>
              <div className="flex mt-1">
                {pokemon.types?.map(type => (
                  <span key={type} className="mr-2 px-2 py-1 text-xs rounded-full bg-gray-200">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
        
      {showSearchResults && searchResults.length === 0 && (
        <li className="p-2 text-center text-gray-500">No Pokémon found</li>
      )}
      
      {displayLoading && (
        <div className="animate-pulse space-y-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-2 border rounded flex items-center">
              <div className="bg-gray-200 rounded w-16 h-16 mr-3"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="flex">
                  <div className="h-4 bg-gray-200 rounded w-12 mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </ul>

      {!showSearchResults && !displayLoading && (
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => router.push(`/pokemon-list?page=${page - 1}`)}
          >
            Previous
          </button>
          
          <div>
            Page {page} of {showTypeResults ? typeTotalPages : totalPages}
          </div>
          
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            onClick={() => router.push(`/pokemon-list?page=${page + 1}`)}
            disabled={showTypeResults ? page >= typeTotalPages : page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
