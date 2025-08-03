import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class SuggestionEngine:
    def __init__(self, filepath):
        self.df = pd.read_csv(filepath).dropna(subset=['title'])
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
        self.titles = self.df['title'].tolist()
        self.title_vectors = self.vectorizer.fit_transform(self.titles)

    def suggest_titles(self, query, top_n=5):
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.title_vectors).flatten()
        top_indices = similarities.argsort()[::-1][:top_n]
        return [self.titles[i] for i in top_indices]
