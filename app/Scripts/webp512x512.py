import os
from PIL import Image

def resize_webp_images(directory, size=(512, 512)):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(".webp") and not file.endswith("_512.webp"):
                webp_path = os.path.join(root, file)
                new_filename = os.path.splitext(file)[0] + "_512.webp"
                new_path = os.path.join(root, new_filename)

                try:
                    with Image.open(webp_path) as img:
                        img = img.convert("RGBA")  # Ensure transparency is preserved if needed
                        resized_img = img.resize(size, Image.LANCZOS)
                        resized_img.save(new_path, "webp")
                    print(f"Resized: {webp_path} -> {new_path}")
                except Exception as e:
                    print(f"Failed to resize {webp_path}: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python resize_webp_512.py /path/to/folder")
    else:
        resize_webp_images(sys.argv[1])
