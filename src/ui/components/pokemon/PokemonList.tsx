import { useState, useEffect, type SetStateAction } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePokemonList } from '../../../presentation/hooks/use-pokemon-list';
import { usePokemonSearch } from '../../../presentation/hooks/use-pokemon-search';
import { usePokemonByType } from '../../../presentation/hooks/use-pokemon-by-type';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';
import { Pokemon } from '@/domain/entities/pokemon';
import { getColorsFromTypes } from '@/utils/pokemonColors';
import './PokemonList.scss';

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
    PAGE_SIZE,
    !showTypeResults
  );

  const totalPages = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 0;
  
  // Determine which data to display
  const showSearchResults = query.trim() !== '';
  const showTypeFilter = selectedType !== '';
  
  // Handle type filter change
  useEffect(() => {
    if (selectedType) {
      setShowTypeResults(true);
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

  const getElementImage = (pokemon: Pokemon): string => {
    const firstType = pokemon.types?.[0] ?? 'notype';
    return firstType;
  } 

  const selectType = (type: string) => {
      router.push(`/pokemon-list?page=1`);
      setSelectedType(type);
  }

  const searchPokemon = (search: string) => {
    if(selectedType) {

    } else {
      setQuery(search);
    }
    
  }

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
            onChange={(e) => searchPokemon(e.target.value)}
          />
        </div>
        <div>
          <select
            value={selectedType}
            onChange={(e) => selectType(e.target.value)}
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
          <li key={pokemon.name} className="pokemon-card" style={{backgroundColor: getColorsFromTypes(pokemon.types)[0]+'33'}}>
            <div>
              <Link href={`/pokemon-detail/${pokemon.id}`} className="text-[21px] text-black hover:underline font-bold">
                {pokemon.name}
              </Link>
              <div className="flex mt-1">
                {pokemon.types?.map((type, index) => (
                 <div key={type} className='type-badge' style={{backgroundColor: getColorsFromTypes(pokemon.types)[index]}}>
                  <div className='w-[20px] h-[20px] bg-white rounded-full flex justify-center items-center'> <img src={`elementsColor/${type}.svg`} className='size-[13px]' alt="typeimage" /> </div>
                   <span>
                    {type}
                  </span>
                 </div>
                ))}
              </div>
            </div>

            {pokemon.imageUrl && (
              <img 
                src={pokemon.imageUrl} 
                alt={pokemon.name} 
                className="pokemon-image"
                loading="lazy"
              />
            )}

            <div className='pokemon-element-container' style={{backgroundColor: getColorsFromTypes(pokemon.types)[0]}}>
              <img
                className="pokemon-element-img"
                src={`/elements/${getElementImage(pokemon)}.svg`}
                alt="element"
              />
            </div>
          </li>
        ))}
        
      {showSearchResults && searchResults.length === 0 && (
        <li className="p-2 text-center text-gray-500">No Pokémon found</li>
      )}
      
      {displayLoading && (
        <div className="loading-animation">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="loading-item">
              <div className="loading-img"></div>
              <div>
                <div className="loading-text w-24 mb-2"></div>
                <div className="flex">
                  <div className="loading-text w-12 mr-2"></div>
                  <div className="loading-text w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </ul>

      {!showSearchResults && !displayLoading && (
        <div className="pagination-container">
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
