import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Button, CardMedia } from '@mui/material';

const App = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados de Pokémon e suas imagens
  const fetchPokemon = () => {
    setLoading(true);
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=' + Math.floor(Math.random() * 1000))
      .then((response) => response.json())
      .then((data) => {
        // Fetch de todas as imagens dos pokemons
        const fetchPokemonDetails = data.results.map(poke =>
          fetch(poke.url)
            .then(res => res.json())
            .then(pokeData => ({
              name: poke.name,
              image: pokeData.sprites.front_default
            }))
        );

        // Esperar todas as imagens serem carregadas
        Promise.all(fetchPokemonDetails).then(pokemonsWithImages => {
          setPokemon(pokemonsWithImages);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar os dados:', error);
        setLoading(false);
      });
  };

  // Chama a função quando a página for carregada
  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <Container maxWidth="lg" style={{ textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom style={{ marginTop: '20px' }}>
        Lista de Pokémon
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px' }}
        onClick={fetchPokemon}
      >
        Carregar Pokémon Aleatórios
      </Button>
      
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          {pokemon.map((poke, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card style={{ padding: '10px', textAlign: 'center' }}>
                <CardMedia
                  component="img"
                  alt={poke.name}
                  height="200"
                  image={poke.image}
                  title={poke.name}
                />
                <CardContent>
                  <Typography variant="h6">{poke.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default App;
