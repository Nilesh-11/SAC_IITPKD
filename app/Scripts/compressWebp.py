import os
from PIL import Image

def compress_webp(directory, quality=80):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(".webp"):
                webp_path = os.path.join(root, file)
                temp_path = webp_path + ".temp"

                try:
                    with Image.open(webp_path) as img:
                        img.save(temp_path, "webp", quality=quality, method=6)  # method=6 for best compression
                    os.replace(temp_path, webp_path)
                    print(f"Compressed: {webp_path}")
                except Exception as e:
                    print(f"Failed to compress {webp_path}: {e}")
                finally:
                    if os.path.exists(temp_path):
                        os.remove(temp_path)

if __name__ == "__main__":
    import sys
    if len(sys.argv) not in (2, 3):
        print("Usage: python compress_webp.py /path/to/folder [quality]")
    else:
        dir_path = sys.argv[1]
        quality = int(sys.argv[2]) if len(sys.argv) == 3 else 80
        compress_webp(dir_path, quality)
