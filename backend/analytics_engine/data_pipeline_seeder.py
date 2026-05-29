import json
import os
import numpy as np
import cv2 as cv
from sklearn.cluster import KMeans
from skimage.feature import local_binary_pattern

# =====================================================================
# CORE ALGORITHM DEPENDENCIES (UNIFIED ENGINE SUB-CLASSES)
# =====================================================================

class GeometryEngine:
    def __init__(self, image_path: str):
        self.img_bgr = cv.imread(image_path)
        if self.img_bgr is None:
            raise FileNotFoundError(f"Could not load image at {image_path}")
        self.img_gray = cv.cvtColor(self.img_bgr, cv.COLOR_BGR2GRAY)
        self.img_blurred = cv.GaussianBlur(self.img_gray, (7, 7), 0)
        
    def extract_lines(self, low_thresh=80, high_thresh=180):
        edges = cv.Canny(self.img_blurred, low_thresh, high_thresh)
        raw_lines = cv.HoughLinesP(edges, 1, np.pi / 180, threshold=80, minLineLength=60, maxLineGap=15)
        
        cleaned_lines = []
        if raw_lines is not None:
            for line in raw_lines:
                x1, y1, x2, y2 = line[0]
                cleaned_lines.append(((int(x1), int(y1)), (int(x2), int(y2))))
        return cleaned_lines

    def find_intersection(self, line1, line2):
        (x1, y1), (x2, y2) = line1
        (x3, y3), (x4, y4) = line2

        A1 = y2 - y1
        B1 = x1 - x2
        C1 = A1 * x1 + B1 * y1

        A2 = y4 - y3
        B2 = x3 - x4
        C2 = A2 * x3 + B2 * y3

        D = A1 * B2 - A2 * B1
        if D == 0:
            return None

        x = (C1 * B2 - C2 * B1) / D
        y = (A2 * C1 - A1 * C2) / D
        return (int(x), int(y))

    def compute_vanishing_point_matrix(self, lines):
        intersections = []
        num_lines = len(lines)
        h, w = self.img_gray.shape[0], self.img_gray.shape[1]
        
        for i in range(num_lines):
            for j in range(i + 1, num_lines):
                pt = self.find_intersection(lines[i], lines[j])
                if pt is not None:
                    x, y = pt
                    if 0 <= x <= w and 0 <= y <= h:
                        intersections.append(pt)
        return intersections

    def calculate_vanishing_point(self, intersections):
        if len(intersections) == 0:
            return (int(self.img_gray.shape[1] / 2), int(self.img_gray.shape[0] / 2))
        pts_array = np.array(intersections)
        vp_x = np.median(pts_array[:, 0])
        vp_y = np.median(pts_array[:, 1])
        return (int(vp_x), int(vp_y))


class CompositionEngine:
    def __init__(self, height: int, width: int):
        self.height = height
        self.width = width
        self.phi = 1.61803398875

    def calculate_golden_nodes(self):
        x_cut_left = self.width / self.phi
        x_cut_right = self.width - x_cut_left
        y_cut_top = self.height / self.phi
        y_cut_bottom = self.height - y_cut_top
        
        return {
            "top_left": [int(x_cut_right), int(y_cut_bottom)],
            "top_right": [int(x_cut_left), int(y_cut_bottom)],
            "bottom_left": [int(x_cut_right), int(y_cut_top)],
            "bottom_right": [int(x_cut_left), int(y_cut_top)]
        }

    def compute_intersection_error(self, vanishing_point, nodes):
        vp_x, vp_y = vanishing_point
        error_matrix = {}
        for node_name, node_coord in nodes.items():
            nx, ny = node_coord
            distance = np.sqrt((vp_x - nx) ** 2 + (vp_y - ny) ** 2)
            error_matrix[node_name] = round(float(distance), 2)
        return error_matrix


class ColorEngine:
    def __init__(self, image_path: str):
        self.img_bgr = cv.imread(image_path)
        self.img_rgb = cv.cvtColor(self.img_bgr, cv.COLOR_BGR2RGB)
        self.img_lab = cv.cvtColor(self.img_rgb, cv.COLOR_RGB2Lab)
        self.img_gray = cv.cvtColor(self.img_bgr, cv.COLOR_BGR2GRAY)

    def extract_dominant_palette(self, k_clusters=5):
        flat_pixels = self.img_lab.reshape(-1, 3)
        kmeans = KMeans(n_clusters=k_clusters, random_state=42, n_init=10)
        kmeans.fit(flat_pixels)
        
        lab_centroids = kmeans.cluster_centers_
        lab_centroids_matrix = np.uint8([lab_centroids])
        rgb_centroids = cv.cvtColor(lab_centroids_matrix, cv.COLOR_Lab2RGB)[0]
        return rgb_centroids.astype(int).tolist()

    def compute_chromatic_entropy(self):
        hist, _ = np.histogram(self.img_gray, bins=256, range=(0, 256), density=True)
        clean_hist = hist[hist > 0]
        entropy_score = -np.sum(clean_hist * np.log2(clean_hist))
        return float(entropy_score)


class TextureEngine:
    def __init__(self, image_path: str):
        self.img_bgr = cv.imread(image_path)
        self.img_gray = cv.cvtColor(self.img_bgr, cv.COLOR_BGR2GRAY)

    def extract_texture_signature(self, radius=3):
        n_points = 8 * radius
        lbp_matrix = local_binary_pattern(self.img_gray, n_points, radius, method='uniform')
        bins_target = n_points + 2
        hist, _ = np.histogram(lbp_matrix.ravel(), bins=np.arange(0, bins_target + 1), density=True)
        return hist.tolist()


# =====================================================================
# MASTER PIPELINE PIPELINE EXECUTION
# =====================================================================

def compile_artwork_dataset(image_path, title, year, narrative_text):
    print(f"Starting database seeder script execution for: '{title}'...")
    
    # 1. Fire up calculation engines
    geom_eng = GeometryEngine(image_path)
    color_eng = ColorEngine(image_path)
    text_eng = TextureEngine(image_path)
    
    h, w = geom_eng.img_gray.shape[0], geom_eng.img_gray.shape[1]
    comp_eng = CompositionEngine(height=h, width=w)
    
    # 2. Extract Data Dimensions
    lines = geom_eng.extract_lines()
    intersections = geom_eng.compute_vanishing_point_matrix(lines)
    vp = geom_eng.calculate_vanishing_point(intersections)
    
    nodes = comp_eng.calculate_golden_nodes()
    errors = comp_eng.compute_intersection_error(vp, nodes)
    
    palette = color_eng.extract_dominant_palette()
    entropy = color_eng.compute_chromatic_entropy()
    texture_sig = text_eng.extract_texture_signature()
    
    # 3. Clean up Python tuples/nested arrays to build compliant standard BSON lists
    clean_lines_json_format = []
    for line in lines:
        (x1, y1), (x2, y2) = line
        clean_lines_json_format.append([[int(x1), int(y1)], [int(x2), int(y2)]])
        
    # 4. Map structured Document Model Properties
    master_document = {
        "painting_id": title.lower().replace(" ", "_"),
        "metadata": {
            "title": title,
            "year": year,
            "canvas_dimensions": {"height": h, "width": w},
            "historical_narrative": narrative_text
        },
        "geometry_layer": {
            "vanishing_point": list(vp) if vp else None,
            "golden_nodes": nodes,
            "alignment_errors": errors,
            "vector_lines_array": clean_lines_json_format
        },
        "material_layer": {
            "dominant_palette_rgb": palette,
            "shannon_entropy_bits": round(entropy, 4),
            "lbp_texture_fingerprint": [round(x, 4) for x in texture_sig]
        }
    }
    
    # 5. Export Document directly to working directory disk storage
    output_filename = f"{master_document['painting_id']}_seed_data.json"
    with open(output_filename, "w") as f:
        json.dump(master_document, f, indent=4)
        
    print(f"[PIPELINE SUCCESS] Exported clean dataset to '{output_filename}'!")


if __name__ == "__main__":
    PATH = '/Users/khushithakur/Desktop/raja_ravi_verma_matrix/test_image.jpg'
    
    narrative = (
        "A breakthrough late 19th-century portrait capturing elite visual history. "
        "Ravi Varma seamlessly merges Western academic structural dimensionality with traditional Indian "
        "chromatic fields, establishing a timeless, localized standard for classical beauty."
    )
    
    compile_artwork_dataset(PATH, "Indira", 1896, narrative)