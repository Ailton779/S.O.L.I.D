const API_URL = 'https://estimate-banking-sandbank.ngrok-free.dev';

export async function analyzeSnakeImage(imageUri) {
  try {
    console.log('[API] Enviando para:', API_URL);
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'snake.jpg',
    });

    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    console.log('[API] Status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] Dados:', data);
    return data;
  } catch (error) {
    console.error('[API] Falha:', error.message);
    return null;
  }
}
