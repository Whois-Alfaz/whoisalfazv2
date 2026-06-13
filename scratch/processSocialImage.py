import os
from PIL import Image

src_path = r"C:\Users\user\.gemini\antigravity\brain\64c9a70c-f003-45c7-a4f8-0a372322e422\monday_recipes_social_1781157156483.png"
dest_path = r"e:\Ai Agents\whoisalfaz.me\Web Projects\antigravity\whoisalfaz-v2\tmp_images\monday_recipes_social.webp"

img = Image.open(src_path)
img = img.resize((1200, 630), Image.Resampling.LANCZOS) # Standard open-graph size

quality = 85
while quality >= 20:
    img.save(dest_path, "WEBP", quality=quality)
    file_size = os.path.getsize(dest_path)
    print(f"Quality {quality} -> Size: {file_size / 1024:.2f} KB")
    if file_size < 100 * 1024:
        print(f"Success! Image size is {file_size / 1024:.2f} KB")
        break
    quality -= 5
