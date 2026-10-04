import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plane, Lock, ShieldCheck, Mail, Phone, Award, CheckCircle2 } from "lucide-react";
import PhoneInput from "../Common/PhoneInput";
import { getBookingSession, saveBookingSession } from "../../utils/flightUtils";
import { sendBookingDetailsEmail } from "../../utils/bookingEmailService";
import "./Payment.css";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeState = location.state || getBookingSession()?.state || {};

    const {
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
        searchData = {},
        selectedFromCity,
        selectedToCity,
        passengers: initialPassengers,
        contactInfo: initialContact = {},
        finalTotalPrice: initialPrice,
    } = activeState;

    // =========================================================
    // PASSENGERS STATE (ALL EMPTY BY DEFAULT - USER FILLS)
    // =========================================================
    const [passengers, setPassengers] = useState(() => {
        if (Array.isArray(initialPassengers) && initialPassengers.length > 0) {
            return initialPassengers.map((p) => ({
                title: p.title || "",
                firstName: p.firstName || "",
                middleName: p.middleName || "",
                lastName: p.lastName || "",
                dateOfBirth: p.dateOfBirth || "",
                gender: p.gender || "",
                passengerType: p.passengerType || p.type || "Adult",
            }));
        }
        return [
            {
                title: "",
                firstName: "",
                middleName: "",
                lastName: "",
                dateOfBirth: "",
                gender: "",
                passengerType: "Adult",
            },
        ];
    });
    // =========================================================
    // PAYMENT REQUEST STATE
    // No online payment gateway is used in this flow.
    // =========================================================
    const [paymentMethod, setPaymentMethod] = useState("Manual / Travel Desk");

    // =========================================================
    // BILLING DETAILS STATE (ALL EMPTY BY DEFAULT)
    // =========================================================
    const [billing, setBilling] = useState({
        streetAddress: "",
        country: "United States",
        zipCode: "",
        city: "",
        state: "",
        phone: initialContact.phone || "",
        countryCode: initialContact.countryCode || "+1",
        email: initialContact.email || "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Calculate Prices
    const paxCount = Math.max(passengers.length, 1);
    const baseFarePerPax = Number(selectedDeparture?.price || 360.00);
    const totalBaseFare = baseFarePerPax * paxCount;
    const taxesAndFees = 17.70 * paxCount;
    const computedTotal = initialPrice ? Number(initialPrice) : totalBaseFare + taxesAndFees;

    const originCity =
        selectedFromCity?.cityName ||
        selectedDeparture?.fromCity ||
        selectedDeparture?.from ||
        searchData?.fromCity ||
        "New Delhi";

    const destinationCity =
        selectedToCity?.cityName ||
        selectedDeparture?.toCity ||
        selectedDeparture?.to ||
        searchData?.toCity ||
        "Mumbai";

    // Passenger change
    const handlePassengerChange = (index, field, value) => {
        setPassengers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleClearPassenger = (index) => {
        setPassengers((prev) => {
            const updated = [...prev];
            updated[index] = {
                title: "",
                firstName: "",
                middleName: "",
                lastName: "",
                dateOfBirth: "",
                gender: "",
                passengerType: updated[index].passengerType || "Adult",
            };
            return updated;
        });
    };

    // Billing Change
    const handleBillingChange = (field, value) => {
        setBilling((prev) => ({ ...prev, [field]: value }));
    };

    // =========================================================
    // SUBMIT BOOKING
    // =========================================================
    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        setFormError("");

        // Basic validation
        for (let i = 0; i < passengers.length; i++) {
            if (!passengers[i].firstName.trim() || !passengers[i].lastName.trim()) {
                setFormError(`Please enter First & Last Name for Traveler ${i + 1}`);
                return;
            }
        }

        if (!billing.streetAddress.trim() || !billing.city.trim() || !billing.email.trim() || !billing.phone.trim()) {
            setFormError("Please complete all required Billing Details.");
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(billing.email.trim())) {
            setFormError("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        const bookingRef = "DT" + Math.random().toString(36).substring(2, 8).toUpperCase();

        const bookingPayload = {
            bookingReference: bookingRef,
            flight: selectedDeparture,
            returnFlight: selectedReturn,
            passengers: passengers,
            billing: {
                ...billing,
                phone: `${billing.countryCode || "+1"} ${billing.phone}`,
            },
            payment: {
                method: paymentMethod,
                status: "Payment not processed online",
            },
            totalPrice: computedTotal,
            subtotalPrice: totalBaseFare,
            taxesAndFees: taxesAndFees,
        };

        try {
            // Sends the booking request to the backend.
            // The backend emails the company; no payment gateway is called.
            await sendBookingDetailsEmail(bookingPayload);
        } catch (err) {
            console.warn("Booking request notification error:", err);
        }

        // Save session
        saveBookingSession("/booking-confirmation", {
            bookingReference: bookingRef,
            finalTotalPrice: computedTotal,
            passengers,
            selectedDeparture,
            selectedReturn,
            billingDetails: billing,
        });

        setIsSubmitting(false);

        // Navigate directly to confirmation page
        navigate("/booking-confirmation", {
            state: {
                bookingReference: bookingRef,
                finalTotalPrice: computedTotal,
                passengers,
                selectedDeparture,
                selectedReturn,
                billingDetails: billing,
                status: "PROCESSING",
            },
        });
    };

    return (
        <main className="fn-checkout-page">
            {/* =================================================
                STEP TRACKER (ROYAL BLUE THEME)
            ================================================= */}
            <div className="fn-steps-container">
                <div className="fn-steps-bar">
                    <div className="fn-step-item completed">
                        <span className="fn-step-num">✓</span>
                        <span className="fn-step-text">Flight Selected</span>
                    </div>
                    <div className="fn-step-item active">
                        <span className="fn-step-num">2</span>
                        <span className="fn-step-text">Passenger, Billing & Payment</span>
                    </div>
                    <div className="fn-step-item">
                        <span className="fn-step-num">3</span>
                        <span className="fn-step-text">Confirmation</span>
                    </div>
                </div>
            </div>

            <div className="fn-checkout-layout">
                {/* =================================================
                    LEFT COLUMN: FLIGHT BANNER + FORMS
                ================================================= */}
                <div className="fn-main-col">
                    {/* FLIGHT ROUTE BANNER */}
                    <div className="fn-route-banner">
                        <div className="fn-route-title">
                            <Plane size={22} className="fn-route-icon" />
                            <h2>{originCity} &rarr; {destinationCity}</h2>
                        </div>
                        <div className="fn-route-sub">
                            <span>{selectedDeparture.airline || "British Airways"} • {selectedDeparture.flightClass || "Economy"}</span>
                            <span className="fn-route-dot">•</span>
                            <span>Pax: {passengers.length} {passengers.length > 1 ? "Travelers" : "Adult"}</span>
                        </div>
                    </div>

                    {formError && (
                        <div className="fn-error-banner">
                            {formError}
                        </div>
                    )}

                    {/* PASSENGERS DETAILS CARD */}
                    <section className="fn-card">
                        <div className="fn-card-header">
                            <h2>1. Passenger Details</h2>
                        </div>

                        {passengers.map((p, idx) => (
                            <div key={idx} className="fn-pax-section">
                                <div className="fn-pax-heading">
                                    <h3>{idx + 1}. {p.passengerType || "Adult"}</h3>
                                    <button
                                        type="button"
                                        className="fn-clear-btn"
                                        onClick={() => handleClearPassenger(idx)}
                                    >
                                        🗑 Clear
                                    </button>
                                </div>

                                <div className="fn-form-grid">
                                    <div className="fn-floating-field">
                                        <input
                                            type="text"
                                            id={`pax-fn-${idx}`}
                                            value={p.firstName}
                                            placeholder="First Name *"
                                            onChange={(e) => handlePassengerChange(idx, "firstName", e.target.value)}
                                            required
                                        />
                                        <label htmlFor={`pax-fn-${idx}`}>First Name*</label>
                                    </div>

                                    <div className="fn-floating-field">
                                        <input
                                            type="text"
                                            id={`pax-mn-${idx}`}
                                            value={p.middleName}
                                            placeholder="Middle Name"
                                            onChange={(e) => handlePassengerChange(idx, "middleName", e.target.value)}
                                        />
                                        <label htmlFor={`pax-mn-${idx}`}>Middle Name</label>
                                    </div>

                                    <div className="fn-floating-field">
                                        <input
                                            type="text"
                                            id={`pax-ln-${idx}`}
                                            value={p.lastName}
                                            placeholder="Last Name *"
                                            onChange={(e) => handlePassengerChange(idx, "lastName", e.target.value)}
                                            required
                                        />
                                        <label htmlFor={`pax-ln-${idx}`}>Last Name*</label>
                                    </div>

                                    <div className="fn-floating-field">
                                        <input
                                            type="date"
                                            id={`pax-dob-${idx}`}
                                            value={p.dateOfBirth}
                                            onChange={(e) => handlePassengerChange(idx, "dateOfBirth", e.target.value)}
                                            required
                                        />
                                        <label htmlFor={`pax-dob-${idx}`}>Date Of Birth*</label>
                                    </div>

                                    <div className="fn-floating-field">
                                        <select
                                            id={`pax-gender-${idx}`}
                                            value={p.gender}
                                            onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <label htmlFor={`pax-gender-${idx}`}>Gender*</label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* PAYMENT REQUEST CARD */}
                    <section className="fn-card">
                        <div className="fn-card-header">
                            <h2>2. Payment Details</h2>
                            <p className="fn-card-subhead">
                                No online payment gateway is used. Our travel desk will contact you for payment.
                            </p>
                        </div>

                        <div className="fn-form-grid">
                            <div className="fn-floating-field fn-full-col">
                                <select
                                    id="payment-method-select"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="Manual / Travel Desk">
                                        Manual / Travel Desk
                                    </option>
                                    <option value="Pay by Phone">
                                        Pay by Phone
                                    </option>
                                    <option value="Bank Transfer">
                                        Bank Transfer
                                    </option>
                                </select>
                                <label htmlFor="payment-method-select">Payment Method*</label>
                            </div>
                        </div>

                        <div className="fn-card-trust-badges">
                            <span>🔒 No card details are stored</span>
                            <span>• No online gateway</span>
                            <span>• Payment handled by Travel Desk</span>
                        </div>
                    </section>

                    {/* BILLING ADDRESS CARD */}
                    <section className="fn-card">
                        <div className="fn-card-header">
                            <h2>3. Billing Details</h2>
                            <p className="fn-card-subhead">Address where tickets and statements are sent</p>
                        </div>

                        <div className="fn-form-grid">
                            <div className="fn-floating-field fn-full-col">
                                <input
                                    type="text"
                                    id="bill-street"
                                    value={billing.streetAddress}
                                    placeholder="Street Address *"
                                    onChange={(e) => handleBillingChange("streetAddress", e.target.value)}
                                    required
                                />
                                <label htmlFor="bill-street">Street Address*</label>
                            </div>

                            <div className="fn-floating-field">
                                <select
                                    id="bill-country"
                                    value={billing.country}
                                    onChange={(e) => handleBillingChange("country", e.target.value)}
                                >
                                    <option value="United States">United States</option>
                                    <option value="India">India</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Australia">Australia</option>
                                </select>
                                <label htmlFor="bill-country">Country*</label>
                            </div>

                            <div className="fn-floating-field">
                                <input
                                    type="text"
                                    id="bill-zip"
                                    value={billing.zipCode}
                                    placeholder="Zip / Postal Code *"
                                    onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                                    required
                                />
                                <label htmlFor="bill-zip">Zip / Postal Code*</label>
                            </div>

                            <div className="fn-floating-field">
                                <input
                                    type="text"
                                    id="bill-city"
                                    value={billing.city}
                                    placeholder="City *"
                                    onChange={(e) => handleBillingChange("city", e.target.value)}
                                    required
                                />
                                <label htmlFor="bill-city">City*</label>
                            </div>

                            <div className="fn-floating-field">
                                <input
                                    type="text"
                                    id="bill-state"
                                    value={billing.state}
                                    placeholder="State *"
                                    onChange={(e) => handleBillingChange("state", e.target.value)}
                                    required
                                />
                                <label htmlFor="bill-state">State*</label>
                            </div>

                            <div className="fn-floating-field">
                                <PhoneInput
                                    countryCode={billing.countryCode || "+1"}
                                    onCountryCodeChange={(code) => handleBillingChange("countryCode", code)}
                                    value={billing.phone}
                                    onChange={(e) => handleBillingChange("phone", e.target.value)}
                                    placeholder="Billing Phone *"
                                    name="billingPhone"
                                />
                            </div>

                            <div className="fn-floating-field">
                                <input
                                    type="email"
                                    id="bill-email"
                                    value={billing.email}
                                    placeholder="Billing Email *"
                                    onChange={(e) => handleBillingChange("email", e.target.value)}
                                    required
                                />
                                <label htmlFor="bill-email">Billing Email*</label>
                            </div>
                        </div>
                    </section>

                    {/* POLICY CHECKBOXES */}
                    <div className="fn-policy-box">
                        <label className="fn-checkbox-label">
                            <input type="checkbox" defaultChecked required />
                            <span>
                                I have read and agree to the Fare Rules, Terms and Conditions, and Privacy Policy.
                            </span>
                        </label>
                    </div>

                    {/* PAY NOW BUTTON */}
                    <button
                        type="button"
                        className="fn-pay-now-btn"
                        onClick={handleSubmitBooking}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span>Confirming & Booking Flight...</span>
                        ) : (
                            <span>REQUEST BOOKING — ${computedTotal.toFixed(2)} USD</span>
                        )}
                    </button>
                </div>

                {/* =================================================
                    RIGHT COLUMN: PRICE BREAKDOWN & EXPERT HELP
                ================================================= */}
                <div className="fn-sidebar-col">
                    {/* PRICE SUMMARY CARD */}
                    <div className="fn-sidebar-card">
                        <div className="fn-card-header">
                            <h2>Price Summary</h2>
                        </div>

                        <div className="fn-price-table">
                            <div className="fn-price-row">
                                <span>Travelers ({paxCount})</span>
                                <span>${totalBaseFare.toFixed(2)}</span>
                            </div>
                            <div className="fn-price-row">
                                <span>Taxes & Carrier Fees</span>
                                <span>${taxesAndFees.toFixed(2)}</span>
                            </div>

                            <div className="fn-price-divider"></div>

                            <div className="fn-price-total-row">
                                <div>
                                    <strong>Total Amount</strong>
                                    <span className="fn-price-sub">All taxes included</span>
                                </div>
                                <strong className="fn-total-price-tag">
                                    ${computedTotal.toFixed(2)} USD
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* EXPERT HELP BOX */}
                    <div className="fn-sidebar-card fn-help-card">
                        <div className="fn-help-header">
                            <Phone size={22} className="fn-help-phone-icon" />
                            <div>
                                <h3>Need Assistance?</h3>
                                <p>Call our flight booking specialist</p>
                            </div>
                        </div>
                        <a href="tel:8887526024" className="fn-help-phone-number">
                            (888) 752-6024
                        </a>
                        <span className="fn-help-badge">24/7 Available • Toll-Free</span>
                    </div>

                    {/* TRUST BOX */}
                    <div className="fn-sidebar-card fn-trust-card">
                        <div className="fn-trust-item">
                            <ShieldCheck size={18} color="#2563eb" />
                            <span>Safe & Secure 256-Bit SSL Checkout</span>
                        </div>
                        <div className="fn-trust-item">
                            <Award size={18} color="#2563eb" />
                            <span>100% Booking Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Payment;