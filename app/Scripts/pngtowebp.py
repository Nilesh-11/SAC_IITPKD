import os
from PIL import Image

def convert_png_to_webp(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(".webp"):
                png_path = os.path.join(root, file)
                webp_path = os.path.splitext(png_path)[0] + ".webp"

                try:
                    with Image.open(png_path) as img:
                        img.save(webp_path, "webp")
                    print(f"Converted: {png_path} -> {webp_path}")
                except Exception as e:
                    print(f"Failed to convert {png_path}: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python convert_png_to_webp.py /path/to/folder")
    else:
        convert_png_to_webp(sys.argv[1])
