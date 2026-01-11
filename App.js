import { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [quantidade, setQuantidade] = useState('');
  const [jogadores, setJogadores] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [categoriaSorteada, setCategoriaSorteada] = useState('');
  const [impostores, setImpostores] = useState(1);
  const [fase, setFase] = useState('setup');
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [mostrarPalavra, setMostrarPalavra] = useState(false);

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
    'smartwatch',
    'fone bluetooth',
    'teclado',
    'mouse',
  ];

  const categorias = [
    { nome: 'Frutas', lista: frutas },
    { nome: 'Dispositivos Eletrônicos', lista: dispositivos },
  ];

  function confirmarQuantidade() {
    const qtd = parseInt(quantidade);
    if (!qtd || qtd < 4 || qtd > 10) {
      alert('Digite entre 4 e 10 jogadores.');
      return;
    }
    setJogadores(Array(qtd).fill(''));
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

    const indices = [...Array(jogadores.length).keys()].sort(
      () => Math.random() - 0.5
    );
    const indicesImpostores = indices.slice(0, impostores);

    const novoResultado = jogadores.map((nome, index) => ({
      nome,
      palavra: indicesImpostores.includes(index)
        ? palavraDiferente
        : palavraPrincipal,
      diferente: indicesImpostores.includes(index),
    }));

    setResultado(novoResultado);
    setIndiceAtual(0);
    setMostrarPalavra(false);
    setFase('revelar');
  }

  function proximo() {
    setMostrarPalavra(false);
    if (indiceAtual + 1 < resultado.length) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      setFase('fim');
    }
  }

  function jogarNovamente() {
    setResultado([]);
    setIndiceAtual(0);
    setMostrarPalavra(false);
    setCategoriaSorteada('');
    setFase('revelar');
    sortear();
  }

  if (fase === 'revelar') {
    const jogador = resultado[indiceAtual];

    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Passe o celular 📱</Text>
        <Text style={styles.label}>Jogador:</Text>
        <Text style={styles.nome}>{jogador.nome}</Text>

        {!mostrarPalavra ? (
          <Button
            title="Ver minha palavra"
            onPress={() => setMostrarPalavra(true)}
          />
        ) : (
          <>
            <Text style={styles.palavra}>{jogador.palavra}</Text>
            {jogador.diferente && (
              <Text style={styles.impostor}>Você é o IMPOSTOR</Text>
            )}
            {!jogador.diferente && (
              <Text style={styles.normal}>Você não é o impostor</Text>
            )}
            <Button title="Próximo jogador" onPress={proximo} />
          </>
        )}
      </View>
    );
  }

  if (fase === 'fim') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Todos viram suas palavras</Text>
        <Text style={{ marginVertical: 20 }}>O jogo pode começar!</Text>
        <Button title="Jogar novamente" onPress={jogarNovamente} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Jogo do Impostor</Text>

      {jogadores.length === 0 && (
        <>
          <Text style={styles.label}>Quantos jogadores vão participar?</Text>
          <TextInput
            style={styles.input}
            placeholder="Entre 4 e 10"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />
          <Button title="Confirmar" onPress={confirmarQuantidade} />
        </>
      )}

      {jogadores.map((j, i) => (
        <TextInput
          key={i}
          placeholder={`Jogador ${i + 1}`}
          value={j}
          onChangeText={(t) => {
            const copia = [...jogadores];
            copia[i] = t;
            setJogadores(copia);
          }}
          style={styles.input}
        />
      ))}

      {jogadores.length > 0 && (
        <>
          <View style={styles.impostoresBox}>
            <Text style={styles.label}>Número de impostores</Text>
            <View style={styles.impostoresControle}>
              <TouchableOpacity
                onPress={() => setImpostores((p) => Math.max(1, p - 1))}
                style={styles.botao}>
                <Text style={styles.botaoTexto}>−</Text>
              </TouchableOpacity>
              <Text style={styles.impostoresNumero}>{impostores}</Text>
              <TouchableOpacity
                onPress={() =>
                  setImpostores((p) => Math.min(jogadores.length - 1, p + 1))
                }
                style={styles.botao}>
                <Text style={styles.botaoTexto}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button title="Sortear palavras" onPress={sortear} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  subtitulo: { fontSize: 18, marginTop: 10 },
  label: { fontSize: 16, marginBottom: 8 },
  nome: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  palavra: { fontSize: 28, fontWeight: 'bold', marginVertical: 20 },
  impostor: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  normal: { color: 'green', fontSize: 16, marginBottom: 10 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  impostoresBox: { marginVertical: 15, alignItems: 'center' },
  impostoresControle: { flexDirection: 'row', alignItems: 'center' },
  botao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: { fontSize: 24, fontWeight: 'bold' },
  impostoresNumero: { marginHorizontal: 20, fontSize: 20, fontWeight: 'bold' },
});
