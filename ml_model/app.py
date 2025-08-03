from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import yake
from suggestion_model import SuggestionEngine

# ✅ Initialize Flask app
app = Flask(__name__)
CORS(app)

# 🔍 Debug: Show current files
print("📂 Current files in project directory:")
for root, dirs, files in os.walk(".", topdown=True):
    for name in files:
        print(os.path.join(root, name))

# ✅ Load ML model and vectorizer
try:
    genre_model = joblib.load('model/model.pkl')
    genre_vectorizer = joblib.load('model/vectorizer.pkl')
    print("✅ Genre model and vectorizer loaded successfully.")
except Exception as e:
    print("❌ Error loading ML model or vectorizer:", e)

# ✅ Initialize autocomplete engine
try:
    suggest_engine = SuggestionEngine('data/books.csv')
    print("✅ Suggestion engine initialized with books.csv.")
except Exception as e:
    print("❌ Error initializing SuggestionEngine:", e)

# 🧠 Genre prediction route
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

# 🏷️ Tag extraction route
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

# 🧠 Autocomplete route
@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])

    try:
        suggestions = suggest_engine.suggest_titles(query)
        return jsonify(suggestions)
    except Exception as e:
        return jsonify({'error': f'Autocomplete failed: {str(e)}'}), 500

# ✅ Run server
if __name__ == '__main__':
    app.run(port=5001)
