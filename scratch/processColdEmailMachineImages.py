import os
from PIL import Image

img_dir = "tmp_images"
targets = ["cold_email_machine_featured", "cold_email_machine_body1", "cold_email_machine_body2", "cold_email_machine_social"]

for target in targets:
    png_path = os.path.join(img_dir, f"{target}.png")
    webp_path = os.path.join(img_dir, f"{target}.webp")
    if os.path.exists(png_path):
        im = Image.open(png_path)
        quality = 75
        while quality > 5:
            im.save(webp_path, "WEBP", quality=quality)
            size = os.path.getsize(webp_path) / 1024
            if size < 100.0:
                break
            quality -= 5
        print(f"Compressed {target}.webp to {size:.2f} KB (quality={quality})")
