import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

# Ensure model directory exists
os.makedirs('model', exist_ok=True)

# Load and clean data
df = pd.read_csv('data/books.csv')
df = df[['summary', 'genre']].dropna()

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    df['summary'], df['genre'], test_size=0.2, random_state=42
)

# Initialize TF-IDF Vectorizer
vectorizer = TfidfVectorizer(
    max_features=8000,
    stop_words='english',
    ngram_range=(1, 2)
)

# Transform text data
X_train_vec = vectorizer.fit_transform(X_train)

# Initialize and train model
model = SGDClassifier(loss='log_loss', max_iter=1000, random_state=42)
model.fit(X_train_vec, y_train)

# Save model and vectorizer
joblib.dump(model, 'model/model.pkl')
joblib.dump(vectorizer, 'model/vectorizer.pkl')

print("✅ Genre prediction model trained and saved successfully.")
