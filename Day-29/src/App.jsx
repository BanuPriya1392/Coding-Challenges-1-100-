import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Search,
  MapPin,
  Navigation,
} from "lucide-react";

const weatherMapping = {
  0: {
    label: "Clear Sky",
    icon: <Sun size={80} strokeWidth={1.5} color="#f59e0b" />,
  },
  1: {
    label: "Mainly Clear",
    icon: <Sun size={80} strokeWidth={1.5} color="#fbbf24" />,
  },
  2: {
    label: "Partly Cloudy",
    icon: <Cloud size={80} strokeWidth={1.5} color="#94a3b8" />,
  },
  3: {
    label: "Overcast",
    icon: <Cloud size={80} strokeWidth={1.5} color="#64748b" />,
  },
  61: {
    label: "Slight Rain",
    icon: <CloudRain size={80} strokeWidth={1.5} color="#3b82f6" />,
  },
};

function App() {
  const [city, setCity] = useState("Local Area");
  const [weather, setWeather] = useState(null);
  const [input, setInput] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input) return;
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=1`,
      );
      const geoData = await geoRes.json();
      if (geoData.results) {
        const { latitude, longitude, name } = geoData.results[0];
        setCity(name);
        fetchWeather(latitude, longitude);
      }
    } catch (err) {
      alert("Error finding location");
    }
  };

  const fetchWeather = async (lat, lon) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
    );
    const data = await res.json();
    setWeather(data.current_weather);
  };

  useEffect(() => {
    // Attempt Geolocation first
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(51.5074, -0.1278), // Fallback to London
    );
  }, []);

  if (!weather)
    return <div style={{ color: "white" }}>Loading Atmosphere...</div>;

  const condition = weatherMapping[weather.weathercode] || {
    label: "Cloudy",
    icon: <Cloud size={80} strokeWidth={1.5} />,
  };

  return (
    <div className="weather-card">
      <form className="search-container" onSubmit={handleSearch}>
        <input
          className="search-input"
          placeholder="Search your city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="search-btn" type="submit">
          <Search size={20} />
        </button>
      </form>

      <div
        className="city-name flex items-center justify-center gap-2"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          opacity: 0.7,
        }}
      >
        <MapPin size={16} /> <span style={{ fontWeight: 600 }}>{city}</span>
      </div>

      <div style={{ margin: "30px 0" }}>{condition.icon}</div>

      <h1 className="temp-text">{Math.round(weather.temperature)}°</h1>
      <p className="condition-label">{condition.label}</p>

      <div className="stats-grid">
        <div className="stat-item">
          <p>Wind</p>
          <strong>
            {weather.windspeed} <small>km/h</small>
          </strong>
        </div>
        <div className="stat-item">
          <p>Direction</p>
          <strong>{weather.winddirection}°</strong>
        </div>
      </div>
    </div>
  );
}

export default App;
