import React, { useState } from "react";
import {
    MapPin,
    ArrowRight,
    Plane,
    ShieldCheck,
    Headphones,
    Sparkles,
} from "lucide-react";
import "./Destinations.css";

import losAngeles from "../../assets/los-angeles-flight.jpg";
import newYork from "../../assets/new-york-flight.jpg";
import toronto from "../../assets/toronto-flight.jpg";
import chicago from "../../assets/chicago-flight.jpg";
import germany from "../../assets/germany.png";

const DESTINATIONS_DATA = [
    {
        id: "los-angeles",
        city: "Los Angeles",
        country: "USA",
        eyebrow: "SUN, SUCCESS & ENDLESS VIBES",
        title: "Los Angeles",
        description:
            "From iconic beaches and Hollywood glamour to vibrant culture and world-class dining, LA has it all.",
        image: losAngeles,
        badge: "Popular",
    },
    {
        id: "new-york",
        city: "New York",
        country: "USA",
        eyebrow: "THE CITY THAT NEVER SLEEPS",
        title: "New York",
        description: "Big dreams. Bigger city.",
        image: newYork,
        badge: "Trending",
    },
    {
        id: "toronto",
        city: "Toronto",
        country: "Canada",
        eyebrow: "VIBRANT & COSMOPOLITAN",
        title: "Toronto",
        description: "Modern city. Endless adventures.",
        image: toronto,
        badge: "Popular",
    },
    {
        id: "chicago",
        city: "Chicago",
        country: "USA",
        eyebrow: "WINDY CITY SPLENDOR",
        title: "Chicago",
        description: "Where the city meets the lake.",
        image: chicago,
        badge: "Hot Deal",
    },
    {
        id: "germany",
        city: "Germany",
        country: "Europe",
        eyebrow: "FAIRYTALE CASTLES & CULTURE",
        title: "Germany",
        description: "Timeless cities. Unforgettable journeys.",
        image: germany,
        badge: "Top Rated",
    },
];

function Destinations() {
    // Active featured destination (defaults to Los Angeles)
    const [activeIndex, setActiveIndex] = useState(0);

    const featured = DESTINATIONS_DATA[activeIndex];

    // The other 4 destinations shown on the right side
    const sideDestinations = DESTINATIONS_DATA.filter(
        (_, idx) => idx !== activeIndex
    );

    const handleExploreClick = () => {
        // Scroll smoothly up to flight search form
        const searchElement =
            document.querySelector(".flight-section") ||
            document.querySelector(".flight-form-container");
        if (searchElement) {
            searchElement.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            window.scrollTo({ top: 320, behavior: "smooth" });
        }
    };

    return (
        <section className="destination-section" id="destinations">
            <div className="destination-container">
                {/* =====================================================
                    TOP SECTION HEADER (MATCHING REFERENCE DESIGN)
                ===================================================== */}
                <div className="destination-top-bar">
                    <div className="destination-header-left">
                        <div className="destination-eyebrow-wrap">
                            <span className="destination-eyebrow-text">
                                EXPLORE THE WORLD
                            </span>
                            <span className="destination-eyebrow-line"></span>
                        </div>

                        <h2 className="destination-main-title">
                            Where Your Dream{" "}
                            <span className="destination-title-highlight">
                                Journey Begins
                            </span>
                        </h2>

                        <p className="destination-subtitle">
                            Discover amazing destinations, book your perfect trip,
                            and create memories that last a lifetime.
                        </p>
                    </div>

                    <div className="destination-features-row">
                        <div className="destination-feature-item">
                            <div className="destination-feature-icon">
                                <Plane size={20} strokeWidth={2.2} />
                            </div>
                            <div className="destination-feature-text">
                                <strong>Best Prices</strong>
                                <span>Save more on your trips</span>
                            </div>
                        </div>

                        <div className="destination-feature-divider"></div>

                        <div className="destination-feature-item">
                            <div className="destination-feature-icon">
                                <ShieldCheck size={20} strokeWidth={2.2} />
                            </div>
                            <div className="destination-feature-text">
                                <strong>Secure Booking</strong>
                                <span>Your safety, our priority</span>
                            </div>
                        </div>

                        <div className="destination-feature-divider"></div>

                        <div className="destination-feature-item">
                            <div className="destination-feature-icon">
                                <Headphones size={20} strokeWidth={2.2} />
                            </div>
                            <div className="destination-feature-text">
                                <strong>24/7 Support</strong>
                                <span>We're always here</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    MAIN DESTINATIONS SHOWCASE GRID
                ===================================================== */}
                <div className="destination-showcase-grid">
                    {/* LEFT COLUMN: HERO FEATURED DESTINATION CARD */}
                    <div
                        className="destination-hero-card"
                        style={{ backgroundImage: `url(${featured.image})` }}
                    >
                        <div className="destination-hero-overlay"></div>

                        {/* Top Location & Badge */}
                        <div className="destination-hero-top">
                            <div className="destination-location-chip">
                                <MapPin size={17} className="dest-pin-icon" />
                                <div className="dest-chip-details">
                                    <span className="dest-chip-city">
                                        {featured.city}
                                    </span>
                                    <span className="dest-chip-country">
                                        {featured.country}
                                    </span>
                                </div>
                            </div>

                            <div className="destination-popular-badge">
                                <Sparkles size={14} />
                                <span>{featured.badge}</span>
                            </div>
                        </div>

                        {/* Bottom Hero Content */}
                        <div className="destination-hero-bottom">
                            <span className="destination-hero-eyebrow">
                                {featured.eyebrow}
                            </span>

                            <h3 className="destination-hero-title">
                                {featured.title}
                            </h3>

                            <p className="destination-hero-description">
                                {featured.description}
                            </p>

                            <div className="destination-hero-actions">
                                <button
                                    type="button"
                                    className="destination-explore-btn"
                                    onClick={handleExploreClick}
                                >
                                    <span>Explore Destination</span>
                                    <ArrowRight size={17} />
                                </button>

                                <div className="destination-hero-dots">
                                    {DESTINATIONS_DATA.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`dest-dot ${
                                                idx === activeIndex
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() => setActiveIndex(idx)}
                                            aria-label={`Select destination ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: 4 HORIZONTAL DESTINATION CARDS */}
                    <div className="destination-side-stack">
                        {sideDestinations.map((dest) => {
                            const originalIndex = DESTINATIONS_DATA.findIndex(
                                (d) => d.id === dest.id
                            );

                            return (
                                <div
                                    key={dest.id}
                                    className="destination-horizontal-card"
                                    style={{
                                        backgroundImage: `url(${dest.image})`,
                                    }}
                                    onClick={() => setActiveIndex(originalIndex)}
                                >
                                    <div className="destination-card-overlay"></div>

                                    <div className="destination-card-content">
                                        <div className="destination-card-location">
                                            <MapPin
                                                size={15}
                                                className="dest-pin-icon-sm"
                                            />
                                            <div className="dest-card-loc-text">
                                                <span className="dest-card-city">
                                                    {dest.city}
                                                </span>
                                                <span className="dest-card-country">
                                                    {dest.country}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="destination-card-body">
                                            <h4 className="dest-card-title">
                                                {dest.title}
                                            </h4>
                                            <p className="dest-card-subtitle">
                                                {dest.description}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="destination-card-action-btn"
                                        aria-label={`View ${dest.title}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveIndex(originalIndex);
                                        }}
                                    >
                                        <ArrowRight size={17} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Destinations;