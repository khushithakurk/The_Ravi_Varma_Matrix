import React, { useState, useEffect, useRef } from 'react';

// Import local assets from frontend src/assets directory natively via Vite
import artistPortraitFile from './assets/rrv.jpg';
import damaskBgFile from './assets/damask.jpg';

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');
  
  body {
    margin: 0;
    background-color: #050507;
    color: #e2e8f0;
    font-family: 'Playfair Display', Georgia, serif;
    overflow-x: hidden;
  }
  .font-serif-museum { font-family: 'Cinzel', Georgia, serif; }
  .font-body-artsy { font-family: 'Playfair Display', Georgia, serif; }
  .font-mono-subdued { font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 2px; }
  
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  .matrix-scanner::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, rgba(217, 119, 6, 0.08), transparent);
    animation: scanline 4s linear infinite;
    pointer-events: none;
  }
  .fade-in-up {
    animation: fadeInUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .museum-btn {
    background: transparent;
    border: 1px solid #d97706;
    color: #f4f4f6;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 4px;
    padding: 16px 40px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }
  .museum-btn:hover {
    background-color: #d97706;
    color: #050507;
    box-shadow: 0 0 25px rgba(217, 119, 6, 0.4);
    transform: translateY(-2px);
  }

  .nav-btn {
    background: transparent;
    border: 1px solid #27272a;
    color: #a1a1aa;
    font-size: 12px;
    font-family: 'Cinzel', serif;
    letter-spacing: 2px;
    padding: 8px 20px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  .nav-btn:hover {
    border-color: #d97706;
    color: #d97706;
    background-color: rgba(217, 119, 6, 0.05);
  }

  .rotunda-viewport {
    width: 100vw; 
    min-height: 100vh; 
    padding: 64px 32px; 
    box-sizing: border-box;
    position: relative;
    background-color: #050507;
  }
  
  .rotunda-viewport-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: repeat;
    background-size: 380px auto; 
    opacity: 0.28; 
    pointer-events: none;
    z-index: 1;
  }

  .rotunda-viewport::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 45%, #050507 92%);
    pointer-events: none;
    z-index: 2;
  }

  .rotunda-contents {
    position: relative;
    z-index: 10;
    max-width: 1400px; 
    margin: 0 auto;
  }

  .museum-clean-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 54px;
    width: 100%;
  }
  @media (max-width: 1024px) { .museum-clean-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px) { .museum-clean-grid { grid-template-columns: 1fr; } }

  .collection-card {
    display: flex;
    flex-direction: column;
    background-color: rgba(11, 11, 15, 0.94);
    backdrop-filter: blur(20px);
    border: 1px solid #1c1c1f;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .collection-card:hover {
    transform: translateY(-8px);
    border-color: #d97706;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(217, 119, 6, 0.15);
  }
  
  .image-container {
    width: 100%;
    height: 420px; 
    overflow: hidden;
    background-color: #020203;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #141417;
  }
  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .collection-card:hover .card-image {
    transform: scale(1.03);
  }

  /* ELEGANT PALACE STYLE LANDING FOOTER MARKER */
  .museum-footer {
    position: absolute;
    bottom: 32px;
    left: 0;
    width: 100%;
    text-align: center;
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 3px;
    color: rgba(180, 147, 86, 0.5);
    text-transform: uppercase;
    z-index: 30;
  }
  .museum-footer span {
    color: rgba(217, 119, 6, 0.7);
    font-weight: 600;
  }
`;

export default function App() {
  const [viewMode, setViewMode] = useState('hall');
  const [zoomTrigger, setZoomTrigger] = useState(false);
  const [paintings, setPaintings] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [activeDimension, setActiveDimension] = useState('intro');

  const introRef = useRef(null);
  const grayRef = useRef(null);
  const edgeRef = useRef(null);
  const mathRef = useRef(null);
  const matRef = useRef(null);
  const histRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

const BACKEND_BASE_URL = "https://the-ravi-varma-matrix.onrender.com"
  const leftWingBackdrop = `${BACKEND_BASE_URL}/images/Shantanoo_and_Matsyagandha.jpg`;
  const rightWingBackdrop = `${BACKEND_BASE_URL}/images/shakuntala.jpg`;
  //frontend
  const genericFallbackPlaceholder = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%2309090c'/></svg>";

  const cleanUrl = (urlStr) => {
    if (!urlStr) return genericFallbackPlaceholder;
    let computedUrl = urlStr;
    const lower = urlStr.toLowerCase();
    if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
      const cleanPath = urlStr.startsWith('/') ? urlStr : `/${urlStr}`;
      computedUrl = `${BACKEND_BASE_URL}${cleanPath}`;
    }
    return `${computedUrl}?v=${new Date().getTime()}`;
  };

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/paintings`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const normalized = data.map(item => ({
            ...item,
            image_url: cleanUrl(item.image_url)
          }));
          setPaintings(normalized);
        }
      })
      .catch(err => console.error("Pipeline Sync Error:", err));
    
    setTimeout(() => setZoomTrigger(true), 400);
  }, []);

  const drawVectorOverlays = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !selectedArt) return;

    const ctx = canvas.getContext('2d');
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!selectedArt.geometry_layer?.vector_lines_array) return;
    
    const scaleX = img.clientWidth / (img.naturalWidth || 800);
    const scaleY = img.clientHeight / (img.naturalHeight || 1200);

    if (activeDimension === 'edge_map' || activeDimension === 'vanishing_point') {
      ctx.strokeStyle = activeDimension === 'vanishing_point' ? 'rgba(217, 119, 6, 0.8)' : 'rgba(180, 147, 86, 0.75)';
      ctx.lineWidth = 2;
      
      selectedArt.geometry_layer.vector_lines_array.forEach(([p1, p2]) => {
        if (!p1 || !p2) return;
        ctx.beginPath();
        ctx.moveTo(p1[0] * scaleX, p1[1] * scaleY);
        ctx.lineTo(p2[0] * scaleX, p2[1] * scaleY);
        ctx.stroke();
      });
    }

    if (activeDimension === 'vanishing_point' && selectedArt.geometry_layer?.vanishing_point) {
      const [vpX, vpY] = selectedArt.geometry_layer.vanishing_point;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
      ctx.beginPath();
      ctx.arc(vpX * scaleX, vpY * scaleY, 14, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (viewMode === 'analysis') {
      const timer = setTimeout(drawVectorOverlays, 100);
      return () => clearTimeout(timer);
    }
  }, [viewMode, activeDimension, selectedArt]);

  useEffect(() => {
    if (viewMode !== 'analysis') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveDimension(entry.target.id);
      });
    }, { threshold: 0.1 });

    [introRef, grayRef, edgeRef, mathRef, matRef, histRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [viewMode]);

  const handleDynamicCardSelection = async (art) => {
    setSelectedArt(art); 
    setViewMode('analysis');

    try {
      const livePayload = await fetch(`${BACKEND_BASE_URL}/api/paintings/${art._id}`).then(r => r.json());
      if (livePayload && !livePayload.error) {
        setSelectedArt({
          ...livePayload,
          image_url: cleanUrl(livePayload.image_url)
        });
      }
    } catch (e) {
      console.error("Live analysis stream interrupted:", e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050507' }}>
      <style>{cssStyles}</style>

      {/* STAGE 1: PORTAL ENTRY HALLWAY */}
      {viewMode === 'hall' && (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', left: '1%', width: '26%', height: '85%', opacity: 0.35, transform: 'perspective(1200px) rotateY(12deg)', transition: 'all 1s ease', border: '1px solid rgba(217, 119, 6, 0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.9)', zIndex: 5 }}>
            <img src={leftWingBackdrop} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) contrast(1.1)' }} alt="Left Gallery Wing" onError={(e) => { e.target.src = genericFallbackPlaceholder; }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #050507, transparent 40%, #050507)' }}></div>
          </div>

          <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20, transform: zoomTrigger ? 'scale(1.02)' : 'scale(0.98)', transition: 'transform 5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ width: '230px', height: '290px', borderRadius: '115px 115px 0 0', overflow: 'hidden', border: '1px solid #d97706', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', marginBottom: '32px', position: 'relative' }}>
              <img src={artistPortraitFile} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Raja Ravi Varma Master Portrait" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050507, transparent 35%)' }}></div>
            </div>

            <h1 className="font-serif-museum" style={{ fontSize: '48px', letterSpacing: '8px', textTransform: 'uppercase', color: '#f4f4f6', margin: '0 0 8px 0', textAlign: 'center' }}>Raja Ravi Varma</h1>
            <p className="font-serif-museum" style={{ fontSize: '14px', letterSpacing: '5px', color: '#d97706', margin: '0 0 28px 0', textTransform: 'uppercase' }}>Where Classical Art Meets Computational Insight</p>
            <p style={{ color: '#c8c8cf', fontSize: '16px', maxWidth: '580px', textAlign: 'center', lineHeight: '1.9', fontStyle: 'italic', marginBottom: '44px' }}>
              Experience the legacy of Raja Ravi Varma through a new analytical lens. Explore digitized masterpieces enhanced with visual intelligence, artistic breakdowns, and interactive exhibition narratives inspired by museum archives.

            </p>

            <button onClick={() => setViewMode('rotunda')} className="museum-btn">
              ENTER THE COLLECTION
            </button>
          </div>

          <div style={{ position: 'absolute', right: '1%', width: '26%', height: '85%', opacity: 0.35, transform: 'perspective(1200px) rotateY(-12deg)', transition: 'all 1s ease', border: '1px solid rgba(217, 119, 6, 0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.9)', zIndex: 5 }}>
            <img src={rightWingBackdrop} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) contrast(1.1)' }} alt="Right Gallery Wing" onError={(e) => { e.target.src = genericFallbackPlaceholder; }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, #050507, transparent 40%, #050507)' }}></div>
          </div>

          {/* DYNAMIC RETROSPECTIVE CURATION CREDIT MARKER */}
          <div className="museum-footer">
            Curated Retrospective Architecture by <span>KHUSHI THAKUR</span>
          </div>
        </div>
      )}

      {/* STAGE 2: ROYAL EXHIBITION RETROSPECTIVE */}
      {viewMode === 'rotunda' && (
        <div className="rotunda-viewport">
          <div className="rotunda-viewport-bg" style={{ backgroundImage: `url(${damaskBgFile})` }}></div>
          <div className="rotunda-contents">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '64px', borderBottom: '1px solid #27272a', paddingBottom: '28px' }}>
              <div>
                <h2 className="font-serif-museum" style={{ fontSize: '36px', margin: 0, letterSpacing: '3px', textTransform: 'uppercase', color: '#f4f4f6' }}>THE COLLECTION ARCHIVE</h2>
                <p className="font-mono-subdued" style={{ color: '#d97706', marginTop: '6px' }}>Curated Masterworks • Computational Analysis • Interactive Exhibition</p>
              </div>
              <button onClick={() => setViewMode('hall')} className="nav-btn">
                RETURN TO THE MUESUM
              </button>
            </div>

            <div className="museum-clean-grid">
              {paintings.map((art) => (
                <div key={art._id} onClick={() => handleDynamicCardSelection(art)} className="collection-card">
                  <div className="image-container">
                    <img src={art.image_url} className="card-image" alt={art.metadata?.title} onError={(e) => { e.target.src = genericFallbackPlaceholder; }} />
                  </div>
                  <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 className="font-serif-museum" style={{ margin: '0 0 4px 0', fontSize: '22px', color: '#f4f4f6', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {art.metadata?.title}
                    </h3>
                    <div style={{ color: '#d97706', fontSize: '14px', margin: '0 0 14px 0', opacity: 0.7, fontFamily: 'Cinzel, serif' }}>―</div>
                    <p className="font-body-artsy" style={{ color: '#e2e8f0', fontSize: '16px', lineHeight: '1.8', margin: 0, fontWeight: 300, flexGrow: 1 }}>
                      {art.metadata?.historical_narrative}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: INTERACTIVE SPLIT ANALYSIS VIEW */}
      {viewMode === 'analysis' && selectedArt && (
        <div style={{ width: '100vw', position: 'relative' }}>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '58px', borderBottom: '1px solid #1c1c1f', backgroundColor: '#050507', zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', boxSizing: 'border-box' }}>
            <button onClick={() => { setViewMode('rotunda'); setActiveDimension('intro'); }} className="nav-btn">← RETURN TO THE GALLERY</button>
            <span style={{ fontFamily: 'Cinzel', fontSize: '12px', letterSpacing: '2px', fontWeight: 600, color: '#d97706' }}>{activeDimension.toUpperCase()}</span>
          </div>

          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{
              width: '45%', height: '100vh', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', boxSizing: 'border-box', backgroundColor: '#020204',
              transform: (activeDimension === 'material' || activeDimension === 'historical') ? 'translateX(122%)' : 'translateX(0)', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 50
            }}>
              <div style={{ position: 'relative', border: '1px solid #27272a', padding: '6px', borderRadius: '4px', backgroundColor: '#000' }}>
                <img 
                  ref={imgRef} src={selectedArt.image_url} alt="Target Core Analysis" onLoad={drawVectorOverlays}
                  style={{
                    maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain',
                    filter: 
                      activeDimension === 'grayscale_density' ? 'grayscale(1) contrast(1.3)' : 
                      activeDimension === 'edge_map' ? 'grayscale(1) invert(1) contrast(2)' : 
                      activeDimension === 'vanishing_point' ? 'brightness(0.3) contrast(1.1)' : 
                      activeDimension === 'historical' ? 'sepia(0.2) contrast(1.05)' : 'none'
                  }}
                />
                <canvas ref={canvasRef} style={{ position: 'absolute', top: 6, left: 6, pointerEvents: 'none' }} />
                {(activeDimension === 'edge_map' || activeDimension === 'vanishing_point') && <div className="matrix-scanner" style={{ position: 'absolute', inset: 6, pointerEvents: 'none' }}></div>}
              </div>
            </div>

            <div style={{
              width: '55%', padding: '0 64px', boxSizing: 'border-box',
              transform: (activeDimension === 'material' || activeDimension === 'historical') ? 'translateX(-82%)' : 'translateX(0)', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div id="intro" ref={introRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 className="font-serif-museum" style={{ fontSize: '46px', margin: '0 0 20px 0', color: '#f4f4f6', letterSpacing: '1px' }}>{selectedArt.metadata?.title}</h2>
                <p className="font-body-artsy" style={{ color: '#e2e8f0', fontSize: '19px', lineHeight: '1.9', fontStyle: 'italic' }}>{selectedArt.metadata?.historical_narrative}</p>
                <div style={{ color: '#d97706', fontSize: '12px', fontFamily: 'Cinzel', letterSpacing: '2px', marginTop: '32px' }}>↓ SCROLL DOWN TO INITIALIZE COMPUTATIONAL LAYERS</div>
              </div>

              <div id="grayscale_density" ref={grayRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="font-serif-museum" style={{ fontSize: '28px', color: '#d97706', letterSpacing: '1px', margin: '0 0 20px 0' }}>01  Luminance Spectrum Analysis</h3>
                <p className="font-body-artsy" style={{ color: '#e2e8f0', fontSize: '18px', lineHeight: '1.9', marginBottom: '20px' }}>
                  Isolating pure light values by filtering out color channels uncovers the mathematical tone map running beneath the painting's surface. This reveals how light frames form, structures weight, and shapes local space.
                </p>
                <p className="font-body-artsy" style={{ color: '#b4b4bb', fontSize: '18px', lineHeight: '1.9' }}>
                  Raja Ravi Varma completely altered Indian art history by integrating European <i>chiaroscuro</i>—the intricate interplay of deep light and shadow. Mapping luminance reveals how his focus pulls attention toward focal figures, sculpting folds of fine garments and royal skin tones using values alone.
                </p>
              </div>

              <div id="edge_map" ref={edgeRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="font-serif-museum" style={{ fontSize: '28px', color: '#b49356', letterSpacing: '1px', margin: '0 0 20px 0' }}>02  High-Frequency Structural Contours</h3>
                <p className="font-body-artsy" style={{ color: '#e2e8f0', fontSize: '18px', lineHeight: '1.9', marginBottom: '20px' }}>
                  Running a Canny edge extraction algorithm pinpoints sudden shifts in pixel values. The system tracks these micro-variations across complex matrices, translating them into crisp linear vector contours on screen.
                </p>
                <p className="font-body-artsy" style={{ color: '#b4b4bb', fontSize: '18px', lineHeight: '1.9', marginBottom: '28px' }}>
                  This tracing functions as a window into the underlying drawing skeleton of the composition. It exposes Varma’s deliberate linear layout lines, highlighting exactly how he structured silhouettes, drapery creases, and complex environments before adding color.
                </p>
                <div style={{ fontFamily: 'Cinzel', color: '#d97706', fontSize: '14px', fontWeight: 600, backgroundColor: 'rgba(217,119,6,0.03)', padding: '16px', border: '1px solid rgba(217,119,6,0.12)', borderRadius: '4px', letterSpacing: '1px' }}>
                  Total OpenCV Extracted Structural Contours: {selectedArt.geometry_layer?.total_detected_lines || 0}
                </div>
              </div>

              <div id="vanishing_point" ref={mathRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="font-serif-museum" style={{ fontSize: '28px', color: '#d97706', letterSpacing: '1px', margin: '0 0 20px 0' }}>03  Perspective Geometric Intersection Hub</h3>
                <p className="font-body-artsy" style={{ color: '#e2e8f0', fontSize: '18px', lineHeight: '1.9', marginBottom: '20px' }}>
                  Projecting parallel axes from pillars, backgrounds, and character gazes allows the geometry sub-engine to track where these lines meet, isolating the mathematical focus of the artwork.
                </p>
                <p className="font-body-artsy" style={{ color: '#b4b4bb', fontSize: '18px', lineHeight: '1.9' }}>
                  Traditional Indian fine art previously relied on flat, layered spaces. Varma pioneered the use of realistic depth in local painting. Finding this vanishing point map shows how his linear construction naturally directs the viewer's eye right into the narrative heart of the scene.
                </p>
              </div>

              <div id="material" ref={matRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="font-serif-museum" style={{ fontSize: '28px', color: '#b49356', letterSpacing: '1px', margin: '0 0 20px 0' }}>04  Material Dimension: Chrominance Spatial Entropy</h3>
                <p className="font-body-artsy" style={{ color: '#e2e8f0', fontSize: '18px', lineHeight: '1.9', marginBottom: '20px' }}>
                  Calculating Shannon Entropy across the pixel channels tracks the variation, density, and complexity of information stored within the colors of the painting.
                </p>
                <p className="font-body-artsy" style={{ color: '#b4b4bb', fontSize: '18px', lineHeight: '1.9', marginBottom: '24px' }}>
                  Spikes in entropy correspond directly to intricate lace, ornate jewelry, and deep texture mixing. Conversely, smooth skies or simple backgrounds show lower scores, offering an objective look at where Varma concentrated detail and complex color work.
                </p>
                <div style={{ fontFamily: 'Cinzel', color: '#d97706', fontSize: '14px', fontWeight: 600, backgroundColor: 'rgba(217,119,6,0.03)', padding: '16px', border: '1px solid rgba(217,119,6,0.12)', borderRadius: '4px', letterSpacing: '1px' }}>
                  Live Parsed Complexity Signal: {selectedArt.material_layer?.shannon_entropy_bits || "0.00"} bits
                </div>
              </div>

              <div id="historical" ref={histRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="font-serif-museum" style={{ fontSize: '28px', color: '#d97706', letterSpacing: '1px', margin: '0 0 20px 0' }}>05  Socio-Historic Dimension: Lithographic Registry</h3>
                <p className="font-body-artsy" style={{ color: '#e2e8f0', fontSize: '18px', lineHeight: '1.9', marginBottom: '20px' }}>
                  Cross-referencing the image filename signature with print archives matches the digitized asset with its industrial mass-production history.
                </p>
                <p className="font-body-artsy" style={{ color: '#b4b4bb', fontSize: '18px', lineHeight: '1.9' }}>
                  By opening the Malavli and Ghatkopar workshops, Varma decoupled oil painting from elite collections. This print log traces how his masterpieces traveled beyond grand palaces into thousands of everyday homes across the country.
                </p>
                <div style={{ marginTop: '24px', fontSize: '16px', fontStyle: 'italic', color: '#b49356' }}>
                  Registered Press Core Material: <span style={{ color: '#fff' }}>{selectedArt.historical_layer?.press_origin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}