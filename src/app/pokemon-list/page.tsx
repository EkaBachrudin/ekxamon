'use client';

import PokemonList from '../../ui/components/pokemon/PokemonList';
import { PokemonAxiosRepository } from '../../infrastructure/api/pokemon/pokemon-axios.repository';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PokemonListPageContent() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page =
    typeof pageParam === 'string' && !isNaN(parseInt(pageParam))
      ? Math.max(1, parseInt(pageParam))
      : 1;

  return <PokemonList repository={new PokemonAxiosRepository()} page={page} />;
}

export default function PokemonListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PokemonListPageContent />
    </Suspense>
  );
}
