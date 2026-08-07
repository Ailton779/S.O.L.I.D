import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { colors } from '../constants/colors';
import { snakes } from '../constants/snakes';

export default function ScannerScreen({ navigation }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Permissao de camera negada.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeImage = () => {
    const randomSnake = snakes[Math.floor(Math.random() * snakes.length)];
    navigation.navigate('Result', { snake: randomSnake, image });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Text style={styles.title}>Identificar Cobra</Text>

      <TouchableOpacity
        style={styles.previewContainer}
        onPress={takePhoto}
        activeOpacity={0.8}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Toque para abrir a camera</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
          <Text style={styles.buttonSecondaryText}>Escolher da Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonPrimary, !image && styles.buttonDisabled]}
          onPress={analyzeImage}
          disabled={!image}
        >
          <Text style={styles.buttonPrimaryText}>Analisar Foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  previewContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  preview: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  bottomContainer: {
    gap: 12,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
