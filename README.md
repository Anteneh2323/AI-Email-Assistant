# AI Email Assistant

An AI-powered email assistant that helps improve your emails by providing suggestions, corrections, and an improved version of your text.

## Features

- Email content improvement
- Writing suggestions
- Grammar and spelling corrections
- Professional tone enhancement

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI (Python)
- AI: OpenRouter API (Claude 3 Opus)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AI-Email-Assistant.git
cd AI-Email-Assistant
```

2. Backend Setup:
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
```

3. Frontend Setup:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the backend directory:
```
OPENROUTER_API_KEY=your_api_key_here
BACKEND_PORT=8000
FRONTEND_PORT=5174
```

## Running the Application

1. Start the backend server:
```bash
cd backend
source venv/Scripts/activate  # On Windows
python main.py
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `BACKEND_PORT`: Port for the backend server (default: 8000)
- `FRONTEND_PORT`: Port for the frontend server (default: 5174)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.