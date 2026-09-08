import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
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
    if (permission.status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permissão de câmera negada.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    console.log('[APP] Iniciando análise...');
    try {
      const apiResult = await analyzeSnakeImage(image);
      console.log('[APP] Resultado da API:', apiResult);
      if (apiResult && apiResult.success) {
        const data = apiResult.data;

        // Verificação mais rigorosa: se não tiver nome ou for "Não aplicável", rejeita
        const isNotSnake =
          data.is_snake === false ||
          data.name === 'Não aplicável' ||
          data.name === 'N/A' ||
          data.name === 'Não identificado' ||
          data.name === 'Não identificada (Nenhuma cobra presente)' ||
          data.name === 'Não identificada (Nenhuma serpente detectada)' ||
          (data.name && data.name.toLowerCase().includes('nenhuma cobra')) ||
          (data.description && data.description.toLowerCase().includes('não contém nenhuma cobra')) ||
          (data.description && data.description.toLowerCase().includes('não é uma cobra')) ||
          (data.description && data.description.toLowerCase().includes('nenhuma serpente'));

        if (isNotSnake) {
          Alert.alert('🔍 Não é uma cobra', 'A imagem enviada não parece conter uma cobra. Tente novamente com uma foto de uma serpente.');
          setLoading(false);
          return;
        }

        navigation.navigate('Result', {
          snake: data,
          confidence: apiResult.confidence,
          image,
        });
      } else {
        console.log('[APP] API retornou dados inválidos:', apiResult);
        Alert.alert('Erro', 'A API não retornou dados válidos.');
      }
    } catch (error) {
      console.error('[APP] Erro na análise:', error);
      Alert.alert('Erro', `Falha na requisição: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('[APP] Loading finalizado.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
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
            <Text style={styles.placeholderText}>Toque para abrir a câmera</Text>
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.buttonPrimaryText}>Analisando...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="search-outline" size={18} color="#FFFFFF" />
              <Text style={styles.buttonPrimaryText}>Analisar Foto</Text>
            </>
          )}
        </TouchableOpacity>
        {loading && (
          <Text style={styles.loadingHint}>A identificação pode levar alguns segundos</Text>
        )}
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
  preview: { flex: 1, width: '100%', height: '100%' },
  placeholder: { flex: 1, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', gap: 10 },
  placeholderText: { fontSize: 13, color: colors.textSecondary },
  bottomContainer: { gap: 10 },
  buttonSecondary: { borderWidth: 0.5, borderColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  buttonSecondaryText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  buttonPrimary: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  buttonPrimaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  buttonDisabled: { opacity: 0.4 },
  loadingHint: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
});
