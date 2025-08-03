import os
import requests

# Files to download (replace these with your actual Dropbox links)
files = {
    "data/books.csv": "https://www.dropbox.com/scl/fi/mmyw0x275o4erewvdiq11/books.csv?rlkey=twm75c9v6oxasb3qk2an65kc7&dl=1",
    "model/book_ids.pkl": "https://www.dropbox.com/scl/fi/n8eao3tqcwa5hmc6e81zn/book_ids.pkl?rlkey=9p0u8cnr0f6cvuw3wqmuqpxle&dl=1",
    "model/book_tags.json": "https://www.dropbox.com/scl/fi/mx58y2dh2tnhe29cnb3rn/book_tags.json?rlkey=tu6at9ti44e50pdnxv9057xc9&dl=1",
    "model/embeddings.pkl": "https://www.dropbox.com/scl/fi/tc0mkkfkuhsrenakod7vn/embeddings.pkl?rlkey=hjoxcqi5jd2ygtwqwytsf2bqo&dl=1",
    "model/model.pkl": "https://www.dropbox.com/scl/fi/0yhrpluoa2edta7kmewvh/model.pkl?rlkey=qh4oujppdfl792fk8oe8noekq&dl=1",
    "model/vectorizer.pkl": "https://www.dropbox.com/scl/fi/fedav9juj7ywdp1nfyw6l/vectorizer.pkl?rlkey=e1i8a50o1hcgc2i9ydwyt1oct&dl=1",
}

def ensure_directories():
    for filepath in files:
        dir_path = os.path.dirname(filepath)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
            print(f"📁 Created directory: {dir_path}")

def is_valid_file(response, path):
    content_type = response.headers.get("Content-Type", "").lower()

    # Expected content types
    if path.endswith(".pkl") and "application/octet-stream" in content_type:
        return True
    elif path.endswith(".csv") and ("text/plain" in content_type or "application/octet-stream" in content_type):
        return True
    elif path.endswith(".json") and "application/json" in content_type:
        return True

    # Fallback: check file size
    if len(response.content) < 100:  # suspiciously small file
        return False

    return True

def download_file(path, url):
    if os.path.exists(path):
        print(f"✅ {path} already exists. Skipping.")
        return

    print(f"⬇️ Downloading {path}...")
    try:
        response = requests.get(url)
        response.raise_for_status()

        if not is_valid_file(response, path):
            raise ValueError(f"File {path} appears invalid or empty.")

        with open(path, "wb") as f:
            f.write(response.content)
        print(f"✅ Saved: {path}")

    except Exception as e:
        print(f"❌ Failed to download {path}: {e}")

def main():
    print("📦 Starting model and data download...")
    ensure_directories()

    for path, url in files.items():
        download_file(path, url)

    print("🎉 All downloads completed.")

if __name__ == "__main__":
    main()
