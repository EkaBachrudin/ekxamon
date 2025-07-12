'use client';

import PokemonList from '../ui/components/pokemon/PokemonList';
import { PokemonAxiosRepository } from '../infrastructure/api/pokemon/pokemon-axios.repository';

export default function Home() {
  return <PokemonList repository={new PokemonAxiosRepository()} />;
}
