# SOLID — Sistema Óptico de Identificação e Localização de Serpentes no Interior do Domínio Semiárido

## Sobre o Projeto

O SOLID é um aplicativo mobile desenvolvido para auxiliar a população da região do sertão do Ceará (especificamente Boa Viagem) a identificar serpentes encontradas na Caatinga. Utilizando inteligência artificial (Google Gemini), o sistema analisa fotos de cobras e retorna informações sobre a espécie, se é peçonhenta, status de proteção e orientações de primeiros socorros.

O projeto foi desenvolvido como trabalho acadêmico na disciplina de **Programação para Dispositivos Móveis** do curso de **Análise e Desenvolvimento de Sistemas** do **IFCE — Campus Boa Viagem**.

---

## Equipe

| Nome | Função |
|---|---|
| Johnny Rocha Crisostomo | Professor Orientador |
| José Ailton Carneiro Alves Júnior | Desenvolvimento Fullstack |
| Germano de Oliveira Moraes | Artigo Científico |
| Ronald Vieira Carneiro | Artigo Científico |

---

## Funcionalidades

- **Identificação de serpentes:** tire uma foto ou selecione da galeria para identificar a espécie
- **IA com Google Gemini:** análise precisa baseada em inteligência artificial
- **Classificação de risco:** informa se a cobra é peçonhenta ou não
- **Status de proteção:** dados sobre proteção ambiental (ICMBio)
- **Primeiros socorros:** orientações em caso de picada
- **Espécies da região:** catálogo das serpentes típicas da Caatinga
- **Contato de emergência:** acesso rápido à Defesa Civil de Boa Viagem

---

## Tecnologias Utilizadas

### Frontend (Mobile)
- React Native + Expo SDK 54
- React Navigation (Stack Navigator)
- Expo Camera e Expo Image Picker
- @expo/vector-icons (Ionicons)

### Backend
- FastAPI (Python)
- Google Gemini API (modelos: gemini-3.5-flash, gemini-2.5-flash)
- Pillow (processamento de imagens)
- httpx (requisições assíncronas)
- python-dotenv (variáveis de ambiente)

### Infraestrutura
- Render (hospedagem do backend)
- GitHub Codespaces (ambiente de desenvolvimento)
- EAS Build (geração de APK)

---

## Estrutura do Projeto

```
S.O.L.I.D/
├── backend/
│   ├── app/
│   │   ├── main.py              # Ponto de entrada do FastAPI
│   │   └── routes/
│   │       └── analyze.py       # Endpoint /analyze
│   ├── requirements.txt         # Dependências Python
│   └── .env                     # Chave da API Gemini (não versionado)
├── solid-app/
│   ├── assets/                  # Imagens e ícones
│   ├── constants/
│   │   ├── colors.js            # Paleta de cores
│   │   └── snakes.js            # Dados das espécies
│   ├── screens/
│   │   ├── HomeScreen.js        # Tela inicial
│   │   ├── ScannerScreen.js     # Câmera e seleção de foto
│   │   ├── ResultScreen.js      # Resultado da identificação
│   │   ├── SpeciesScreen.js     # Catálogo de espécies
│   │   ├── FirstAidScreen.js    # Primeiros socorros
│   │   └── InfoScreen.js        # Sobre o projeto
│   ├── services/
│   │   └── api.js               # Comunicação com o backend
│   ├── app.json                 # Configuração do Expo
│   ├── package.json             # Dependências
│   └── eas.json                 # Configuração do EAS Build
└── README.md
```

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js v18 ou superior
- Python 3.12 ou superior
- Expo Go instalado no celular (Android ou iOS)
- Conta no Google AI Studio para obter a chave da API Gemini

### 1. Clonar o repositório

```bash
git clone https://github.com/Ailton779/S.O.L.I.D.git
cd S.O.L.I.D
```

### 2. Configurar o backend

Entre na pasta do backend e crie o ambiente virtual:

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Linux/macOS
# ou
.\venv\Scripts\Activate.ps1   # Windows
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo `.env` com sua chave da API Gemini:

```bash
echo "GEMINI_API_KEY=AIzaSy..." > .env
```

Inicie o servidor:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará disponível em `http://localhost:8000`. Para confirmar, acesse esse endereço no navegador — deve aparecer `{"status": "SOLID API online"}`.

### 3. Configurar o frontend

Entre na pasta do app e instale as dependências:

```bash
cd ../solid-app
npm install
```

No arquivo `solid-app/services/api.js`, defina a URL do backend:

```javascript
const API_URL = 'http://localhost:8000';       // desenvolvimento local
// ou
const API_URL = 'https://s-o-l-i-d.onrender.com';  // backend hospedado
```

Inicie o app:

```bash
npx expo start --tunnel --port 8081 --clear
```

Escaneie o QR code com o Expo Go no celular.

### 4. Gerar APK (Android)

```bash
cd solid-app
eas build -p android --profile preview --clear-cache
```

---

## Como Obter uma Chave da API Gemini

1. Acesse [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Faça login com sua conta Google
3. Clique em **"Get API Key"** ou **"Criar chave de API"**
4. Selecione ou crie um projeto
5. Copie a chave gerada — ela tem o formato `AIzaSy...`
6. Cole no arquivo `.env` do backend: `GEMINI_API_KEY=AIzaSy...`

> Nunca compartilhe sua chave de API publicamente. Ela dá acesso à sua cota do Gemini.

---

## Como Hospedar o Backend no Render

1. Crie uma conta em [render.com](https://render.com)
2. Clique em **"New +"** e selecione **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure o serviço:
   - **Root Directory:** `backend`
   - **Environment:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Adicione a variável de ambiente `GEMINI_API_KEY` com sua chave
6. Clique em **"Create Web Service"**
7. Copie a URL gerada e atualize o `API_URL` no `solid-app/services/api.js`

> O plano gratuito do Render hiberna o serviço após 15 minutos de inatividade. A primeira requisição pode demorar até 50 segundos. Isso é normal.

---

## API — Endpoints

O backend está hospedado em `https://s-o-l-i-d.onrender.com`.

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Verifica se a API está online |
| POST | `/analyze` | Envia uma imagem para identificação |

**Exemplo de requisição:**

```bash
curl -X POST -F "image=@foto.jpg" https://s-o-l-i-d.onrender.com/analyze
```

**Exemplo de resposta:**

```json
{
  "success": true,
  "confidence": 0.95,
  "model_used": "gemini-3.5-flash",
  "data": {
    "name": "Jararaca-da-seca",
    "scientific": "Bothrops erythromelas",
    "venomous": true,
    "venom_type": "Hemotóxico",
    "protected": false,
    "protection_status": "Não ameaçada",
    "description": "...",
    "first_aid": "...",
    "confidence": 0.95
  }
}
```

---

## Integração com Google Gemini

O sistema envia a imagem para a API Gemini com um prompt especializado em herpetologia da Caatinga. Os modelos são tentados em sequência até que um responda com sucesso:

1. gemini-3.5-flash (preferencial)
2. gemini-3.5-flash-lite (fallback)
3. gemini-2.5-flash (fallback)
4. gemini-2.0-flash (fallback)

**Processo de identificação:**

1. O usuário tira ou seleciona uma foto
2. A imagem é enviada ao backend via FormData
3. O backend envia a imagem para a API Gemini com prompt especializado
4. O Gemini retorna um JSON com os dados da espécie
5. O backend realiza pós-processamento e normalização dos dados
6. O frontend exibe o resultado para o usuário

---

## Espécies Suportadas

| Nome Popular | Nome Científico | Peçonhenta |
|---|---|---|
| Jararaca-da-seca | *Bothrops erythromelas* | Sim |
| Cascavel | *Crotalus durissus* | Sim |
| Coral-verdadeira | *Micrurus ibiboboca* | Sim |
| Coral-falsa | *Oxyrhopus trigeminus* | Não |
| Cobra-cipó | *Philodryas olfersii* | Opistóglifa (veneno fraco) |
| Jiboia | *Boa constrictor* | Não |

---

## Telas do Aplicativo

| Tela | Descrição |
|---|---|
| Home | Tela inicial com animação e menu principal |
| Scanner | Câmera e seleção de imagem para identificação |
| Resultado | Exibe espécie, confiança, periculosidade, proteção e primeiros socorros |
| Espécies | Catálogo de espécies da Caatinga com imagens e características |
| Primeiros Socorros | Guia de procedimentos em caso de picada e contato da Defesa Civil |
| Sobre | Informações do projeto e equipe |

---

## Variáveis de Ambiente

**Backend (`backend/.env`):**

```
GEMINI_API_KEY=AIzaSy...
```

**Frontend (`solid-app/services/api.js`):**

```javascript
const API_URL = 'https://s-o-l-i-d.onrender.com';
```

---

## Contato de Emergência

Em caso de picada de cobra, entre em contato com a **Defesa Civil de Boa Viagem**:

| Contato | Informação |
|---|---|
| WhatsApp / Emergência | (88) 9281-6910 |
| Telefone alternativo | (88) 98188-7477 |
| E-mail | defesacivil.pmbv@boaviagem.ce.gov.br |
| Atendimento presencial | Segunda a quinta-feira, das 8h às 12h |

---

## Licença

Este projeto é de uso acadêmico e não possui licença comercial.

---

## Contato

**Desenvolvedor:** José Ailton Carneiro Alves Júnior
**Email:** jose.ailton10@aluno.ifce.edu.br
**GitHub:** [Ailton779](https://github.com/Ailton779)

---

## Agradecimentos

- Professor Johnny Rocha Crisostomo — pela orientação e suporte
- IFCE — Campus Boa Viagem — pela estrutura e incentivo à pesquisa
- Google Gemini — pela tecnologia de inteligência artificial

---

Feito no sertão do Ceará.
