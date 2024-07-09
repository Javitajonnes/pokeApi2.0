import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Row, Col, Container, Card } from 'react-bootstrap';

import './App.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonName, setPokemonName] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pokemonName.trim()) {
      alert('Ingrese un nombre de pokemon válido');
      return;
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('No se encontró el pokemon');
      }
      const data = await response.json();
      setPokemonData(data);
      
      if (editIndex !== null) {
        const newPokemons = [...pokemons];
        newPokemons[editIndex] = { name: pokemonName, data };
        setPokemons(newPokemons);
        setEditIndex(null);
      } else {
        setPokemons([...pokemons, { name: pokemonName, data }]);
      }

      setPokemonName('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = (index) => {
    const newPokemons = [...pokemons];
    newPokemons.splice(index, 1);
    setPokemons(newPokemons);
  };

  const handleEdit = (index) => {
    setPokemonName(pokemons[index].name);
    setPokemonData(pokemons[index].data);
    setEditIndex(index);
  };

  return (
    <Container>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Pokemon</Form.Label>
            <Form.Control placeholder="Ingrese Nombre del Pokemon" value={pokemonName} onChange={(e) => setPokemonName(e.target.value)} />
          </Form.Group>
          <Button type="submit">
            {editIndex !== null ? 'Actualizar Pokemon' : 'Agregar Pokemon'}
          </Button>
        </Form>
      </Row>
      <Row style={{ padding: 10 }}>
        {pokemons.map((pokemon, index) => (
          <Col sm={4} key={index}>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{pokemon.name}</Card.Title>
                {pokemon.data && (
                  <>
                    <Card.Text>Altura: {pokemon.data.height}</Card.Text>
                    <Card.Text>Peso: {pokemon.data.weight}</Card.Text>
                    <Card.Img variant="top" src={pokemon.data.sprites.front_default} />
                  </>
                )}
                <Button variant="danger" onClick={() => handleDelete(index)}>Eliminar</Button>
                <Button variant="warning" onClick={() => handleEdit(index)}>Modificar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;

