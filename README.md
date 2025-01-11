# AI Chat Interface

A modern chat interface built with React and Flask, featuring real-time communication with an Ollama-powered AI model.

## Features

- Real-time chat interface with AI responses
- Dark/Light mode toggle
- Markdown support for messages
- Syntax highlighting for code blocks
- Save favorite prompts (once database is initialized)
- Responsive design

## Tech Stack

### Frontend
- React
- TailwindCSS
- React Markdown
- React Syntax Highlighter
- FontAwesome icons

### Backend
- Flask
- Flask-CORS
- Ollama API integration

## Setup

### Prerequisites
- Node.js
- Python 3.x
- Ollama installed and running locally

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
pip install flask flask-cors requests
```

## Running the Application

1. Start the Flask backend server:
```bash
python backend/app.py
```

2. Start the React development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Architecture

### Backend
The Flask server (referenced in `backend/app.py`) handles:
- API routing
- Communication with Ollama model
- Error handling and logging

Key backend code:

```13:41:backend/app.py
OLLAMA_ENDPOINT = "http://localhost:11434/api/chat"  # Using chat endpoint instead of generate

def generate_response(message):
    try:
        payload = {
            "model": "mistral",  # Good balance of performance and resource usage
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ],
            "stream": False,
            "options": {
                "temperature": 0.7,
                "num_predict": 500,
                "top_k": 40,
                "top_p": 0.9
            }
        }
        
        logger.info("Sending request to Ollama...")
        response = requests.post(OLLAMA_ENDPOINT, json=payload)
        response.raise_for_status()
        
        return response.json()['message']['content']
    except Exception as e:
        logger.error(f"Ollama API error: {str(e)}")
        raise
```


### Frontend
The main React application (referenced in `src/App.js`) manages:
- Chat state
- Message handling
- Dark mode toggle
- Component composition

Key frontend code:

```63:88:src/App.js
  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { text: message, isBot: false }]);
    
    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message}`, 
        isBot: true 
      }]);
    }
  };
```


## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
