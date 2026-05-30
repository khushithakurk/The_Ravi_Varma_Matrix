require('dotenv').config(); // 1. CRITICAL: Added at the absolute top for local development

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();

// 2. PRODUCTION CORS SETUP: Allows both your local testing suite and your upcoming Vercel production frontend
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'https://your-frontend-vercel-url.vercel.app' // <--- Replace this with your actual frontend Vercel URL later
  ] 
}));
app.use(express.json());

const absoluteImagesPath = path.resolve(__dirname, 'images');
app.use('/images', express.static(absoluteImagesPath));

const PaintingSchema = new mongoose.Schema({
  _id: String,
  image_url: String,
  metadata: {
    title: String,
    artist: String,
    historical_narrative: String
  },
  geometry_layer: Object,
  material_layer: Object,
  historical_layer: Object
}, { collection: 'paintings' });

const Painting = mongoose.models.Painting || mongoose.model('Painting', PaintingSchema);

// 3. SECURE CONFIGURATION: Pulls dynamically from Vercel's Dashboard settings or your local .env file
const atlasUri = process.env.MONGODB_URI;

if (!atlasUri) {
  console.error('\n☠️  ENVIRONMENT CONFIGURATION BLOCKER:');
  console.error('================================================================');
  console.error('The MONGODB_URI environment key is not loaded into memory runtime.');
} else {
  mongoose.connect(atlasUri)
    .then(() => console.log('🚀 SYSTEM CRITICAL STATUS: LIVE ACCESS GRANTED TO ATLAS VECTOR CLUSTER'))
    .catch(err => console.error('☠️ ATLAS CLUSTER HANDSHAKE FAULT:', err));
}

const artworkNarratives = {
  "arjun_subhadra": "Arjuna elopes with Krishna's sister, Subhadra, presenting an extraordinary layout balance of classic landscape depth and emotional drapery composition.",
  "disappointing_news": "An elegant portrait detailing deep internal psychological depth, tracking subtle sadness and melancholy across rich canvas textures.",
  "galaxy_of_musicians": "Varma’s iconic masterpiece unifying diverse socio-cultural identities across India into a singular, balanced symphonic arrangement layout.",
  "hamsa_damyanti": "Damayanti converses with the golden swan about Nala, a definitive cornerstone of theatrical spatial staging and narrative oil mastery.",
  "indira": "A breakthrough late 19th-century portrait capturing elite visual history. Varma seamlessly merges Western structural dimensionality with traditional Indian chromatic layouts.",
  "jatayu_vadham": "The mythical eagle Jatayu violently battles Ravana to save Sita, demonstrating intense directional vector layouts and rich color energy updates.",
  "lady_with_a_mirror": "An intimate, sweeping look at classical self-reflection, framing light distributions perfectly across cosmetics elements and mirror boundaries.",
  "mohini_on_a_swing": "A dynamic depiction of Mohini floating through rural compositions, capturing fluid movement parameters with exceptional fabric lighting layers.",
  "radha_in_the_moonlight": "Radha sits longingly by water beds, optimizing nighttime contrast metrics and soft lunar illumination scatterings across skin textures.",
  "saraswati": "The definitive representation of the goddess of knowledge, balancing iconography lines with a tranquil composition framework.",
  "shakuntala": "Ravi Varma's narrative standard showing Shakuntala pretending to extract a thorn while stealing a glance back at King Dushyanta.",
  "shantanoo_and_matsyagandha": "King Shantanu falls in love with Matsyagandha, the fisherwoman, beautifully capturing epic Vedic longing with oil-painting realism.",
  "simhaka_sairandhri": "Draupadi under the guise of Sairandhri handles volatile royal configurations, blending deep emotional weight with shadow density layers.",
  "the_milkmaid": "A brilliant academic composition tracking traditional rural labor forms, optimizing local texture contrasts and earthen tone layouts.",
  "there_comes_papa": "An elegant, realistic portrait tracking lineage and family expectations, structuring light falloffs through traditional home interiors.",
  "vasant_sena": "Captures dramatic classic performance narrative blocks, tracing intense color saturation metrics and directional spatial movement.",
  "victory_of_indrajit": "Meghanada presents his captured trophies after defeating Indra, displaying epic historical narrative staging and complex figure structures.",
  "woman_holding_a_fruit": "A classic, elegant profile mapping graceful geometric posture balances alongside exceptionally soft light scattering distributions."
};

const runEngineAnalysis = (engineScript, imagePath) => {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, 'analytics_engine', engineScript);
    if (!fs.existsSync(scriptPath)) return resolve(null);

    const worker = spawn('python3', [scriptPath, imagePath]);
    let output = "";
    worker.stdout.on('data', (d) => output += d.toString());
    worker.on('close', () => {
      try { resolve(output.trim() ? JSON.parse(output) : null); } catch (e) { resolve(null); }
    });
    setTimeout(() => { worker.kill(); resolve(null); }, 4000);
  });
};

app.get('/api/paintings', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Atlas database connection loop initializing, try again shortly." });
    }

    const diskFiles = fs.readdirSync(absoluteImagesPath);
    const imageFiles = diskFiles.filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
    const filteredFiles = imageFiles.filter(f => !f.toLowerCase().includes('damask') && !f.toLowerCase().includes('bg'));

    const dynamicGallery = await Promise.all(filteredFiles.map(async (filename) => {
      const assetId = filename.split('.')[0].toLowerCase().trim();
      const lookupKey = assetId;
      const cleanTitle = assetId.toUpperCase().replace(/_/g, ' ');
      const cleanNarrative = artworkNarratives[lookupKey] || `Dynamic computational matrix profile generated live for target asset source: ${filename}.`;

      let databaseRecord = await Painting.findById(assetId);
      const exactImagePath = `/images/${filename}`;

      if (!databaseRecord) {
        console.log(`📡 MongoDB Atlas Seeding New Profile: ${filename}`);
        databaseRecord = await Painting.create({
          _id: assetId,
          image_url: exactImagePath,
          metadata: {
            title: cleanTitle,
            artist: "Raja Ravi Varma",
            historical_narrative: cleanNarrative
          },
          geometry_layer: { total_detected_lines: 0, vector_lines_array: [], vanishing_point: null },
          material_layer: { shannon_entropy_bits: "0.00" },
          historical_layer: {
            press_origin: "Ravi Varma Fine Art Lithographic Press, Malavli Foundry",
            matrix_material: "Solnhofen Bavarian Limestone Core Base"
          }
        });
      } else {
        databaseRecord.image_url = exactImagePath;
        if (artworkNarratives[lookupKey]) {
          databaseRecord.metadata.historical_narrative = artworkNarratives[lookupKey];
        }
        await Painting.findByIdAndUpdate(assetId, { 
          image_url: exactImagePath,
          "metadata.historical_narrative": databaseRecord.metadata.historical_narrative 
        });
      }

      return databaseRecord;
    }));

    res.json(dynamicGallery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Atlas pipeline tracking fault." });
  }
});

app.get('/api/paintings/:id', async (req, res) => {
  try {
    const assetId = req.params.id.toLowerCase().trim();
    let record = await Painting.findById(assetId);
    if (!record) return res.status(404).json({ error: "Atlas entry missing." });

    const diskFiles = fs.readdirSync(absoluteImagesPath);
    const targetFile = diskFiles.find(f => f.toLowerCase().startsWith(assetId));
    
    if (targetFile) {
      const absoluteImagePath = path.join(absoluteImagesPath, targetFile);
      
      console.log(`📊 Compiling Live Computer Vision Overlays for: ${targetFile}`);
      const geoData = await runEngineAnalysis('geometry_engine.py', absoluteImagePath);
      const colorData = await runEngineAnalysis('color_engine.py', absoluteImagePath);

      if (geoData) record.geometry_layer = geoData;
      if (colorData) record.material_layer = colorData;
      
      record.image_url = `/images/${targetFile}`;
      
      await Painting.findByIdAndUpdate(assetId, {
        image_url: record.image_url,
        geometry_layer: record.geometry_layer,
        material_layer: record.material_layer
      });
    }

    res.json(record);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 4. DYNAMIC PORT BINDING: Swaps static 5001 for Vercel's runtime environment port handler
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`📡 ORCHESTRATOR PIPELINE ACTIVE ON PORT ${PORT}`));