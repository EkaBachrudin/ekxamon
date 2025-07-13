import React from 'react';
import { Pokemon } from '../../../domain/entities/pokemon';

interface PokemonDetailProps {
  pokemon: Pokemon;
}

const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon }) => {
  const malePercent = pokemon.genderRate === -1 
    ? 0 
    : ((8 - pokemon.genderRate) / 8 * 100).toFixed(1);
    
  const femalePercent = pokemon.genderRate === -1 
    ? 0 
    : (pokemon.genderRate / 8 * 100).toFixed(1);

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

        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
          <DetailItem label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
          <DetailItem label="Height" value={`${(pokemon.height * 10).toFixed(1)} cm`} />
          <DetailItem label="Category" value={pokemon.species || 'Unknown'} />
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-2">Abilities</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities?.map((ability, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {ability}
                </span>
              ))}
            </div>
          </div>
          
          <div className="col-span-2 mt-4">
            <h2 className="text-xl font-semibold mb-2">Gender Distribution</h2>
            {pokemon.genderRate === -1 ? (
              <p className="text-gray-700">Genderless</p>
            ) : (
              <div className="flex items-center">
                <span className="mr-2 text-blue-500">♂</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-pink-400" 
                    style={{ 
                      width: '100%',
                      background: `linear-gradient(to right, blue ${malePercent}%, pink 0%)`
                    }}
                  />
                </div>
                <span className="ml-2 text-pink-500">♀</span>
                <span className="ml-2 text-sm">
                  ♂ {malePercent}% ♀ {femalePercent}%
                </span>
              </div>
            )}
          </div>
          
          <div className="col-span-2 mt-4">
            <h2 className="text-xl font-semibold mb-2">Weaknesses</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.weaknesses?.map((weakness, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm capitalize"
                >
                  {weakness}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Evolution Chain</h2>
            <div className="flex flex-col items-center">
              {pokemon.evolutionChain.map((stage, index) => (
                <React.Fragment key={index}>
                  <div className="text-center p-4 border rounded-lg shadow-sm">
                    <img 
                      src={stage.imageUrl} 
                      alt={stage.species} 
                      className="w-24 h-24 mx-auto"
                    />
                    <p className="font-bold capitalize mt-2">{stage.species}</p>
                    <div className="flex flex-wrap justify-center gap-1 mt-1">
                      {stage.types.map((type, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {index < pokemon.evolutionChain!.length - 1 && (
                    <div className="my-3 flex flex-col items-center">
                      <div className="text-xl text-gray-500">↓</div>
                      {stage.minLevel !== undefined && (
                        <div className="text-sm text-gray-600 mt-1">
                          Level {stage.minLevel}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        
        {pokemon.description && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{pokemon.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonDetail;
