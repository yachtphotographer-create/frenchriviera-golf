#!/bin/bash
# Compress golf course images for better page speed
# Run this on the server: bash scripts/compress-images.sh

IMAGE_DIR="/var/www/frenchriviera-golf/public/uploads/courses"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Installing ImageMagick..."
    sudo apt-get update && sudo apt-get install -y imagemagick
fi

echo "Compressing images in $IMAGE_DIR..."

for img in "$IMAGE_DIR"/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")

        # Get current file size
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)

        # Resize to max 1200px width and compress to 80% quality
        convert "$img" -resize "1200x>" -quality 80 -strip "$img"

        # Get new file size
        new_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)

        echo "✓ $filename: ${original_size} → ${new_size} bytes"
    fi
done

echo ""
echo "Done! Images compressed."
