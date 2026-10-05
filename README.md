
AGROASSIST AI -
Smart Farming Intelligence Platform
================================================================================

AgroAssist AI is an end-to-end precision agriculture assistant designed to empower farmers with real-time leaf disease diagnosis, regression-based yield forecasting, dynamic irrigation recommendations, live market prices, and conversational AI advisory.

Our mission is to simplify modern farming decisions using Artificial Intelligence and improve agricultural productivity and crop health.

--------------------------------------------------------------------------------
PROBLEM STATEMENT
--------------------------------------------------------------------------------

Farmers face significant challenges in detecting crop infections early, predicting seasonal harvest yields, and calculating accurate irrigation needs.

This process is:
• Dependent on scarce manual agronomy expertise
• Prone to delayed diagnosis, causing widespread crop loss
• Inefficient with water and chemical usage
• Financially volatile due to lack of real-time market insights

--------------------------------------------------------------------------------
SOLUTION
--------------------------------------------------------------------------------

AgroAssist AI provides an intelligent, unified digital platform where farmers can upload crop leaf images, query field conditions, and receive instant, actionable guidance.

The platform helps farmers by:
• Analyzing crop leaf images via computer vision
• Detecting leaf diseases and plant pathogens instantly
• Explaining diagnosis, prevention, and treatment in clear terms
• Forecasting expected harvest tonnage based on acreage
• Calculating precise daily irrigation schedules
• Tracking live APMC mandi commodity prices
• Providing hands-free conversational voice assistance

--------------------------------------------------------------------------------
FEATURES
--------------------------------------------------------------------------------

• Real-Time Leaf Disease Diagnosis
• Yield Prediction Engine
• Smart Irrigation Advisory
• AgroAssist Voice and Conversational Assistant
• Live Mandi Commodity Prices
• Government Welfare Schemes Directory (PM-KISAN, PMFBY)
• Interactive Farm Telemetry Dashboard
• Diagnosis History and Treatment Tracking

--------------------------------------------------------------------------------
TECH STACK
--------------------------------------------------------------------------------

Frontend:
• React (Vite)
• Modern Glassmorphism CSS / Tailwind CSS
• Web Speech API (Voice Recognition)

Backend:
• FastAPI
• Uvicorn

Machine Learning & AI:
• PyTorch & Torchvision (MobileNetV2)
• Pillow (PIL)
• Google GenAI SDK (gemini-2.5-flash)

Runtime & Environment:
• Python 3.14 (64-bit)
• Node.js

--------------------------------------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------------------------------------

```plaintext
AgroAssist-AI/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── background.jpeg
│   │   ├── components/
│   │   │   ├── DiseaseDoctor.jsx
│   │   │   ├── YieldPredictor.jsx
│   │   │   ├── IrrigationAdvisory.jsx
│   │   │   ├── MandiTracker.jsx
│   │   │   ├── VoiceAssistant.jsx
│   │   │   └── WelfareSchemes.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   │   ├── mobilenet_v2_leaf.pth
│   │   └── yield_regressor.pkl
│   ├── services/
│   │   ├── vision_service.py
│   │   ├── gemini_service.py
│   │   ├── irrigation_engine.py
│   │   └── mandi_service.py
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```
--------------------------------------------------------------------------------
WORKFLOW
--------------------------------------------------------------------------------
```
Farmer / User
     │
     ▼
Upload Leaf Photo / Enter Farm Query
     │
     ▼
React Frontend
     │
     ▼
FastAPI Backend
     │
     ▼
AI & ML Processing (PyTorch / Gemini)
     │
     ▼
Disease Diagnosis & Advisory Generation
     │
     ▼
Actionable Recommendations on Dashboard
```
--------------------------------------------------------------------------------
PROJECT GOALS
--------------------------------------------------------------------------------

• Minimize crop yield loss through early pathogen detection
• Optimize freshwater irrigation volume and scheduling
• Bridge the gap between agronomists and rural farmers
• Deliver hands-free conversational support for field conditions
• Build an accessible, scalable smart agriculture web platform
--------------------------------------------------------------------------------
PROJECT STATUS
--------------------------------------------------------------------------------

Current Phase: Minimum Viable Product (MVP)  
The platform is actively integrating mobile vision inference alongside real-time mandi price streaming and generative AI advisory.

--------------------------------------------------------------------------------
FUTURE SCOPE
--------------------------------------------------------------------------------

• Edge deployment on mobile devices (Android / TFLite / ONNX)
• Direct IoT soil sensor and weather station telemetry integration
• Multi-language regional audio advisory (Kannada, Hindi, Telugu, Tamil)
• Drone imagery aerial analysis for large-scale acreage
• Automated fertilizer dosage calculator

--------------------------------------------------------------------------------
VISION
--------------------------------------------------------------------------------

Smarter Fields. Healthier Harvests.

AgroAssist AI is built to transform every smartphone into an on-demand agronomist. By unifying low-latency computer vision, localized weather awareness, and conversational intelligence, the project strives to:

• Democratize Agronomic Expertise: Put expert-grade diagnostic accuracy directly into the hands of smallholder farmers without cost barriers.
• Drive Climate-Resilient Practices: Reduce freshwater wastage and excessive chemical usage through data-driven precision delivery.
• Empower Economic Independence: Enable informed marketplace decisions and timely harvests to maximize farm profitability across every season.

--------------------------------------------------------------------------------
LICENSE
--------------------------------------------------------------------------------

This repository is currently private.  
Copyright © 2026 AgroAssist AI. All rights reserved.
