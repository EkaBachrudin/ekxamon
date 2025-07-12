import { usePokemonList } from '../../../presentation/hooks/use-pokemon-list';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';

interface PokemonListProps {
  repository: PokemonRepository;
}

export default function PokemonList({ repository }: PokemonListProps) {
  const { data, isLoading, error } = usePokemonList(repository);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading Pokémon</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pokémon List</h1>
      <ul className="space-y-2">
        {data?.results.map((pokemon) => (
          <li key={pokemon.name} className="p-2 border rounded">
            {pokemon.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
