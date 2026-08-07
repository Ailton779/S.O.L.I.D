const API_URL = 'https://bookish-fortnight-rjrxq4v9xqgfwwxx-8000.app.github.dev';

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
