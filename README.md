# AI Email Assistant

An AI-powered email writing assistant that helps improve your emails with suggestions for tone, grammar, and content.

## Features

- Email content improvement using OpenAI's GPT-3.5
- Customizable tone (professional, casual, formal)
- Adjustable email length
- Grammar and spelling corrections
- Writing suggestions

## Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- OpenAI API key

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
BACKEND_PORT=8000
```

4. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your email content in the text area
3. Select desired tone and length
4. Click "Improve Email" to get suggestions and improvements

## API Endpoints

- `POST /api/process-email`: Process and improve email content
  - Request body:
    ```json
    {
      "content": "Your email content",
      "tone": "professional|casual|formal",
      "length": "short|medium|long"
    }
    ```

## License

MIT