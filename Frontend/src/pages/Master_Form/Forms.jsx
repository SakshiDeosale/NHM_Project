
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


const schemes = [
  {
    id: "nhm",
    name: "NHM",
    description: "National Health Mission",
    logo: "/assets/images/NHM.jpg",
    color: "nhm",
    route: "/forms/nhm",
    icon: "✚",
  },
  {
    id: "15th-fc",
    name: "15th FC",
    description: "15th Finance Commission",
    logo: "/assets/images/Finance Commision of India.jpeg",
    color: "finance",
    route: "/scheme/15th-fc",
    icon: "₹",
  },
  {
    id: "pm-abhim",
    name: "PM-ABHIM",
    description:
      "Pradhan Mantri Ayushman Bharat Health Infrastructure Mission",
    logo: "/assets/images/PM-Abhyan.jpeg",
    color: "abhim",
    route: "/scheme/pm-abhim",
    icon: "✚",
  },
  {
    id: "pmjvk",
    name: "PMJVK",
    description: "Pradhan Mantri Jan Vikas Karyakram",
    logo: "/assets/images/PMJVK.jpeg",
    color: "pmjvk",
    route: "/scheme/pmjvk",
    icon: "◉",
  },
  {
    id: "ayush",
    name: "AYUSH",
    description: "AYUSH Scheme",
    logo: "/assets/images/National Ayush Mission.jpeg",
    color: "ayush",
    route: "/scheme/ayush",
    icon: "✿",
  },
  {
    id: "adb",
    name: "ADB",
    description: "Asian Development Bank",
    logo: "/assets/images/ADB.jpeg",
    color: "adb",
    route: "/scheme/adb",
    icon: "▤",
  },
  {
    id: "ndb",
    name: "NDB",
    description: "New Development Bank",
    logo: "/assets/images/NDB.jpeg",
    color: "ndb",
    route: "/scheme/ndb",
    icon: "▥",
  },
];

export default function Forms({ onSelectScheme }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredSchemes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return schemes.filter(
      (scheme) =>
        scheme.name.toLowerCase().includes(query) ||
        scheme.description.toLowerCase().includes(query)
    );
  }, [search]);

  const handleSelect = (scheme) => {
    if (onSelectScheme) {
      onSelectScheme(scheme);
    } else {
      navigate(scheme.route);
    }
  };

  return (
    <div className="scheme-page">
      <div>
        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-speedometer2" aria-hidden="true" />
            </span>
            <div>
              <h1 className="h3 mb-1">Master Form</h1>
              <p className="text-muted mb-0">
                Select a scheme to check its details.
              </p>
            </div>
          </div>
          <div className="heading-actions"></div>
        </div>

        {/* <div className="scheme-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search scheme..."
            aria-label="Search schemes"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div> */}
      </div>

      <div className="scheme-grid">
        {filteredSchemes.map((scheme) => (
          <button
            type="button"
            className={`scheme-card ${scheme.color}`}
            key={scheme.id}
            onClick={() => handleSelect(scheme)}
            aria-label={`Open ${scheme.name}: ${scheme.description}`}
          >
            <span className="scheme-logo-wrap">
              <img
                className="scheme-logo"
                src={scheme.logo}
                alt={`${scheme.name} logo`}
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
            </span>

            <span className="scheme-copy">
              <strong>{scheme.name}</strong>
              <span className="scheme-description">
                {scheme.description}
              </span>
            </span>

            <span className="scheme-arrow" aria-hidden="true">
              →
            </span>

            <span className="scheme-decoration" aria-hidden="true">
              {scheme.icon}
            </span>
          </button>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="scheme-empty">
          No schemes match "{search}". Try another search.
        </div>
      )}
    </div>
  );
}
