import os

def delete_non_512_webp_images(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(".webp") and not file.endswith("_512.webp"):
                file_path = os.path.join(root, file)
                try:
                    os.remove(file_path)
                    print(f"Deleted: {file_path}")
                except Exception as e:
                    print(f"Failed to delete {file_path}: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python delete_non_512_webp.py /path/to/folder")
    else:
        delete_non_512_webp_images(sys.argv[1])
