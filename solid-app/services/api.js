const API_URL = 'https://s-o-l-i-d.onrender.com';

export async function analyzeSnakeImage(imageUri) {
  try {
    console.log('[API] Iniciando fetch direto da URI:', imageUri);

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'snake.jpg',
    });

    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Erro HTTP:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log('[API] Dados recebidos:', data);
    return data;
  } catch (error) {
    console.error('[API] Falha:', error.message);
    return null;
  }
}
