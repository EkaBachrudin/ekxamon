import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
