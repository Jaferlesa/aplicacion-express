import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Pressable, Text, ActivityIndicator } from 'react-native';

// --- ¡IMPORTANTE! REEMPLAZA ESTA URL ---
// Pega aquí la dirección "Forwarded Address" de tu CodeSpace.
// Asegúrate de que termine con una barra si la copiaste sin ella.
const SERVER_URL = 'https://spicy-sides-lick.loca.lt/';

const App = () => {
  // Estado para guardar el texto del input
  const [todo, setTodo] = useState('');
  // Estado para mostrar un indicador de carga mientras se envía la petición
  const [cargando, setCargando] = useState(false);

  // --- d) Función que llama al servidor con la dirección del túnel ---
  const agregarTodo = async () => {
    // Validación simple para no enviar datos vacíos
    if (!todo.trim()) {
      Alert.alert("Error", "Por favor, escribe una tarea.");
      return;
    }

    // Activamos el indicador de carga
    setCargando(true);

    try {
      // Usamos fetch para enviar la petición POST
      const respuesta = await fetch(`${SERVER_URL}agrega_todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo: todo, // Enviamos el texto del estado
        }),
      });

      // --- e) Muestra una alerta de éxito si el estado de la respuesta es 201 ---
      if (respuesta.status === 201) {
        const jsonRespuesta = await respuesta.json();
        Alert.alert(
          "Éxito",
          `Tarea agregada correctamente con el ID: ${jsonRespuesta.id}`
        );
        setTodo(''); // Limpiamos el campo de texto después del éxito
      } else {
        // Si el estado no es 201, mostramos un error
        const errorTexto = await respuesta.text();
        Alert.alert("Error en el servidor", `No se pudo agregar la tarea. ${errorTexto}`);
      }
    } catch (error) {
      // Este error ocurre si no hay conexión a internet o el servidor no responde
      console.error(error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor. Verifica la URL y tu conexión.");
    } finally {
      // Desactivamos el indicador de carga, tanto si hubo éxito como si hubo error
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Tarea</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Escribe tu tarea aquí..."
        value={todo}
        onChangeText={setTodo}
      />

      {/* Usamos un Pressable para poder deshabilitarlo mientras carga */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (cargando || !todo.trim()) && styles.buttonDisabled, // Estilo deshabilitado
          pressed && !cargando && { opacity: 0.8 }
        ]}
        onPress={agregarTodo}
        disabled={cargando || !todo.trim()} // Deshabilitamos el botón
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Agregar Tarea</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
