const API_URL = 'http://localhost:8000';

export async function analyzeSnakeImage(imageUri) {
  try {
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
      throw new Error('Erro ao analisar imagem');
    }

    return await response.json();
  } catch (error) {
    console.log('API indisponivel, usando dados locais:', error.message);
    return null;
  }
}
