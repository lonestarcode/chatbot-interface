from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import requests
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

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

@app.route('/', methods=['GET', 'OPTIONS'])
def home():
    logger.info("Home endpoint accessed")
    return "Flask server is running"

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    logger.info(f"Request method: {request.method}")
    
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})
        
    try:
        data = request.json
        message = data.get('message', '')
        logger.info(f"Received message: {message}")
        
        if not message:
            return jsonify({'error': 'No message found'}), 400

        response = generate_response(message)
        logger.info(f"Generated response: {response}")
        
        return jsonify({'response': response})
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5001) 