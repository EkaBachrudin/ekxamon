'use client';

import PokemonList from '../../ui/components/pokemon/PokemonList';
import { PokemonAxiosRepository } from '../../infrastructure/api/pokemon/pokemon-axios.repository';
import { useSearchParams } from 'next/navigation';

export default function PokemonListPage() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = 
    typeof pageParam === 'string' && !isNaN(parseInt(pageParam)) 
      ? Math.max(1, parseInt(pageParam)) 
      : 1;
  
  return <PokemonList repository={new PokemonAxiosRepository()} page={page} />;
}
