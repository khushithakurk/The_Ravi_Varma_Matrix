import sys
import json
import os
import cv2
import numpy as np

def calculate_material_entropy(image_path):
    if not os.path.exists(image_path):
        return {"error": f"Asset target missing: {image_path}"}

    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Compute localized Shannon Entropy parameters
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
    hist_norm = hist / hist.sum()
    
    # Filter out zero values to avoid logarithmic exceptions
    hist_norm = hist_norm[hist_norm > 0]
    shannon_entropy = -np.sum(hist_norm * np.log2(hist_norm))

    return {
        "shannon_entropy_bits": f"{float(shannon_entropy):.2f}"
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image target provided"}))
        sys.exit(1)
        
    result = calculate_material_entropy(sys.argv[1])
    print(json.dumps(result))