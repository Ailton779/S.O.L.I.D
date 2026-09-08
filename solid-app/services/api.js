import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const API_URL = 'https://s-o-l-i-d.onrender.com';

export async function analyzeSnakeImage(imageUri) {
  try {
    console.log('[API] Lendo imagem como base64...');
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log('[API] Base64 lido, tamanho:', base64.length);

    console.log('[API] Enviando para:', API_URL);
    const response = await axios.post(
      `${API_URL}/analyze`,
      { image_base64: base64 },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
      }
    );

    console.log('[API] Status:', response.status);
    console.log('[API] Dados recebidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Falha:', error.message);
    if (error.response) {
      console.error('[API] Erro:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('[API] Sem resposta do servidor');
    }
    return null;
  }
}