import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

df = pd.read_csv('data/books.csv').dropna(subset=['summary'])

vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
X = vectorizer.fit_transform(df['summary'])

joblib.dump(X.toarray(), "embeddings.pkl")
joblib.dump(df['index'].tolist(), "book_ids.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("✅ Embeddings and vectorizer saved.")
