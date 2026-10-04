import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Clock, Luggage, Phone, Printer } from "lucide-react";
import { getBookingSession } from "../../utils/flightUtils";
import mybookImg from "../../assets/mybook.png";
import "./BookingConfirmation.css";

function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeState = location.state || getBookingSession()?.state || {};

    const {
        bookingReference = "TFG241FF8",
        finalTotalPrice = 378.00,
        passengers = [
            {
                firstName: "John",
                middleName: "",
                lastName: "Doe",
                gender: "Male",
                passengerType: "Adult",
            },
        ],
        selectedDeparture = {
            airline: "British Airways",
            flightNumber: "BA0117",
            flightClass: "Economy",
            from: "New Delhi",
            fromCity: "New Delhi",
            to: "Mumbai",
            toCity: "Mumbai",
            departureDate: "Sat 10 Oct",
            departureTime: "06:58",
            arrivalTime: "09:03",
            duration: "2h 05m",
            price: 360.00,
        },
        selectedReturn,
        billingDetails = {},
    } = activeState;

    const pnr = bookingReference;
    const customerEmail = billingDetails?.email || "rajusharma67301@gmail.com";
    const totalPrice = Number(finalTotalPrice || 378.00);

    const formatUSD = (val) => {
        const num = Number(val || 0);
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const depAirline = selectedDeparture?.airline || "British Airways";
    const depFlightNo = selectedDeparture?.flightNumber || "BA0117";
    const depClass = selectedDeparture?.flightClass || "Economy";
    const depFrom = selectedDeparture?.from || selectedDeparture?.fromCity || "New Delhi";
    const depTo = selectedDeparture?.to || selectedDeparture?.toCity || "Mumbai";
    const depDate = selectedDeparture?.departureDate || "Sat 10 Oct";
    const depTime = selectedDeparture?.departureTime || "06:58";
    const arrTime = selectedDeparture?.arrivalTime || "09:03";
    const duration = selectedDeparture?.duration || "2h 05m";

    return (
        <main className="tfg-confirm-page">
            {/* =================================================
                CONFIRMATION HERO (MATCHING ABOUT US DESIGN)
            ================================================= */}
            <section className="confirm-hero">
                <div
                    className="confirm-hero-backdrop"
                    style={{ backgroundImage: `url(${mybookImg})` }}
                ></div>

                <img
                    src={mybookImg}
                    alt="Booking Confirmation"
                    className="confirm-hero-image"
                />

                <div className="confirm-hero-overlay"></div>

                <div className="confirm-hero-content">
                    <h1>Booking Confirmation</h1>
                </div>
            </section>

            <div className="tfg-confirm-container">
                {/* =================================================
                    STEP 1: TOP SUCCESS ICON & TITLE (SCREENSHOT 3)
                ================================================= */}
                <div className="tfg-success-head">
                    <div className="tfg-check-circle">
                        <Check size={36} color="#ffffff" strokeWidth={3} />
                    </div>

                    <h1 className="tfg-confirm-title">
                        Your booking request is in!
                    </h1>

                    <p className="tfg-confirm-subtitle">
                        Thanks! Our travel team is confirming your flight and will email your tickets to{" "}
                        <strong className="tfg-email-highlight">{customerEmail}</strong> shortly. Keep your reference below handy.
                    </p>
                </div>

                {/* =================================================
                    STEP 2: DARK REFERENCE CARD (SCREENSHOT 3)
                ================================================= */}
                <div className="tfg-reference-card">
                    <div className="tfg-ref-left">
                        <span className="tfg-ref-label">Your booking reference</span>
                        <div className="tfg-ref-code">{pnr}</div>
                    </div>

                    <div className="tfg-ref-right">
                        <span className="tfg-status-pill">PROCESSING</span>
                        <div className="tfg-ref-price">${formatUSD(totalPrice)}</div>
                    </div>
                </div>

                {/* =================================================
                    STEP 3: FLIGHT SUMMARY CARD (SCREENSHOT 3 & 4)
                ================================================= */}
                <div className="tfg-card tfg-flight-card">
                    {/* AIRLINE & ROUTE HEADER */}
                    <div className="tfg-flight-header">
                        <div className="tfg-airline-badge">
                            <span className="tfg-airline-icon">✈</span>
                            <div>
                                <strong>{depAirline}</strong>
                                <small>{depFlightNo} • {depClass}</small>
                            </div>
                        </div>
                    </div>

                    <div className="tfg-route-label">
                        <strong>Flight: {depFrom} &mdash; {depTo}</strong>{" "}
                        <span>{duration} • Basic</span>
                    </div>

                    {/* TIMINGS ROW */}
                    <div className="tfg-flight-timings-grid">
                        <div className="tfg-timing-box">
                            <div className="tfg-time-text">
                                <strong>{depTime}</strong> {depDate}
                            </div>
                            <div className="tfg-airport-text">
                                {depFrom} Airport
                            </div>
                        </div>

                        <div className="tfg-duration-box">
                            <Clock size={14} />
                            <span>{duration}</span>
                        </div>

                        <div className="tfg-timing-box">
                            <div className="tfg-time-text">
                                <strong>{arrTime}</strong> {depDate}
                            </div>
                            <div className="tfg-airport-text">
                                {depTo} Airport
                            </div>
                        </div>
                    </div>

                    {/* BAGGAGE INCLUSIONS */}
                    <div className="tfg-baggage-row">
                        <Luggage size={16} />
                        <span>1 cabin bag • 1 checked bag</span>
                    </div>

                    {/* RETURN FLIGHT IF ANY */}
                    {selectedReturn && (
                        <div className="tfg-return-section">
                            <div className="tfg-route-label" style={{ marginTop: "16px" }}>
                                <strong>Return Flight: {selectedReturn.from || selectedReturn.fromCity} &mdash; {selectedReturn.to || selectedReturn.toCity}</strong>
                            </div>
                            <div className="tfg-baggage-row">
                                <span>{selectedReturn.departureDate} | {selectedReturn.departureTime} &rarr; {selectedReturn.arrivalTime}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* =================================================
                    STEP 4: TRAVELLERS CARD (SCREENSHOT 4)
                ================================================= */}
                <div className="tfg-card tfg-travellers-card">
                    <h3>Travellers</h3>
                    <ul className="tfg-travellers-list">
                        {passengers.map((p, idx) => {
                            const title = p.gender === "Female" ? "MS" : "MR";
                            const name = `${p.firstName} ${p.lastName}`.trim() || `Traveler ${idx + 1}`;
                            return (
                                <li key={idx}>
                                    <span className="tfg-bullet">•</span>
                                    <span>{title} {name}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* =================================================
                    STEP 5: ACTION BUTTONS (SCREENSHOT 4)
                ================================================= */}
                <div className="tfg-actions-row">
                    <button
                        type="button"
                        className="tfg-btn tfg-btn-print"
                        onClick={() => window.print()}
                    >
                        <Printer size={17} />
                        <span>Print / Save PDF</span>
                    </button>

                    <a
                        href="tel:+18887526024"
                        className="tfg-btn tfg-btn-help"
                    >
                        <Phone size={17} />
                        <span>Need help? +1-888-752-6024</span>
                    </a>
                </div>

                {/* BACK TO HOME LINK */}
                <div className="tfg-back-link">
                    <button type="button" onClick={() => navigate("/")}>
                        &larr; Book Another Flight
                    </button>
                </div>
            </div>
        </main>
    );
}

export default BookingConfirmation;