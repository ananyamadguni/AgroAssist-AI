import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  Volume2, FileDown, CloudSun, DollarSign, Sprout, ShieldAlert, 
  Cpu, Landmark, Calculator, ThermometerSnowflake, ShieldCheck, 
  Layers, BellRing, Send, Navigation, MapPin, Droplets, Wind,
  Sparkles, CheckCircle2, AlertTriangle, RefreshCw, TrendingUp,
  Calendar, ArrowUpRight, ArrowDownRight, Clock, Zap
} from 'lucide-react';

const BACKEND_URL = "http://127.0.0.1:8000";

export default function App() {
  const [activeTab, setActiveTab] = useState('mandi');

  // Intro Splash Animation State
  const [introStage, setIntroStage] = useState('centered'); // 'centered' -> 'moving' -> 'settled'

  // Mandi & 30-Day Monthly Trend State
  const [marketLocation, setMarketLocation] = useState('Bangalore');
  const [dayOffset, setDayOffset] = useState(0);
  const [marketData, setMarketData] = useState([]);
  const [marketSource, setMarketSource] = useState('');
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState('Tomato');
  const [historyDays, setHistoryDays] = useState(30);
  const [priceHistory, setPriceHistory] = useState([]);
  const [historySummary, setHistorySummary] = useState(null);
  const [viewMode, setViewMode] = useState('daily');
  const [calcYield, setCalcYield] = useState(15);
  const [calcCost, setCalcCost] = useState(12000);

  // Disease Doctor State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [loadingDisease, setLoadingDisease] = useState(false);

  // Soil Card State
  const [farmerName, setFarmerName] = useState('Ananya M');
  const [cropInputs, setCropInputs] = useState({ N: 90, P: 42, K: 43, temperature: 24.5, humidity: 82.0, ph: 6.5, rainfall: 202.0, soil_type: 'Loamy', moisture: 45 });
  const [cropRecResult, setCropRecResult] = useState({ recommended_crop: "Rice", confidence: 91.0 });

  // Top-Right Weather State (Default Bengaluru)
  const [selectedDistrict, setSelectedDistrict] = useState('Bangalore Urban');
  const [weatherData, setWeatherData] = useState(null);
  const [locating, setLocating] = useState(false);

  // IoT Telemetry State
  const [telemetry, setTelemetry] = useState({ temperature: 27.2, humidity: 78, soil_moisture: 42, pump_status: 'AUTO-OFF', last_updated: 'Loading...' });

  // Schemes & Inputs State
  const [schemes, setSchemes] = useState([]);
  const [schemeCategory, setSchemeCategory] = useState('all');
  const [calcCrop, setCalcCrop] = useState('Tomato');
  const [calcAcres, setCalcAcres] = useState(2.0);
  const [calcResult, setCalcResult] = useState(null);

  // Shelf-Life State
  const [shelfCommodity, setShelfCommodity] = useState('Tomato');
  const [shelfStorage, setShelfStorage] = useState('Ambient Room');
  const [shelfTemp, setShelfTemp] = useState(28);
  const [shelfResult, setShelfResult] = useState(null);

  // PMFBY Insurance State
  const [insCrop, setInsCrop] = useState('Tomato');
  const [insAcres, setInsAcres] = useState(3.0);
  const [insSeason, setInsSeason] = useState('Commercial / Horticultural');
  const [insResult, setInsResult] = useState(null);

  // Crop Rotation State
  const [selectedMainCrop, setSelectedMainCrop] = useState('Tomato');
  const [rotationData, setRotationData] = useState(null);

  // Alert Dispatcher State
  const [alertForm, setAlertForm] = useState({ phone: "+91 98450 12345", type: "disease", msg: "High risk of Leaf Blight detected in Bangalore Urban. Apply protective spray." });
  const [alertStatus, setAlertStatus] = useState(null);

  // Intro Splash Sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIntroStage('moving');
    }, 1400);

    const timer2 = setTimeout(() => {
      setIntroStage('settled');
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchMarketPrices = async (loc, offset = 0) => {
    setLoadingMarket(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/market-prices?location=${encodeURIComponent(loc)}&day_offset=${offset}`);
      setMarketData(res.data.data || []);
      setMarketSource(res.data.source || '');
    } catch (err) {
      console.warn("Market fetch error:", err);
    } finally {
      setLoadingMarket(false);
    }
  };

  const fetchMonthlyHistory = async (cmd, days = 30) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/market-history?commodity=${encodeURIComponent(cmd)}&days=${days}`);
      setPriceHistory(res.data.history || []);
      setHistorySummary(res.data.summary || null);
    } catch (err) {
      console.warn("History fetch error:", err);
    }
  };

  const fetchWeather = async (dst = 'Bangalore Urban', lat = null, lon = null) => {
    try {
      let endpoint = `${BACKEND_URL}/weather-advisory?district=${encodeURIComponent(dst)}`;
      if (lat !== null && lon !== null) {
        endpoint += `&lat=${lat}&lon=${lon}`;
      }
      const res = await axios.get(endpoint);
      setWeatherData(res.data);
    } catch (err) {
      console.warn("Weather fetch error:", err);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      fetchWeather('Bangalore Urban');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let detectedCity = 'Bangalore Urban';
        if (latitude >= 12.7 && latitude <= 13.3 && longitude >= 77.3 && longitude <= 77.8) {
          detectedCity = 'Bengaluru (Bangalore)';
        }
        fetchWeather(detectedCity, latitude, longitude);
        setLocating(false);
      },
      (err) => {
        console.warn("Location permission not granted, defaulting to Bangalore Urban:", err.message);
        fetchWeather('Bangalore Urban');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const fetchIoT = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/iot-telemetry`);
      setTelemetry(res.data);
    } catch (err) {
      console.warn("IoT error:", err);
    }
  };

  const togglePump = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/iot-pump-toggle`);
      setTelemetry((prev) => ({ ...prev, pump_status: res.data.pump_status }));
    } catch (err) {
      alert("Failed to communicate with pump relay.");
    }
  };

  const fetchSchemes = async (cat) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/government-schemes?category=${encodeURIComponent(cat)}`);
      setSchemes(res.data.schemes || []);
    } catch (err) {
      console.warn("Schemes error:", err);
    }
  };

  const fetchRotation = async (crop) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/crop-rotation-advisory`, { crop });
      setRotationData(res.data.advisory);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleComputeInputs = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/calculate-farm-inputs`, { crop: calcCrop, acres: calcAcres });
      setCalcResult(res.data);
    } catch (err) {
      alert("Error computing input requirements.");
    }
  };

  const handleComputeShelfLife = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/calculate-shelf-life`, {
        commodity: shelfCommodity,
        storage_type: shelfStorage,
        ambient_temp: shelfTemp
      });
      setShelfResult(res.data);
    } catch (err) {
      alert("Error computing shelf life.");
    }
  };

  const handleComputeInsurance = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/calculate-insurance`, {
        crop: insCrop,
        acres: insAcres,
        season: insSeason
      });
      setInsResult(res.data);
    } catch (err) {
      alert("Error computing insurance coverage.");
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/dispatch-alert`, {
        phone_or_chat_id: alertForm.phone,
        alert_type: alertForm.type,
        message: alertForm.msg
      });
      setAlertStatus(res.data);
    } catch (err) {
      alert("Failed to dispatch alert.");
    }
  };

  useEffect(() => {
    handleDetectLocation();
  }, []);

  useEffect(() => {
    fetchMarketPrices(marketLocation, dayOffset);
  }, [marketLocation, dayOffset]);

  useEffect(() => {
    fetchMonthlyHistory(selectedCommodity, historyDays);
  }, [selectedCommodity, historyDays]);

  useEffect(() => {
    fetchSchemes(schemeCategory);
  }, [schemeCategory]);

  useEffect(() => {
    fetchRotation(selectedMainCrop);
  }, [selectedMainCrop]);

  useEffect(() => {
    const interval = setInterval(fetchIoT, 4000);
    return () => clearInterval(interval);
  }, []);

  const downloadSoilPDF = async () => {
    try {
      const payload = {
        farmer_name: farmerName,
        location: marketLocation,
        soil_type: cropInputs.soil_type,
        N: cropInputs.N,
        P: cropInputs.P,
        K: cropInputs.K,
        ph: cropInputs.ph,
        moisture: cropInputs.moisture,
        recommended_crop: cropRecResult?.recommended_crop || "Rice",
        recommended_fertilizer: "Urea + DAP (Split Dose)"
      };
      const res = await axios.post(`${BACKEND_URL}/generate-soil-card`, payload, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Soil_Health_Card_${farmerName}.pdf`;
      link.click();
    } catch (err) {
      alert("Error generating PDF.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiseaseResult(null);
    }
  };

  const handleDiagnose = async () => {
    if (!selectedFile) return;
    setLoadingDisease(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await axios.post(`${BACKEND_URL}/predict-disease`, formData);
      setDiseaseResult(res.data);
    } catch (err) {
      alert("Diagnosis error.");
    } finally {
      setLoadingDisease(false);
    }
  };

  const handleCropRec = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/predict-crop`, cropInputs);
      setCropRecResult(res.data);
    } catch (err) {
      alert("Recommendation error.");
    }
  };

  // Glassmorphic Styling Variables
  const appContainerStyle = {
    minHeight: '100vh',
    position: 'relative',
    backgroundImage: `linear-gradient(rgba(6, 11, 8, 0.88), rgba(4, 8, 6, 0.94)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    color: '#f3f4f6',
    zIndex: 1
  };

  const glassCard = {
    background: 'rgba(15, 23, 20, 0.78)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(74, 222, 128, 0.22)',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    borderRadius: '22px',
    padding: '32px',
    color: '#e5e7eb',
    position: 'relative'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: '1px solid rgba(74, 222, 128, 0.4)',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
    borderRadius: '12px',
    padding: '12px 22px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  };

  const inputStyle = {
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    border: '1px solid rgba(74, 222, 128, 0.3)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#f9fafb',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  };

  const navTabs = [
    { id: 'mandi', label: 'Mandi Rates & Whole Month', icon: DollarSign },
    { id: 'rotation', label: 'Intercropping & Rotation', icon: Layers },
    { id: 'alerts', label: 'Alert Dispatch Hub', icon: BellRing },
    { id: 'shelflife', label: 'Shelf-Life & Storage', icon: ThermometerSnowflake },
    { id: 'insurance', label: 'PMFBY Crop Insurance', icon: ShieldCheck },
    { id: 'schemes', label: 'Govt Schemes', icon: Landmark },
    { id: 'inputs', label: 'Input & Spray Calc', icon: Calculator },
    { id: 'doctor', label: 'Disease Doctor', icon: ShieldAlert },
    { id: 'soil', label: 'Soil Health & PDF', icon: Sprout },
    { id: 'weather', label: 'Weather Advisory', icon: CloudSun },
    { id: 'iot', label: 'IoT Telemetry Hub', icon: Cpu }
  ];

  return (
    <div style={appContainerStyle}>
      {/* Dynamic Aurora Ambient Blobs */}
      <div className="aurora-blob-1" />
      <div className="aurora-blob-2" />

      {/* 1. Centered Splash Screen Overlay */}
      {introStage !== 'settled' && (
        <div 
          className="intro-splash-screen"
          style={{
            opacity: introStage === 'centered' ? 1 : 0,
            pointerEvents: introStage === 'centered' ? 'all' : 'none'
          }}
        >
          <div className="intro-brand-center">
            <div className="brand-logo-intro">
              <Sprout size={48} color="#ffffff" />
            </div>
            <div>
              <div className="brand-text-intro">AgroAssist AI</div>
              <p style={{ margin: '6px 0 0 0', fontSize: '18px', color: '#9ca3af', textAlign: 'center', fontWeight: '500' }}>
                Precision Agriculture & Mandi Intelligence
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Top Header */}
      <header style={{ 
        padding: '20px 42px', 
        borderBottom: '1px solid rgba(74, 222, 128, 0.16)', 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '18px', 
        position: 'relative', 
        zIndex: 10,
        opacity: introStage === 'centered' ? 0.2 : 1,
        transition: 'opacity 0.8s ease'
      }}>
        <div 
          className="header-brand-settled"
          style={{
            transform: introStage === 'centered' ? 'scale(1.2) translateX(40px)' : 'scale(1) translateX(0)',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
            padding: '12px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)' 
          }}>
            <Sprout size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '26px', color: '#4ade80', fontWeight: '900', letterSpacing: '-0.4px', textShadow: '0 0 20px rgba(74, 222, 128, 0.3)' }}>
                AgroAssist AI
              </h1>
              <span className="live-pulse-dot" title="Real-time synchronized" />
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>Precision Agriculture & Edge Mandi Intelligence</p>
          </div>
        </div>

        {/* TOP-RIGHT CORNER WEATHER BADGE WITH GLOW EFFECT */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(23, 33, 28, 0.95) 100%)',
          padding: '10px 22px',
          borderRadius: '18px',
          border: '1px solid rgba(74, 222, 128, 0.45)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(74, 222, 128, 0.15)',
          opacity: introStage === 'settled' ? 1 : 0,
          transform: introStage === 'settled' ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.6s ease'
        }}>
          <div style={{ background: 'rgba(251, 191, 36, 0.18)', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CloudSun size={28} color="#fbbf24" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="#4ade80" />
              <span style={{ fontSize: '14px', color: '#38bdf8', fontWeight: '800' }}>
                {weatherData?.location || "Bengaluru (Bangalore)"}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '3px' }}>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#f3f4f6' }}>
                {weatherData?.temperature || "26.0°C"}
              </span>
              <span style={{ fontSize: '14px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Droplets size={14} color="#60a5fa" /> {weatherData?.humidity || "68%"}
              </span>
            </div>
          </div>
          <button
            onClick={handleDetectLocation}
            title="Refresh GPS Weather"
            className="btn-interactive"
            style={{
              backgroundColor: 'rgba(74, 222, 128, 0.18)',
              border: '1px solid rgba(74, 222, 128, 0.5)',
              color: '#4ade80',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Navigation size={14} /> {locating ? '...' : 'GPS'}
          </button>
        </div>
      </header>

      {/* Navigation Bar with Glass Pills */}
      <nav style={{ display: 'flex', gap: '10px', padding: '14px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', overflowX: 'auto', position: 'relative', zIndex: 10 }}>
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn-interactive"
              style={{
                padding: '11px 18px',
                borderRadius: '12px',
                border: isActive ? '1px solid rgba(74, 222, 128, 0.6)' : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '15px',
                background: isActive ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)' : 'rgba(17, 24, 39, 0.65)',
                color: isActive ? '#ffffff' : '#9ca3af',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '9px',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 8px 20px rgba(16, 185, 129, 0.35)' : 'none'
              }}
            >
              <Icon size={18} color={isActive ? '#ffffff' : '#4ade80'} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '1240px', margin: '34px auto', padding: '0 26px', position: 'relative', zIndex: 5 }}>

        {/* TAB 1: MANDI RATES WITH TODAY, YESTERDAY, AND WHOLE MONTH TIMELINE */}
        {activeTab === 'mandi' && (
          <div className="tab-pane-animated" style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            
            {/* Control Strip */}
            <div style={glassCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: 'rgba(74, 222, 128, 0.15)', padding: '14px', borderRadius: '16px' }}>
                    <DollarSign size={26} color="#4ade80" />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Karnataka APMC Mandi Auction</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>{marketSource}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(74,222,128,0.25)' }}>
                    <button 
                      onClick={() => { setDayOffset(0); setViewMode('daily'); }} 
                      className="btn-interactive"
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: (dayOffset === 0 && viewMode === 'daily') ? '#10b981' : 'transparent', color: (dayOffset === 0 && viewMode === 'daily') ? '#fff' : '#9ca3af', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                      Today
                    </button>
                    <button 
                      onClick={() => { setDayOffset(1); setViewMode('daily'); }} 
                      className="btn-interactive"
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: (dayOffset === 1 && viewMode === 'daily') ? '#eab308' : 'transparent', color: (dayOffset === 1 && viewMode === 'daily') ? '#000' : '#9ca3af', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                      Yesterday
                    </button>
                    <button 
                      onClick={() => setViewMode(viewMode === 'monthly_table' ? 'daily' : 'monthly_table')} 
                      className="btn-interactive"
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: viewMode === 'monthly_table' ? '#38bdf8' : 'transparent', color: viewMode === 'monthly_table' ? '#000' : '#9ca3af', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={15} /> Whole Month (30 Days)
                    </button>
                  </div>

                  <select 
                    value={marketLocation} 
                    onChange={(e) => setMarketLocation(e.target.value)} 
                    style={{ ...inputStyle, width: 'auto', color: '#4ade80', fontWeight: 'bold', fontSize: '15px' }}>
                    <option value="all">All Karnataka</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hubli">Hubli (Amaragol)</option>
                    <option value="Yellapur">Yellapur</option>
                    <option value="Sirsi">Sirsi</option>
                    <option value="Belgaum">Belgaum</option>
                    <option value="Shimoga">Shimoga</option>
                  </select>
                </div>
              </div>

              {/* Day Slider */}
              <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', padding: '16px 22px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '22px' }}>
                <Clock size={20} color="#38bdf8" />
                <span style={{ fontSize: '15px', color: '#cbd5e1', fontWeight: '600', minWidth: '200px' }}>
                  Viewing: <strong style={{ color: '#4ade80' }}>{dayOffset === 0 ? "Today" : (dayOffset === 1 ? "Yesterday" : `${dayOffset} Days Ago`)}</strong>
                </span>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={dayOffset} 
                  onChange={(e) => { setDayOffset(+e.target.value); setViewMode('daily'); }}
                  style={{ flex: 1, accentColor: '#10b981', cursor: 'pointer', height: '6px' }}
                />
                <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '600' }}>30 Days Timeline</span>
              </div>

              {/* MODE 1: Cards */}
              {viewMode === 'daily' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
                  {marketData.map((item, idx) => (
                    <div key={idx} className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.85)', padding: '22px', borderRadius: '16px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#60a5fa', fontWeight: 'bold' }}>{item.market}</span>
                        <span style={{ 
                          fontSize: '12px', 
                          color: item.day_offset === 0 ? '#4ade80' : (item.day_offset === 1 ? '#facc15' : '#38bdf8'), 
                          backgroundColor: 'rgba(0,0,0,0.4)', 
                          padding: '3px 9px', 
                          borderRadius: '8px', 
                          fontWeight: '600' 
                        }}>
                          {item.day_label} ({item.updated_date})
                        </span>
                      </div>
                      <h3 style={{ margin: '12px 0 4px 0', fontSize: '21px', fontWeight: '800' }}>{item.commodity}</h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>{item.variety}</p>
                      <p style={{ fontSize: '28px', color: item.day_offset === 0 ? '#4ade80' : (item.day_offset === 1 ? '#facc15' : '#38bdf8'), fontWeight: '900', margin: '10px 0 0 0' }}>
                        ₹{item.price_per_kg} <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}>/ kg</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* MODE 2: Whole Month Table */}
              {viewMode === 'monthly_table' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '19px' }}>
                      Whole Month Daily Records: <span style={{ color: '#4ade80' }}>{selectedCommodity}</span>
                    </h3>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>Click any day to jump to full card view</span>
                  </div>
                  <div style={{ maxHeight: '420px', overflowY: 'auto', borderRadius: '14px', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
                      <thead style={{ backgroundColor: '#111827', position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr style={{ color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <th style={{ padding: '14px 18px' }}>Timeline</th>
                          <th style={{ padding: '14px 18px' }}>Date</th>
                          <th style={{ padding: '14px 18px' }}>Price per kg</th>
                          <th style={{ padding: '14px 18px' }}>Modal Price (Quintal)</th>
                          <th style={{ padding: '14px 18px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceHistory.map((row, i) => (
                          <tr 
                            key={i} 
                            onClick={() => { setDayOffset(row.day_offset); setViewMode('daily'); }}
                            style={{ 
                              backgroundColor: row.day_offset === dayOffset ? 'rgba(16, 185, 129, 0.2)' : (i % 2 === 0 ? 'rgba(23, 33, 28, 0.75)' : 'rgba(17, 24, 39, 0.75)'),
                              cursor: 'pointer',
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                              transition: 'background-color 0.15s ease'
                            }}>
                            <td style={{ padding: '14px 18px', fontWeight: 'bold', color: row.day_offset === 0 ? '#4ade80' : (row.day_offset === 1 ? '#facc15' : '#38bdf8') }}>
                              {row.day_label}
                            </td>
                            <td style={{ padding: '14px 18px' }}>{row.full_date}</td>
                            <td style={{ padding: '14px 18px', fontWeight: '800', color: '#f3f4f6' }}>₹{row.price_per_kg}</td>
                            <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>₹{row.modal_price_quintal.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '14px 18px' }}>
                              <button className="btn-interactive" style={{ backgroundColor: 'rgba(74, 222, 128, 0.18)', border: '1px solid #10b981', color: '#4ade80', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                                View Day
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Whole Month Recharts Area Curve */}
            <div style={glassCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '12px', borderRadius: '14px' }}>
                    <TrendingUp size={24} color="#38bdf8" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '21px', fontWeight: '800' }}>
                      Whole Month (30-Day) Market Curve
                    </h3>
                    <p style={{ margin: '3px 0 0 0', fontSize: '14px', color: '#9ca3af' }}>
                      Continuous daily modal rates for {selectedCommodity}
                    </p>
                  </div>
                </div>

                <select 
                  value={selectedCommodity} 
                  onChange={(e) => setSelectedCommodity(e.target.value)} 
                  style={{ ...inputStyle, width: 'auto', fontSize: '15px', color: '#4ade80', fontWeight: 'bold' }}>
                  <option value="Tomato">Tomato</option>
                  <option value="Arecanut">Arecanut</option>
                  <option value="Chilli Red">Byadagi Chilli</option>
                  <option value="Black Pepper">Black Pepper</option>
                  <option value="Paddy (Dhan)">Paddy</option>
                  <option value="Onion">Onion</option>
                  <option value="Potato">Potato</option>
                </select>
              </div>

              {historySummary && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.9)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>30-Day Average</span>
                    <h3 style={{ margin: '6px 0 0 0', color: '#38bdf8', fontSize: '24px', fontWeight: '800' }}>₹{historySummary.avg_price_per_kg} / kg</h3>
                  </div>
                  <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.9)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>Monthly Lowest</span>
                    <h3 style={{ margin: '6px 0 0 0', color: '#f87171', fontSize: '24px', fontWeight: '800' }}>₹{historySummary.min_price_per_kg} / kg</h3>
                  </div>
                  <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.9)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>Monthly Peak</span>
                    <h3 style={{ margin: '6px 0 0 0', color: '#4ade80', fontSize: '24px', fontWeight: '800' }}>₹{historySummary.max_price_per_kg} / kg</h3>
                  </div>
                  <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.9)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>Net Monthly Momentum</span>
                    <h3 style={{ margin: '6px 0 0 0', color: historySummary.net_monthly_change_pct >= 0 ? '#4ade80' : '#f87171', fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {historySummary.net_monthly_change_pct >= 0 ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                      {historySummary.net_monthly_change_pct}%
                    </h3>
                  </div>
                </div>
              )}

              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <AreaChart data={priceHistory}>
                    <defs>
                      <linearGradient id="mandiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.65}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={13} interval={3} />
                    <YAxis stroke="#9ca3af" fontSize={13} domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#4ade80', fontSize: '14px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} 
                      formatter={(val) => [`₹${val} / kg`, 'Rate']}
                    />
                    <Area type="monotone" dataKey="price_per_kg" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#mandiGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Farm Profit Calculator */}
            <div style={glassCard}>
              <h3 style={{ margin: '0 0 18px 0', color: '#fbbf24', fontSize: '20px', fontWeight: '800' }}>Projected Farm Net Profit Margin</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Harvest Yield (Quintals):</label>
                  <input type="number" value={calcYield} onChange={(e) => setCalcYield(+e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Input Costs (Seed, Fert, Labor) (₹):</label>
                  <input type="number" value={calcCost} onChange={(e) => setCalcCost(+e.target.value)} style={inputStyle} />
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.35)', padding: '18px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>Projected Net Earnings:</p>
                  <h2 style={{ margin: '4px 0 0 0', color: '#4ade80', fontSize: '30px', fontWeight: '900' }}>
                    ₹{((calcYield * (priceHistory[priceHistory.length - 1]?.price_per_kg || 480) * 100) - calcCost).toLocaleString('en-IN')}
                  </h2>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CROP ROTATION & INTERCROPPING */}
        {activeTab === 'rotation' && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '14px', borderRadius: '16px' }}>
                  <Layers size={26} color="#38bdf8" />
                </div>
                <div>
                  <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Companion Crops & Rotation Strategy</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>Maximize multi-tier land yield and suppress soil-borne pathogens.</p>
                </div>
              </div>
              <select value={selectedMainCrop} onChange={(e) => setSelectedMainCrop(e.target.value)} style={{ ...inputStyle, width: 'auto', color: '#4ade80', fontWeight: 'bold', fontSize: '16px' }}>
                <option value="Tomato">Tomato</option>
                <option value="Arecanut">Arecanut</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            {rotationData && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
                <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <Sparkles size={20} color="#38bdf8" />
                    <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '18px' }}>Synergistic Companion Crops</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                    {rotationData.compatible_intercrops.map((crop, i) => (
                      <span key={i} style={{ backgroundColor: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', padding: '6px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                        + {crop}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: '15px', color: '#e2e8f0', lineHeight: '1.6' }}>{rotationData.soil_benefit}</p>
                </div>

                <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(251, 191, 36, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <RefreshCw size={20} color="#fbbf24" />
                    <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '18px' }}>Next Season Rotation</h3>
                  </div>
                  <p style={{ fontSize: '17px', color: '#4ade80', fontWeight: 'bold', margin: '4px 0 12px 0' }}>{rotationData.recommended_next_cycle}</p>
                  <p style={{ fontSize: '15px', color: '#f87171', lineHeight: '1.5' }}><strong>Pathology Caution:</strong> {rotationData.risk_warning}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TELEGRAM & SMS ALERT DISPATCHER */}
        {activeTab === 'alerts' && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '14px', borderRadius: '16px' }}>
                <BellRing size={26} color="#f87171" />
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Farmer Advisory Alert Gateway</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>Broadcast pest warnings, irrigation triggers, or price alerts to mobile devices.</p>
              </div>
            </div>

            <form onSubmit={handleSendAlert} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginTop: '18px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Recipient Phone / Telegram ID</label>
                <input type="text" value={alertForm.phone} onChange={(e) => setAlertForm({ ...alertForm, phone: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Alert Priority</label>
                <select value={alertForm.type} onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value })} style={inputStyle}>
                  <option value="disease">Disease Outbreak (Urgent)</option>
                  <option value="irrigation">Smart Irrigation Relay Trigger</option>
                  <option value="mandi_spike">APMC Price Spike Notification</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Advisory Message Body</label>
                <textarea rows={3} value={alertForm.msg} onChange={(e) => setAlertForm({ ...alertForm, msg: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <button type="submit" className="btn-interactive" style={buttonStyle}>
                  <Send size={18} /> Transmit Alert Relay
                </button>
              </div>
            </form>

            {alertStatus && (
              <div style={{ marginTop: '26px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> Message Dispatched via {alertStatus.channel}
                  </span>
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>{alertStatus.dispatch_time}</span>
                </div>
                <p style={{ margin: '10px 0 0 0', fontSize: '15px', color: '#f3f4f6' }}><strong>Target:</strong> {alertStatus.recipient} — <em>"{alertStatus.message}"</em></p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SHELF-LIFE */}
        {activeTab === 'shelflife' && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '14px', borderRadius: '16px' }}>
                <ThermometerSnowflake size={26} color="#38bdf8" />
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Post-Harvest Shelf-Life & Cold Chain Advisor</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>Prevents market distress-selling by calculating safe storage duration and target temperatures.</p>
              </div>
            </div>

            <form onSubmit={handleComputeShelfLife} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginTop: '18px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Select Crop</label>
                <select value={shelfCommodity} onChange={(e) => setShelfCommodity(e.target.value)} style={inputStyle}>
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Arecanut">Arecanut</option>
                  <option value="Banana">Banana</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Storage Facility</label>
                <select value={shelfStorage} onChange={(e) => setShelfStorage(e.target.value)} style={inputStyle}>
                  <option value="Ambient Room">Ambient Room (Standard Shade)</option>
                  <option value="Cool Chamber">Evaporative Cool Chamber (ZECC)</option>
                  <option value="Cold Storage">Commercial Refrigerated Cold Storage</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Ambient Temperature (°C)</label>
                <input type="number" value={shelfTemp} onChange={(e) => setShelfTemp(+e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-interactive" style={buttonStyle}>Compute Safe Storage</button>
              </div>
            </form>

            {shelfResult && (
              <div style={{ marginTop: '26px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
                <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#38bdf8', fontSize: '18px' }}>Storage Longevity</h3>
                  <h1 style={{ margin: '4px 0 10px 0', color: '#4ade80', fontSize: '32px', fontWeight: '900' }}>{shelfResult.estimated_shelf_life}</h1>
                  <p style={{ fontSize: '15px', color: '#cbd5e1', margin: '6px 0' }}><strong>Target Temp:</strong> {shelfResult.recommended_temp}</p>
                  <p style={{ fontSize: '15px', color: '#cbd5e1', margin: '6px 0' }}><strong>Relative Humidity:</strong> {shelfResult.recommended_rh}</p>
                </div>

                <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <AlertTriangle size={20} color="#f87171" />
                    <h3 style={{ margin: 0, color: '#f87171', fontSize: '18px' }}>Spoilage Risk</h3>
                  </div>
                  <p style={{ fontSize: '15px', color: '#e5e7eb', lineHeight: '1.6', margin: 0 }}>{shelfResult.post_harvest_risk}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PMFBY INSURANCE */}
        {activeTab === 'insurance' && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(74, 222, 128, 0.15)', padding: '14px', borderRadius: '16px' }}>
                <ShieldCheck size={26} color="#4ade80" />
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>PMFBY Crop Insurance & Risk Coverage Estimator</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>Calculates farmer payable premium and claim filing protocols under Pradhan Mantri Fasal Bima Yojana.</p>
              </div>
            </div>

            <form onSubmit={handleComputeInsurance} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginTop: '18px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Select Crop</label>
                <select value={insCrop} onChange={(e) => setInsCrop(e.target.value)} style={inputStyle}>
                  <option value="Tomato">Tomato</option>
                  <option value="Arecanut">Arecanut</option>
                  <option value="Paddy (Rice)">Paddy (Rice)</option>
                  <option value="Maize">Maize</option>
                  <option value="Cotton">Cotton</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Crop Season</label>
                <select value={insSeason} onChange={(e) => setInsSeason(e.target.value)} style={inputStyle}>
                  <option value="Commercial / Horticultural">Commercial / Horticultural (5% Premium)</option>
                  <option value="Kharif">Kharif Season (2% Premium)</option>
                  <option value="Rabi">Rabi Season (1.5% Premium)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Cultivated Area (Acres)</label>
                <input type="number" step="0.5" value={insAcres} onChange={(e) => setInsAcres(+e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-interactive" style={buttonStyle}>Calculate PMFBY Premium</button>
              </div>
            </form>

            {insResult && (
              <div style={{ marginTop: '26px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
                <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#38bdf8', fontSize: '18px' }}>Premium & Coverage</h3>
                  <p style={{ fontSize: '15px', color: '#cbd5e1', margin: '8px 0' }}>Total Sum Insured: <strong style={{ color: '#4ade80' }}>{insResult.total_sum_insured}</strong></p>
                  <p style={{ fontSize: '15px', color: '#cbd5e1', margin: '8px 0' }}>Farmer Payable Premium: <strong style={{ color: '#fbbf24' }}>{insResult.farmer_payable_premium}</strong></p>
                  <p style={{ fontSize: '15px', color: '#cbd5e1', margin: '8px 0' }}>Govt Subsidy Support: <strong style={{ color: '#38bdf8' }}>{insResult.estimated_govt_subsidy}</strong></p>
                </div>

                <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#fbbf24', fontSize: '18px' }}>72-Hour Claim Filing Protocol</h3>
                  <p style={{ fontSize: '15px', color: '#e5e7eb', lineHeight: '1.6', margin: 0 }}>{insResult.claim_procedure}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: GOVERNMENT SCHEMES */}
        {activeTab === 'schemes' && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '14px', borderRadius: '16px' }}>
                  <Landmark size={26} color="#38bdf8" />
                </div>
                <div>
                  <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Karnataka & Central Agri Schemes (2026)</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>Official subsidies for farm ponds, solar pumps, machinery, and crop incentives</p>
                </div>
              </div>
              <select value={schemeCategory} onChange={(e) => setSchemeCategory(e.target.value)} style={{ ...inputStyle, width: 'auto', color: '#4ade80', fontWeight: 'bold' }}>
                <option value="all">All Categories</option>
                <option value="Water">Water & Irrigation</option>
                <option value="Benefit">Direct Cash Support</option>
                <option value="Energy">Clean Energy (Solar)</option>
                <option value="Mechanization">Farm Mechanization</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
              {schemes.map((item) => (
                <div key={item.id} className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(74, 222, 128, 0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '13px', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                      {item.category}
                    </span>
                    <h3 style={{ margin: '12px 0 8px 0', fontSize: '20px', color: '#f3f4f6', fontWeight: '800' }}>{item.name}</h3>
                    <p style={{ fontSize: '15px', color: '#4ade80', fontWeight: '700', margin: '6px 0 12px 0' }}>{item.benefit}</p>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5' }}><strong>Eligibility:</strong> {item.eligibility}</p>
                  </div>
                  <a href={item.apply_link} target="_blank" rel="noreferrer" className="btn-interactive" style={{ marginTop: '18px', display: 'inline-block', textAlign: 'center', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#4ade80', padding: '11px 16px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
                    Apply via Official Portal ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PRECISION INPUTS */}
        {activeTab === 'inputs' && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '14px', borderRadius: '16px' }}>
                <Calculator size={26} color="#10b981" />
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Precision Fertilizer Bags & Spray Tank Calculator</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>Prevents chemical runoff and calculates standard commercial bag purchases.</p>
              </div>
            </div>

            <form onSubmit={handleComputeInputs} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginTop: '18px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Select Crop</label>
                <select value={calcCrop} onChange={(e) => setCalcCrop(e.target.value)} style={inputStyle}>
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Rice">Rice (Paddy)</option>
                  <option value="Maize">Maize</option>
                  <option value="Arecanut">Arecanut (Betelnut)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Land Size (Acres)</label>
                <input type="number" step="0.5" value={calcAcres} onChange={(e) => setCalcAcres(+e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-interactive" style={buttonStyle}>Compute Farm Inputs</button>
              </div>
            </form>

            {calcResult && (
              <div style={{ marginTop: '26px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
                <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                  <h3 style={{ margin: '0 0 14px 0', color: '#38bdf8', fontSize: '18px' }}>Fertilizer Bag Requirements</h3>
                  <p style={{ fontSize: '15px', margin: '10px 0' }}><strong>Urea (46% N):</strong> <span style={{ color: '#4ade80' }}>{calcResult.fertilizer_recommendation.urea}</span></p>
                  <p style={{ fontSize: '15px', margin: '10px 0' }}><strong>DAP (18-46-0):</strong> <span style={{ color: '#4ade80' }}>{calcResult.fertilizer_recommendation.dap}</span></p>
                  <p style={{ fontSize: '15px', margin: '10px 0' }}><strong>MOP (Potash):</strong> <span style={{ color: '#4ade80' }}>{calcResult.fertilizer_recommendation.potash_mop}</span></p>
                </div>

                <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(251, 191, 36, 0.25)' }}>
                  <h3 style={{ margin: '0 0 14px 0', color: '#fbbf24', fontSize: '18px' }}>Spraying & Water Volume</h3>
                  <p style={{ fontSize: '15px', margin: '10px 0' }}><strong>Total Water Required:</strong> <span style={{ color: '#38bdf8' }}>{calcResult.spraying_protocol.spray_water_volume}</span></p>
                  <p style={{ fontSize: '15px', margin: '10px 0' }}><strong>16L Knapsack Backpacks:</strong> <span style={{ color: '#fbbf24' }}>{calcResult.spraying_protocol.knapsack_tanks_16L}</span></p>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />
                  <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0 }}>{calcResult.spraying_protocol.frequency_tip}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: DISEASE DOCTOR */}
        {activeTab === 'doctor' && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '14px', borderRadius: '16px' }}>
                  <ShieldAlert size={26} color="#f87171" />
                </div>
                <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Crop Disease Doctor (PyTorch MobileNetV2)</h2>
              </div>
              <button onClick={() => speakText("Please upload a picture of the plant leaf for diagnosis.")} className="btn-interactive" style={{ ...buttonStyle, background: '#374151' }}>
                <Volume2 size={18} /> Audio Guide
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '26px' }}>
              <div>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '16px', color: '#cbd5e1', fontSize: '14px' }} />
                {previewUrl && <img src={previewUrl} alt="Leaf Preview" style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(74, 222, 128, 0.3)' }} />}
                <button onClick={handleDiagnose} disabled={!selectedFile || loadingDisease} className="btn-interactive" style={buttonStyle}>
                  {loadingDisease ? 'Diagnosing...' : 'Diagnose Plant Leaf'}
                </button>
              </div>

              {diseaseResult && (
                <div className="interactive-card" style={{ backgroundColor: 'rgba(23, 33, 28, 0.88)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#f87171', fontSize: '20px' }}>{diseaseResult.disease}</h3>
                    <button onClick={() => speakText(`Diagnosis: ${diseaseResult.disease} on ${diseaseResult.crop}. Treatment: ${diseaseResult.treatment}`)} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer' }}>
                      <Volume2 size={24} />
                    </button>
                  </div>
                  <p style={{ fontSize: '15px', margin: '10px 0' }}><strong>Target Crop:</strong> {diseaseResult.crop} ({diseaseResult.confidence}% confidence)</p>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />
                  <p style={{ fontSize: '15px', color: '#fbbf24', margin: '8px 0' }}><strong>Symptoms:</strong> {diseaseResult.symptoms}</p>
                  <p style={{ fontSize: '15px', color: '#60a5fa', margin: '8px 0' }}><strong>Prevention:</strong> {diseaseResult.prevention}</p>
                  <p style={{ fontSize: '15px', color: '#4ade80', margin: '8px 0' }}><strong>Treatment:</strong> {diseaseResult.treatment}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 9: SOIL HEALTH */}
        {activeTab === 'soil' && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(74, 222, 128, 0.15)', padding: '12px', borderRadius: '14px' }}>
                  <Sprout size={26} color="#4ade80" />
                </div>
                <div>
                  <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Soil Health & Digital Agronomy Card</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>Generate official PDF soil health recommendations</p>
                </div>
              </div>
              <button onClick={downloadSoilPDF} className="btn-interactive" style={buttonStyle}>
                <FileDown size={20} /> Export Soil Health Card (PDF)
              </button>
            </div>

            <form onSubmit={handleCropRec} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              <div><label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Farmer Name</label><input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} style={inputStyle} /></div>
              <div><label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Nitrogen (N)</label><input type="number" value={cropInputs.N} onChange={(e) => setCropInputs({ ...cropInputs, N: +e.target.value })} style={inputStyle} /></div>
              <div><label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Phosphorus (P)</label><input type="number" value={cropInputs.P} onChange={(e) => setCropInputs({ ...cropInputs, P: +e.target.value })} style={inputStyle} /></div>
              <div><label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Potassium (K)</label><input type="number" value={cropInputs.K} onChange={(e) => setCropInputs({ ...cropInputs, K: +e.target.value })} style={inputStyle} /></div>
              <div><label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Soil pH</label><input type="number" step="0.1" value={cropInputs.ph} onChange={(e) => setCropInputs({ ...cropInputs, ph: +e.target.value })} style={inputStyle} /></div>
              <div><label style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Moisture (%)</label><input type="number" value={cropInputs.moisture} onChange={(e) => setCropInputs({ ...cropInputs, moisture: +e.target.value })} style={inputStyle} /></div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-interactive" style={buttonStyle}>Update Recommendation</button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 10: WEATHER ADVISORY */}
        {activeTab === 'weather' && weatherData && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(251, 191, 36, 0.15)', padding: '14px', borderRadius: '16px' }}>
                  <CloudSun size={26} color="#fbbf24" />
                </div>
                <div>
                  <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Localized Micro-Climate Advisory</h2>
                  <p style={{ margin: '3px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>
                    Target: <strong style={{ color: '#38bdf8' }}>{weatherData.location}</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={handleDetectLocation} className="btn-interactive" style={{ ...buttonStyle, padding: '10px 16px' }}>
                  <Navigation size={16} /> {locating ? 'Locating...' : 'Use My GPS'}
                </button>

                <select value={selectedDistrict} onChange={(e) => { setSelectedDistrict(e.target.value); fetchWeather(e.target.value); }} style={{ ...inputStyle, width: 'auto', color: '#4ade80', fontWeight: 'bold' }}>
                  <option value="Bangalore Urban">Bangalore Urban (Bengaluru)</option>
                  <option value="Yellapur">Yellapur</option>
                  <option value="Sirsi">Sirsi</option>
                  <option value="Dharwad">Dharwad / Hubli</option>
                  <option value="Uttara Kannada">Uttara Kannada</option>
                  <option value="Belgaum">Belgaum</option>
                  <option value="Shimoga">Shimoga</option>
                  <option value="Mysore">Mysore</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              <div className="interactive-card" style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>Ambient Temperature</p>
                <h2 style={{ margin: '8px 0 0 0', color: '#38bdf8', fontSize: '28px', fontWeight: '900' }}>{weatherData.temperature}</h2>
              </div>
              <div className="interactive-card" style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>Relative Humidity</p>
                <h2 style={{ margin: '8px 0 0 0', color: '#a78bfa', fontSize: '28px', fontWeight: '900' }}>{weatherData.humidity}</h2>
              </div>
              <div className="interactive-card" style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>Precipitation</p>
                <h2 style={{ margin: '8px 0 0 0', color: '#34d399', fontSize: '28px', fontWeight: '900' }}>{weatherData.rainfall}</h2>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', padding: '20px', borderRadius: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#4ade80', fontSize: '17px' }}>Automated Agronomic Advisory:</h4>
              <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6' }}>{weatherData.alert}</p>
            </div>
          </div>
        )}

        {/* TAB 11: IOT TELEMETRY */}
        {activeTab === 'iot' && (
          <div className="tab-pane-animated" style={glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '14px', borderRadius: '16px' }}>
                  <Cpu size={26} color="#38bdf8" />
                </div>
                <div>
                  <h2 style={{ margin: 0, color: '#4ade80', fontSize: '23px', fontWeight: '800' }}>Edge IoT Telemetry Node</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>Live sync with field ESP32 microcontroller (Updated: {telemetry.last_updated})</p>
                </div>
              </div>
              <button onClick={togglePump} className="btn-interactive" style={{ ...buttonStyle, background: telemetry.pump_status === 'MANUAL-ON' ? '#ef4444' : '#10b981' }}>
                Pump Relay: {telemetry.pump_status}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div className="interactive-card" style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '22px', borderRadius: '16px' }}>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Soil Moisture Sensor</span>
                <h2 style={{ margin: '10px 0 0 0', color: telemetry.soil_moisture < 35 ? '#ef4444' : '#4ade80', fontSize: '28px', fontWeight: '900' }}>{telemetry.soil_moisture}%</h2>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{telemetry.soil_moisture < 35 ? 'Below threshold' : 'Optimal'}</span>
              </div>
              <div className="interactive-card" style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '22px', borderRadius: '16px' }}>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Field Temperature</span>
                <h2 style={{ margin: '10px 0 0 0', color: '#38bdf8', fontSize: '28px', fontWeight: '900' }}>{telemetry.temperature}°C</h2>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>Sensor: DHT22</span>
              </div>
              <div className="interactive-card" style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '22px', borderRadius: '16px' }}>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Field Humidity</span>
                <h2 style={{ margin: '10px 0 0 0', color: '#a78bfa', fontSize: '28px', fontWeight: '900' }}>{telemetry.humidity}%</h2>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>Micro-climate normal</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}