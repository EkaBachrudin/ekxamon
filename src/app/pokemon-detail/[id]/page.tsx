'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PokemonAxiosRepository } from '@/infrastructure/api/pokemon/pokemon-axios.repository';
import { usePokemonDetail } from '@/presentation/hooks/use-pokemon-detail';
import { GetPokemonByIdUseCase } from '@/application/use-cases/get-pokemon-by-id.usecase';
import PokemonDetail from '@/ui/components/pokemon/PokemonDetail';
import LoadingSpinner from '@/ui/components/common/LoadingSpinner';
import ErrorMessage from '@/ui/components/common/ErrorMessage';

const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const pokemonId = parseInt(id, 10);
  
  const pokemonRepository = new PokemonAxiosRepository();
  const getPokemonById = new GetPokemonByIdUseCase(pokemonRepository);
  const { data: pokemon, isLoading, error } = usePokemonDetail(pokemonId, getPokemonById);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!pokemon) return <ErrorMessage message="Pokemon not found" />;

  return <PokemonDetail pokemon={pokemon} />;
};

export default PokemonDetailPage;
