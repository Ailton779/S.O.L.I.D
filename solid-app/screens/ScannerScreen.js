import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { snakes } from '../constants/snakes';
import { analyzeSnakeImage } from '../services/api';

export default function ScannerScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') { alert('Permissao de camera negada.'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const analyzeImage = async () => {
    setLoading(true);
    const apiResult = await analyzeSnakeImage(image);
    if (apiResult && apiResult.success) {
      navigation.navigate('Result', { snake: apiResult.data, confidence: apiResult.confidence, image });
    } else {
      const fallback = snakes[Math.floor(Math.random() * snakes.length)];
      navigation.navigate('Result', { snake: fallback, confidence: null, image });
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identificar Cobra</Text>
        <View style={{ width: 32 }} />
      </View>

      <TouchableOpacity style={styles.previewContainer} onPress={takePhoto} activeOpacity={0.8}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.placeholderText}>Toque para abrir a camera</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
          <Ionicons name="images-outline" size={18} color={colors.primary} />
          <Text style={styles.buttonSecondaryText}>Escolher da Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonPrimary, (!image || loading) && styles.buttonDisabled]}
          onPress={analyzeImage}
          disabled={!image || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="search-outline" size={18} color="#FFFFFF" />
              <Text style={styles.buttonPrimaryText}>Analisar Foto</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text },
  previewContainer: { flex: 1, borderRadius: 16, overflow: 'hidden', borderWidth: 0.5, borderColor: colors.border, marginBottom: 20 },
  preview: { flex: 1 },
  placeholder: { flex: 1, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', gap: 10 },
  placeholderText: { fontSize: 13, color: colors.textSecondary },
  bottomContainer: { gap: 10 },
  buttonSecondary: { borderWidth: 0.5, borderColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  buttonSecondaryText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  buttonPrimary: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  buttonPrimaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  buttonDisabled: { opacity: 0.4 },
});
