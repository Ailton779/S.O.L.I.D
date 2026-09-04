import * as FileSystem from 'expo-file-system';

const API_URL = 'https://helping-cactus-mulled.ngrok-free.dev';

export async function analyzeSnakeImage(imageUri) {
  console.log('[API] Iniciando...');
  try {
    console.log('[API] Lendo imagem como base64...');
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log('[API] Base64 lido, tamanho:', base64.length);

    const payload = JSON.stringify({ image_base64: base64 });
    console.log('[API] Payload tamanho:', payload.length);

    console.log('[API] Enviando para:', API_URL);
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    console.log('[API] Status da resposta:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Erro HTTP:', errorText);
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] Dados recebidos:', data);
    return data;
  } catch (error) {
    console.error('[API] Falha na requisição:', error.message);
    return null;
  }
}
