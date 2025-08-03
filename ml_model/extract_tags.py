import pandas as pd
import json
from rake_nltk import Rake
from nltk.tokenize import sent_tokenize
import rake_nltk.rake

# Patch for sentence tokenizer
rake_nltk.rake.Rake._tokenize_text_to_sentences = lambda self, text: sent_tokenize(text)

df = pd.read_csv('data/books.csv').dropna(subset=['summary'])

rake = Rake()
tags_dict = {}

for idx, row in df.iterrows():
    rake.extract_keywords_from_text(row['summary'])
    tags = rake.get_ranked_phrases()[:5]
    tags_dict[int(row['index'])] = tags

with open("book_tags.json", "w") as f:
    json.dump(tags_dict, f)

print("✅ Tags saved to book_tags.json")
