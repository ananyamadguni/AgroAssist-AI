\# AgroAssist AI — Smart Farming Intelligence Platform



An end-to-end AI-powered precision agriculture assistant designed to empower farmers with real-time leaf disease diagnosis, regression-based yield forecasting, dynamic irrigation recommendations, live market prices, and conversational AI advisory.



\---



\## Key Features



\* \*\*Crop Disease Doctor (Computer Vision):\*\* Real-time leaf pathology classification using PyTorch MobileNetV2 with immediate symptoms, prevention, and treatment advice.

\* \*\*Yield Prediction Engine (ML):\*\* Parametric regression estimating crop harvest tonnage based on crop type and acreage.

\* \*\*AgroAssist Conversational AI:\*\* Multi-turn agricultural advisor powered by Google Gemini (`gemini-2.5-flash`) with browser voice recognition input.

\* \*\*Smart Irrigation Advisory:\*\* Rule-based decision engine calculating optimal water volume and schedules.

\* \*\*Market Mandi Prices:\*\* Live commodity pricing across regional agricultural markets.

\* \*\*Government Welfare Schemes:\*\* Directory of farmer support programs (PM-KISAN, PMFBY).



\---



\## Technology Stack



| Component | Technology | Description |

| :--- | :--- | :--- |

| \*\*Frontend\*\* | React (Vite), Modern Glassmorphism CSS | Responsive single-page dashboard with smooth scrolling and voice API |

| \*\*Backend\*\* | FastAPI, Uvicorn | High-performance asynchronous REST API |

| \*\*Vision Model\*\* | PyTorch, Torchvision (MobileNetV2), Pillow | Leaf image feature extraction and disease classification |

| \*\*Generative AI\*\* | Google GenAI SDK (`gemini-2.5-flash`) | Context-aware agricultural question answering |

| \*\*Environment\*\* | Python 3.14 (64-bit), Node.js | Cross-platform development runtime |



\---



\## Project Architecture



```text

AgroAssist-AI/

│

├── frontend/                     # React Frontend

│   ├── src/

│   │   ├── App.jsx               # Main Dashboard UI and Visual Modules

│   │   ├── background.jpeg       # Asset Image

│   │   └── main.jsx

│   ├── package.json

│   └── vite.config.js

│

├── backend/                      # FastAPI and AI/ML Backend

│   ├── main.py                   # PyTorch inference, Gemini routing, ML logic

│   └── requirements.txt          # Python dependencies

│

└── README.md

