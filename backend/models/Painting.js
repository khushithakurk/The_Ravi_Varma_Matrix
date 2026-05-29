// backend/models/Painting.js
const mongoose = require('mongoose');

const PaintingSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g., "indira", "shakuntala"
  image_url: { type: String, required: true }, // The single raw image link
  metadata: {
    title: { type: String, required: true },
    artist: { type: String, default: "Raja Ravi Varma" },
    year: { type: String },
    medium: { type: String },
    current_location: { type: String },
    canvas_dimensions: {
      width: { type: Number, default: 800 },
      height: { type: Number, default: 1000 }
    },
    historical_narrative: { type: String, required: true }
  },
  geometry_layer: {
    vanishing_point: { type: [Number], default: [400, 300] }, // [x, y]
    total_detected_lines: { type: Number, default: 100 },
    distortion_coefficient: { type: String, default: "0.00%" },
    vector_lines_array: { type: Array, default: [] } // Line coordinate sets
  },
  material_layer: {
    shannon_entropy_bits: { type: Number, default: 7.0 },
    color_channels: {
      r: { type: String, default: "7.0 bits" },
      g: { type: String, default: "7.0 bits" },
      b: { type: String, default: "7.0 bits" }
    }
  },
  historical_layer: {
    press_origin: { type: String },
    matrix_material: { type: String }
  }
});

module.exports = mongoose.model('Painting', PaintingSchema);