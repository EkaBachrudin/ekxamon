import React from 'react';
import { Pokemon } from '../../../domain/entities/pokemon';

interface PokemonDetailProps {
  pokemon: Pokemon;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon }) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h1>
        
        {pokemon.imageUrl && (
          <img 
            src={pokemon.imageUrl} 
            alt={pokemon.name} 
            className="w-48 h-48 object-contain"
          />
        )}
        
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Types</h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.types?.map((type, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
