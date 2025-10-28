import { useState, useEffect, type SetStateAction } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePokemonList } from '../../../presentation/hooks/use-pokemon-list';
import { usePokemonSearch } from '../../../presentation/hooks/use-pokemon-search';
import { usePokemonByType } from '../../../presentation/hooks/use-pokemon-by-type';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';
import { Pokemon } from '@/domain/entities/pokemon';
import { getColorsFromTypes } from '@/utils/pokemonColors';
import BottomSheet from '@/ui/components/common/BottomSheet';
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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
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
    <div className="p-4 max-w-[1440px] mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pokémon List</h1>
      
      {displayLoading && <div>Loading...</div>}
      
      <div className="controls-grid mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            key="search-input"
            type="text"
            placeholder="Search Pokémon..."
            className="w-full py-2 px-4 border-[2px] rounded-3xl"
            value={query}
            onChange={(e) => searchPokemon(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className="select-button"
            style={
              selectedType 
                ? { 
                    backgroundColor: getColorsFromTypes([selectedType])[0]+'33',
                    color: 'black',
                    border: '2px solid' + getColorsFromTypes([selectedType])[0]+'33',
                    fontWeight: 700
                  }
                : { 
                    fontWeight: 700
                  }
            }
          >
            <div className="flex items-center gap-2">
              {selectedType && (
                <img 
                  src={`/elementsColor/${selectedType}.svg`} 
                  alt={selectedType} 
                  className="w-5 h-5"
                />
              )}
              <span className="capitalize">{selectedType || 'All Types'}</span>
            </div>
            <span>▼</span>
          </button>
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
      
      {/* Updated Pokemon list grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {(showTypeResults ? paginatedTypeResults : displayResults)?.map((pokemon) => (
          <div key={pokemon.name} className="pokemon-card" style={{backgroundColor: getColorsFromTypes(pokemon.types)[0]+'33'}}>
            <div>
              <Link href={`/pokemon-detail/${pokemon.id}`} className="text-[21px] text-black hover:underline font-bold capitalize">
                {pokemon.name}
              </Link>
              <div className="flex mt-1">
                {pokemon.types?.map((type, index) => (
                 <div key={type} className='type-badge' style={{backgroundColor: getColorsFromTypes(pokemon.types)[index], color: 'white'}}>
                  <div className='w-[20px] h-[20px] bg-white rounded-full flex justify-center items-center'> 
                    <img src={`elementsColor/${type}.svg`} className='size-[13px]' alt="typeimage" /> 
                  </div>
                  <span>{type}</span>
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
          </div>
        ))}
        
        {showSearchResults && searchResults.length === 0 && (
          <div className="col-span-3 p-2 text-center text-gray-500">No Pokémon found</div>
        )}
        
        {displayLoading && (
          <div className="col-span-3">
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
          </div>
        )}
      </div>
      
      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Select Pokemon Type</h2>
        <div className="type-grid">
          <button
            className={`type-button ${selectedType === '' ? 'selected' : ''}`}
            onClick={() => {
              selectType('');
              setIsBottomSheetOpen(false);
            }}
          >
            All Types
          </button>
          {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 
            'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
          ].map((type) => (
            <button
              key={type}
              className={`type-button ${selectedType === type ? 'selected' : ''}`}
              onClick={() => {
                selectType(type);
                setIsBottomSheetOpen(false);
              }}
            >
              <div className="type-icon">
                <img src={`/elementsColor/${type}.svg`} alt={type} />
              </div>
              <span>{type}</span>
            </button>
          ))}
        </div>
      </BottomSheet>

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
