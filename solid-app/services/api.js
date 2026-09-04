import * as FileSystem from 'expo-file-system';

const API_URL = 'https://helping-cactus-mulled.ngrok-free.dev';

export async function analyzeSnakeImage(imageUri) {
  try {
    console.log('[API] Lendo imagem como base64...');

    // Usando o método legacy (não obsoleto) – importe explicitamente
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('[API] Base64 lido, tamanho:', base64.length);
    console.log('[API] Enviando para:', API_URL);

    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_base64: base64 }),
    });

    console.log('[API] Status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] Dados recebidos:', data);
    return data;
  } catch (error) {
    console.error('[API] Falha:', error.message);
    return null;
  }
}
