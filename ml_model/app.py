from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import yake

from suggestion_model import SuggestionEngine

# ✅ Only one Flask app
app = Flask(__name__)
CORS(app)

# Load model & vectorizer
try:
    genre_model = joblib.load('model/model.pkl')
    genre_vectorizer = joblib.load('model/vectorizer.pkl')
except Exception as e:
    print("❌ Error loading ML model:", e)

# Genre prediction
@app.route('/predict-genre', methods=['POST'])
def predict_genre():
    data = request.get_json()
    summary = data.get('summary', '')
    if not summary:
        return jsonify({'error': 'Summary required'}), 400

    try:
        vec = genre_vectorizer.transform([summary])
        prediction = genre_model.predict(vec)[0]
        return jsonify({'predicted_genre': prediction})
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

# Tag extraction
@app.route('/extract-tags', methods=['POST'])
def extract_tags():
    data = request.get_json()
    summary = data.get('summary', '')
    if not summary:
        return jsonify({'error': 'Summary required'}), 400

    try:
        kw_extractor = yake.KeywordExtractor(lan="en", n=1, top=10)
        keywords = kw_extractor.extract_keywords(summary)
        tags = [kw for kw, _ in keywords]
        return jsonify({'tags': tags})
    except Exception as e:
        return jsonify({'error': f'Tag extraction failed: {str(e)}'}), 500

# Autocomplete route
suggest_engine = SuggestionEngine('data/books.csv')

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])

    suggestions = suggest_engine.suggest_titles(query)
    return jsonify(suggestions)

if __name__ == '__main__':
    app.run(port=5001)
