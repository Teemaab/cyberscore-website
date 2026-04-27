import os
from flask import Flask, send_from_directory
from dotenv import load_dotenv

# Load .env from project root (parent of this backend/ directory)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from routes.chatbot import chatbot_bp

app = Flask(__name__)
app.register_blueprint(chatbot_bp)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


@app.route('/')
def index():
    return send_from_directory(PROJECT_ROOT, 'index.html')


@app.route('/<path:path>')
def static_files(path):
    # send_from_directory prevents directory traversal automatically
    return send_from_directory(PROJECT_ROOT, path)


if __name__ == '__main__':
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=debug, port=port)
