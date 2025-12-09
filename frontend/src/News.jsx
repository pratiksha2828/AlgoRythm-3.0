import React, { useState, useEffect } from "react";
import axios from "axios";
import { feature as topoFeature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const GNEWS_API_KEY = "be5d136498f94deb73d1950f9365a0a1"; // Replace with your key

// Map country names → ISO codes
const countryCodeMap = {
  "India": "in",
  "United States": "us",
  "United States of America": "us",
  "USA": "us",
  "America": "us",
  "United Kingdom": "gb",
  "UK": "gb",
  "Britain": "gb",
  "Great Britain": "gb",
  "Canada": "ca",
  "Germany": "de",
  "France": "fr",
  "Australia": "au",
  "Japan": "jp",
  "China": "cn",
  "People's Republic of China": "cn",
  "Brazil": "br",
  "Brasil": "br",
  "Russia": "ru",
  "Russian Federation": "ru",
  "Mexico": "mx",
  "South Africa": "za",
  "Nigeria": "ng",
  "Saudi Arabia": "sa",
  "South Korea": "kr",
  "Thailand": "th",
  "Indonesia": "id",
  "Greenland": "gl",
  "Argentina": "ar",
  "Chile": "cl",
  "Peru": "pe",
  "Colombia": "co",
  "Venezuela": "ve",
  "Egypt": "eg",
  "Kenya": "ke",
  "Ethiopia": "et",
  "Pakistan": "pk",
  "Bangladesh": "bd",
  "Vietnam": "vn",
  "Philippines": "ph",
  "Malaysia": "my",
  "Singapore": "sg",
  "New Zealand": "nz",
  "Spain": "es",
  "Italy": "it",
  "Netherlands": "nl",
  "Sweden": "se",
  "Norway": "no",
  "Finland": "fi",
  "Poland": "pl",
  "Ukraine": "ua",
  "Turkey": "tr",
  "Iran": "ir",
  "Iraq": "iq",
  "Israel": "il",
  "United Arab Emirates": "ae",
  "Qatar": "qa",
  "Kazakhstan": "kz",
  "Uzbekistan": "uz",
  "Turkmenistan": "tm",
  "Kyrgyzstan": "kg",
  "Tajikistan": "tj",
  "Afghanistan": "af",
  "Mongolia": "mn",
  "Myanmar": "mm",
  "Sri Lanka": "lk",
  "Nepal": "np",
  "Bhutan": "bt",
  "Jordan": "jo",
  "Lebanon": "lb",
  "Syria": "sy",
  "Yemen": "ye",
  "Oman": "om",
  "Kuwait": "kw",
  "Bahrain": "bh",
  "Libya": "ly",
  "Sudan": "sd",
  "Eritrea": "er",
  "Djibouti": "dj",
  "Somalia": "so",
  "Morocco": "ma",
  "Algeria": "dz",
  "Tunisia": "tn",
  "Liberia": "lr",
  "Sierra Leone": "sl",
  "Guinea": "gn",
  "Mali": "ml",
  "Burkina Faso": "bf",
  "Niger": "ne",
  "Chad": "td",
  "Central African Republic": "cf",
  "Democratic Republic of the Congo": "cd",
  "Republic of the Congo": "cg",
  "Gabon": "ga",
  "Cameroon": "cm",
  "Equatorial Guinea": "gq",
  "Sao Tome and Principe": "st",
  "Angola": "ao",
  "Zambia": "zm",
  "Zimbabwe": "zw",
  "Mozambique": "mz",
  "Madagascar": "mg",
  "Mauritius": "mu",
  "Seychelles": "sc",
  "Comoros": "km",
  "Tanzania": "tz",
  "Uganda": "ug",
  "Rwanda": "rw",
  "Burundi": "bi",
  "Malawi": "mw",
  "Botswana": "bw",
  "Namibia": "na",
  "Lesotho": "ls",
  "Swaziland": "sz",
  "Eswatini": "sz",
  "Belarus": "by",
  "Moldova": "md",
  "Romania": "ro",
  "Bulgaria": "bg",
  "Serbia": "rs",
  "Croatia": "hr",
  "Bosnia and Herzegovina": "ba",
  "Montenegro": "me",
  "Kosovo": "xk",
  "Albania": "al",
  "North Macedonia": "mk",
  "Greece": "gr",
  "Hungary": "hu",
  "Slovakia": "sk",
  "Czech Republic": "cz",
  "Austria": "at",
  "Switzerland": "ch",
  "Belgium": "be",
  "Luxembourg": "lu",
  "Monaco": "mc",
  "Liechtenstein": "li",
  "Slovenia": "si",
  "Portugal": "pt",
  "Ireland": "ie",
  "Iceland": "is",
  "Denmark": "dk",
  "Estonia": "ee",
  "Latvia": "lv",
  "Lithuania": "lt",
  "Armenia": "am",
  "Azerbaijan": "az",
  "Georgia": "ge",
  "Taiwan": "tw",
  "North Korea": "kp",
  "Laos": "la",
  "Cambodia": "kh",
  "East Timor": "tl",
  "Papua New Guinea": "pg",
  "Solomon Islands": "sb",
  "Vanuatu": "vu",
  "Fiji": "fj",
  "Samoa": "ws",
  "Tonga": "to",
  "Tuvalu": "tv",
  "Kiribati": "ki",
  "Marshall Islands": "mh",
  "Micronesia": "fm",
  "Palau": "pw",
  "Nauru": "nr",
  "Cuba": "cu",
  "Haiti": "ht",
  "Dominican Republic": "do",
  "Jamaica": "jm",
  "Trinidad and Tobago": "tt",
  "Barbados": "bb",
  "Bahamas": "bs",
  "Belize": "bz",
  "Guatemala": "gt",
  "El Salvador": "sv",
  "Honduras": "hn",
  "Nicaragua": "ni",
  "Costa Rica": "cr",
  "Panama": "pa",
  "Ecuador": "ec",
  "Bolivia": "bo",
  "Paraguay": "py",
  "Uruguay": "uy",
  "Suriname": "sr",
  "Guyana": "gy",
};

export default function TechNewsMap() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [tooltipContent, setTooltipContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [worldFeatures, setWorldFeatures] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const fetchNews = async (countryName) => {
    let code = null;
    let displayName = countryName || "Global";

    setLoading(true);
    try {
      const callGNews = async (params) => {
        const url = new URL("https://gnews.io/api/v4/search");
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null) url.searchParams.set(k, v);
        });
        url.searchParams.set("token", GNEWS_API_KEY);
        url.searchParams.set("lang", "en");
        url.searchParams.set("max", "5");
        const { data } = await axios.get(url.toString());
        return data?.articles || [];
      };

      if (typeof countryName === "string" && countryName.length === 2) {
        code = countryName.toLowerCase();
        const entry = Object.entries(countryCodeMap).find(([, v]) => v === code);
        displayName = entry ? entry[0] : countryName.toUpperCase();
      } else if (typeof countryName === "string") {
        const matchKey = Object.keys(countryCodeMap).find(k => k.toLowerCase() === countryName.toLowerCase());
        if (matchKey) {
          code = countryCodeMap[matchKey];
          displayName = matchKey;
        }
      }

      let articles = [];

      if (code) {
        articles = await callGNews({ q: "technology", country: code });
        if (!articles || articles.length === 0) {
          articles = await callGNews({ country: code });
        }
      }

      setNewsArticles(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNewsArticles([]);
    } finally {
      setSelectedCountry(displayName);
      setLoading(false);
    }
  };

  // Load TopoJSON data properly
  useEffect(() => {
    const loadTopo = async () => {
      try {
        const response = await fetch(geoUrl);
        const worldData = await response.json();
        
        // Convert TopoJSON to GeoJSON - countries-110m.json has 'countries' as the object key
        const countriesGeoJSON = topoFeature(worldData, worldData.objects.countries);
        
        console.log("Loaded features:", countriesGeoJSON.features.length);
        console.log("Sample feature:", countriesGeoJSON.features[0]);
        
        setWorldFeatures(countriesGeoJSON.features);
      } catch (error) {
        console.error("Error loading map data:", error);
      }
    };

    loadTopo();
  }, []);

  // Improved country code resolution
  const resolveCountryCodeFromFeature = (feature) => {
    const props = feature?.properties || {};
    
    // For world-atlas@2 countries-110m.json, the properties are different
    const countryName = props.name || "";
    
    // Direct name matching
    const matchKey = Object.keys(countryCodeMap).find(
      key => key.toLowerCase() === countryName.toLowerCase()
    );
    
    if (matchKey) {
      return countryCodeMap[matchKey];
    }
    
    // Try ISO code properties
    const isoCodes = [props.iso_a2, props.iso_a3, props.iso_n3, props.adm0_a3];
    for (const code of isoCodes) {
      if (code && code.length === 2) {
        return code.toLowerCase();
      }
    }
    
    return null;
  };

  // Proper SVG path generation for GeoJSON
  const projection = geoMercator()
  .scale(140)
  .translate([600, 400]);  // center into 1200×700 SVG

const pathGenerator = geoPath().projection(projection);

const geoJsonToSvgPath = (geometry) => {
  if (!geometry) return "";
  return pathGenerator({ type: "Feature", geometry });
};


  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
        overflowY: "auto",
        padding: "30px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            color: "white",
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          🌍 Global Tech News
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.4rem" }}>
          Click on a country to view the latest technology news
        </p>
      </div>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          style={{
            position: "fixed",
            top: 30,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(30, 41, 59, 0.95)",
            padding: "15px 30px",
            borderRadius: "15px",
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#f1f5f9",
            pointerEvents: "none",
            zIndex: 10,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 15px 30px rgba(0,0,0,0.4)",
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* World Map */}
      <div
        style={{
          width: "95%",
          height: "75vh",
          margin: "0 auto 40px auto",
          borderRadius: "20px",
          overflow: "hidden",
          background: "linear-gradient(180deg, #0a1929, #132f4c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
      >
        {worldFeatures && worldFeatures.length > 0 ? (
          <svg 
            viewBox="0 0 1200 700" 
            style={{ 
              width: "100%", 
              height: "100%", 
              display: "block" 
            }} 
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#0a1929", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#132f4c", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="1200" height="700" fill="url(#oceanGradient)" />
            
            {worldFeatures.map((feature, idx) => {
              const countryName = feature.properties?.name || "Unknown Country";
              const resolvedCode = resolveCountryCodeFromFeature(feature);
              const isClickable = !!resolvedCode || Object.keys(countryCodeMap).some(
                key => key.toLowerCase() === countryName.toLowerCase()
              );

              const pathData = geoJsonToSvgPath(feature.geometry);
              
              if (!pathData) return null;

              if (!isClickable) {
                return (
                  <path
                    key={`${countryName}-${idx}`}
                    d={pathData}
                    fill="#1e3a8a"
                    stroke="#64748b"
                    strokeWidth="0.5"
                  />
                );
              }
              
              return (
                <g
                  key={`${countryName}-${idx}`}
                  onMouseEnter={() => { 
                    setTooltipContent(countryName); 
                    setHoveredFeature(idx); 
                  }}
                  onMouseLeave={() => { 
                    setTooltipContent(""); 
                    setHoveredFeature(null); 
                  }}
                  onClick={() => {
                    const codeToUse = resolvedCode || countryName;
                    fetchNews(codeToUse);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d={pathData}
                    fill={hoveredFeature === idx ? "#3b82f6" : "#1e40af"}
                    stroke="#64748b"
                    strokeWidth="0.8"
                    style={{ 
                      transition: "fill 0.3s ease",
                      opacity: hoveredFeature === idx ? 1 : 0.9
                    }}
                  />
                </g>
              );
            })}
          </svg>
        ) : (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "1.6rem", marginBottom: "15px" }}>Loading world map...</div>
            <div style={{ fontSize: "1.1rem" }}>Please wait while we load geographic data</div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <div style={{ color: "#3b82f6", fontSize: "1.6rem" }}>
            Loading news...
          </div>
        </div>
      )}

      {/* News Section */}
      {selectedCountry && !loading && newsArticles.length > 0 && (
        <div>
          <h2
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "2.2rem",
            }}
          >
            📰 Latest Tech News from {selectedCountry}
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: "25px",
              justifyContent: "center",
              overflowX: "auto",
              padding: "10px",
            }}
          >
            {newsArticles.map((article, idx) => (
              <div
                key={idx}
                style={{
                  background: "#1f2937",
                  borderRadius: "15px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                  width: "300px",
                  overflow: "hidden",
                  color: "white",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      marginBottom: "12px",
                      lineHeight: "1.4",
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#d1d5db",
                      marginBottom: "15px",
                    }}
                  >
                    {article.description?.slice(0, 120)}...
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#2563eb";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#3b82f6";
                    }}
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No News */}
      {selectedCountry && !loading && newsArticles.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p style={{ color: "#9ca3af", fontSize: "1.3rem" }}>
            No tech news available for {selectedCountry}.
          </p>
        </div>
      )}
    </div>
  );
}