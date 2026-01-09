import { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function App() {
  const [quantidade, setQuantidade] = useState('');
  const [jogadores, setJogadores] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [jogadorSorteado, setJogadorSorteado] = useState('');
  const [categoriaSorteada, setCategoriaSorteada] = useState('');

  const frutas = [
    'maçã',
    'banana',
    'uva',
    'abacaxi',
    'laranja',
    'morango',
    'melancia',
  ];
  const dispositivos = [
    'celular',
    'notebook',
    'tablet',
    'TV',
    'fone bluetooth',
    'teclado',
    'mouse',
  ];

  const categorias = [
    { nome: 'Frutas', lista: frutas },
    { nome: 'Dispositivos Eletrônicos', lista: dispositivos },
  ];

  function criarCampos() {
    const qtd = parseInt(quantidade);
    if (!qtd || qtd <= 3) {
      alert('Digite um número válido (mínimo 4 jogadores)');
      return;
    }
    setJogadores(Array(qtd).fill(''));
    setResultado([]);
    setJogadorSorteado('');
    setCategoriaSorteada('');
  }

  function sortear() {
    if (jogadores.some((j) => j.trim() === '')) {
      alert('Preencha todos os nomes!');
      return;
    }

    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const palavras = categoria.lista;
    setCategoriaSorteada(categoria.nome);

    const palavraPrincipal =
      palavras[Math.floor(Math.random() * palavras.length)];
    const palavraDiferente = palavras.filter((p) => p !== palavraPrincipal)[
      Math.floor(Math.random() * (palavras.length - 1))
    ];

    const jogadorDiferenteIndex = Math.floor(Math.random() * jogadores.length);

    const novoResultado = jogadores.map((jogador, index) => ({
      nome: jogador,
      palavra:
        index === jogadorDiferenteIndex ? palavraDiferente : palavraPrincipal,
      diferente: index === jogadorDiferenteIndex,
    }));

    const jogadorSorteado =
      jogadores[Math.floor(Math.random() * jogadores.length)];

    setResultado(novoResultado);
    setJogadorSorteado(jogadorSorteado);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>🎲 Jogo do Impostor</Text>

      {jogadores.length === 0 && (
        <>
          <Text style={styles.label}>Quantos jogadores vão participar?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 5"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />
          <Button title="Confirmar" onPress={criarCampos} />
        </>
      )}

      {jogadores.map((jogador, index) => (
        <TextInput
          key={index}
          placeholder={`Jogador ${index + 1}`}
          value={jogador}
          onChangeText={(text) => {
            const copia = [...jogadores];
            copia[index] = text;
            setJogadores(copia);
          }}
          style={styles.input}
        />
      ))}

      {jogadores.length > 0 && <Button title="Sortear" onPress={sortear} />}

      {resultado.length > 0 && (
        <View style={styles.resultado}>
          <Text style={styles.subtitulo}>
            Categoria sorteada: {categoriaSorteada}
          </Text>

          {resultado.map((item, index) => (
            <Text key={index}>
              {item.nome} → {item.palavra} {item.diferente ? '(IMPOSTOR)' : ''}
            </Text>
          ))}

          <Text style={styles.sorteado}>
            🎯 Jogador que começa: {jogadorSorteado}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', marginTop: 50 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitulo: { fontSize: 18, marginTop: 20, fontWeight: 'bold' },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  resultado: { marginTop: 20, width: '100%' },
  sorteado: { marginTop: 15, fontSize: 16, fontWeight: 'bold' },
});
