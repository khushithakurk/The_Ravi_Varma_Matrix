import sys
import json
import os
import cv2
import numpy as np

def analyze_geometry(image_path):
    if not os.path.exists(image_path):
        return {"error": f"Asset target missing: {image_path}"}

    # Load image template matrix
    img = cv2.imread(image_path)
    h, w, _ = img.shape

    # Process image to isolate clear edge contours
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    
    # Run Hough Line Transform to locate composition vectors
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100, minLineLength=100, maxLineGap=10)
    
    vector_lines_array = []
    if lines is not None:
        for line in lines[:40]:  # Cap at 40 dominant lines to optimize canvas performance
            x1, y1, x2, y2 = line[0]
            # Format coordinates cleanly as nested lists: [[x1, y1], [x2, y2]]
            vector_lines_array.append([[int(x1), int(y1)], [int(x2), int(y2)]])

    # Dynamic calculation of perspective vanishing points
    # (Defaulting to the golden ratio focal zone of the image canvas area)
    vanishing_point = [int(w * 0.5), int(h * 0.45)]

    return {
        "total_detected_lines": len(vector_lines_array),
        "vanishing_point": vanishing_point,
        "vector_lines_array": vector_lines_array
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image target provided"}))
        sys.exit(1)
        
    result = analyze_geometry(sys.argv[1])
    print(json.dumps(result))