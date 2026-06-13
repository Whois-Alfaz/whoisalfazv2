import os
from PIL import Image

def process_image(src_path, dest_path):
    print(f"Processing {src_path} -> {dest_path}...")
    if not os.path.exists(src_path):
        print(f"Error: Source file does not exist: {src_path}")
        return False
    
    img = Image.open(src_path)
    
    # Resize to 1280x720 to enforce 16:9 aspect ratio and save bytes
    img = img.resize((1280, 720), Image.Resampling.LANCZOS)
    
    # Compress iteratively to ensure it is under 100KB (102400 bytes)
    quality = 85
    while quality >= 20:
        img.save(dest_path, "WEBP", quality=quality)
        file_size = os.path.getsize(dest_path)
        print(f"  Quality {quality} -> Size: {file_size / 1024:.2f} KB")
        if file_size < 100 * 1024:
            print(f"  Success! Image size is {file_size / 1024:.2f} KB")
            return True
        quality -= 5
        
    print(f"Warning: Could not compress under 100KB even at quality 20.")
    return False

def main():
    brain_dir = r"C:\Users\user\.gemini\antigravity\brain\64c9a70c-f003-45c7-a4f8-0a372322e422"
    tmp_images_dir = r"e:\Ai Agents\whoisalfaz.me\Web Projects\antigravity\whoisalfaz-v2\tmp_images"
    
    # Create directory if it doesn't exist
    os.makedirs(tmp_images_dir, exist_ok=True)
    
    images = [
        ("monday_recipes_featured_1781156516861.png", "monday_recipes_featured.webp"),
        ("monday_recipes_body1_1781156530920.png", "monday_recipes_body1.webp"),
        ("monday_recipes_body2_1781156545177.png", "monday_recipes_body2.webp")
    ]
    
    for src_name, dest_name in images:
        src = os.path.join(brain_dir, src_name)
        dest = os.path.join(tmp_images_dir, dest_name)
        process_image(src, dest)

if __name__ == "__main__":
    main()
