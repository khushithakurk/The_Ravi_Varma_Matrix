# The Ravi Varma Matrix: Where Classical Fine Art Meets Computational Insight
"The Ravi Varma Matrix," sits at the intersection of Digital Humanities, Computer Vision, and Cultural Data Science. The objective is to use code to reverse-engineer the creative genius of Raja Ravi Varma, computationally proving how he unified European academic realism with Indian classical ethos.
An advanced, full-stack monorepo web platform engineered to bridge 19th-century fine art with modern computer vision analysis. Built specifically to archive and break down the legendary masterworks of Raja Ravi Varma, this application utilizes real-time image processing primitives to extract architectural lines, vanishing points, compositional geometry, and color distribution entropy layouts.

## System Architecture

The platform is designed around a decoupled, full-stack multi-tier monorepo architecture engineered for high-performance data rendering and system resilience:

* **Frontend :** A single-page application built on React, Vite, and custom CSS layout design systems, streaming responsive media layers via viewport-reactive nodes.
* **Backend :** A persistent Express (Node.js) orchestrator pipeline driving native Python asynchronous worker subprocesses via `child_process` decoupling blocks.
* **Computer Vision Layer:** Native OpenCV script engines computing runtime pixel matrices, high-frequency structural edge boundaries (Canny edge extraction), and color distribution complexity metrics.
* **Database Vector Layer (MongoDB Atlas Cluster):** A cloud NoSQL cluster mapping unstructured metadata payloads, historical narrative blobs, and computed computer vision geometries permanently onto cloud indexes.

---

## 🛠️ Technology Suite & Tooling

### Frontend
* **Core Engine:** React 18 / Vite (Lightning-fast HMR & static asset optimization)
* **Styling:** Modular CSS3 with custom CSS Custom Properties for uniform thematic museum design tokens
* **HTTP Client:** Fetch API with runtime origin verification switches

### Backend
* **Server Core:** Node.js / Express
* **Database Client:** Mongoose (Cloud Cluster Schema modeling and persistent storage abstraction)
* **Subprocess Orchestration:** Node `child_process.spawn` pipeline with asynchronous state streams and defensive timeout monitors
* **Cross-Origin Policy:** Custom CORS configuration handling origin parameters across local testing lines and the live Vercel production domain

### Analytics Engine (Python Core)
* **Python Engine:** Runtime Python 3 environment
* **Computer Vision:** `opencv-python-headless` (Server-optimized matrix compilation)
* **Mathematical Modeling:** `numpy` (Multi-dimensional numerical vector optimization)

---

## 🚀 Key Engineering Features implemented

* **Asynchronous Subprocess Decoupling:** Instead of overloading the single-threaded Node.js server loop during complex image matrix calculations, heavy computational vision scripts are offloaded to independent Python worker threads.
* **Defensive Architecture Timeouts:** Image processing tasks are bound to strict execution promises. If a thread stalls or takes too long, a fail-safe execution hook safely resolves the task, records fallback values, and keeps the core server running smoothly.
* **Cross-Platform Dependency Insulation:** Utilizes headless OpenCV bin wrappers (`opencv-python-headless`) to seamlessly execute computer vision scripts on cloud Linux hosts without needing desktop display drivers.
* **Dynamic Network Origin Switching:** The application dynamically inspects `window.location.hostname` to seamlessly route database queries to `localhost:5001` during local development or your production server on the web.

---

## 📦 Directory Structure

```text
├── frontend/                     # React User Interface Layer
│   ├── src/
│   │   ├── App.jsx               # UI Core layout, Routing logic, Component trees
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Express Engine & Core Analytics Pipelines
│   ├── analytics_engine/         # Core Computer Vision Engines
│   │   ├── geometry_engine.py    # Canny Edge Tracing, Line Detection, Geometries
│   │   └── color_engine.py       # Shannon Entropy Calculation Matrices
│   ├── images/                   # Local Image Asset Source Clusters
│   ├── server.js                 # Database routing configuration & Express setup
│   ├── requirements.txt          # Server-level Python dependencies
│   └── package.json
│
└── vercel.json                   # Root configuration rules for multi-service mapping
