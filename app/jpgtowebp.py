import os
from PIL import Image

def convert_jpg_to_webp(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith((".jpg", ".jpeg")):
                jpg_path = os.path.join(root, file)
                webp_path = os.path.splitext(jpg_path)[0] + ".webp"

                try:
                    with Image.open(jpg_path) as img:
                        img.save(webp_path, "webp")
                    print(f"Converted: {jpg_path} -> {webp_path}")
                except Exception as e:
                    print(f"Failed to convert {jpg_path}: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python convert_to_webp.py /path/to/folder")
    else:
        convert_jpg_to_webp(sys.argv[1])
