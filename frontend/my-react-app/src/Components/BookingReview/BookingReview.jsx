import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "../Common/PhoneInput";
import "./BookingReview.css";

function BookingReview() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
        passengers = [],
        contactInfo,
        pricing,
        selectedSeats: initialSeats = {},
        totalSeatCharges: initialSeatCharges = 0,
    } = location.state || {};

    // =========================================================
    // HUB STATE
    // =========================================================

    const [editablePassengers, setEditablePassengers] = useState(passengers);
    const [editingIndex, setEditingIndex] = useState(null);
    const [tempPassenger, setTempPassenger] = useState(null);

    const [editableContactInfo, setEditableContactInfo] = useState(
        contactInfo || {
            email: "",
            phone: "",
            countryCode: "+1",
        }
    );
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [tempContactInfo, setTempContactInfo] = useState({
        email: "",
        phone: "",
        countryCode: "+1",
    });

    const [editErrors, setEditErrors] = useState({});

    // Dynamic Hub seats and add-ons
    const [currentSelectedSeats, setCurrentSelectedSeats] = useState(
        initialSeats || {}
    );


    /* =========================================================
       SESSION CHECK
    ========================================================= */

    if (
        !searchData ||
        !selectedDeparture ||
        !passengers.length
    ) {
        return (
            <main className="booking-review-page">
                <div className="review-error-card">
                    <h2>Session Expired</h2>

                    <p>
                        We could not retrieve your booking
                        details. Please start your flight search
                        again.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Go to Search
                    </button>
                </div>
            </main>
        );
    }

    /* =========================================================
       EDIT PASSENGER
    ========================================================= */

    const handleStartEditPassenger = (index) => {
        setEditingIndex(index);
        setTempPassenger({
            ...editablePassengers[index],
        });
        setEditErrors({});
    };

    const handlePassengerInputChange = (field, value) => {
        let sanitizedValue = value;

        if (field === "dateOfBirth" && sanitizedValue) {
            const parts = sanitizedValue.split("-");
            if (parts[0] && parts[0].length > 4) {
                parts[0] = parts[0].slice(0, 4);
                sanitizedValue = parts.join("-");
            }
        }

        setTempPassenger((prev) => ({
            ...prev,
            [field]: sanitizedValue,
        }));

        setEditErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const handleSavePassenger = (index) => {
        const errors = {};

        if (!tempPassenger?.firstName?.trim()) {
            errors.firstName = "First name is required.";
        } else if (!/^[a-zA-Z]+$/.test(tempPassenger.firstName.trim())) {
            errors.firstName = "Only letters are allowed.";
        }

        if (!tempPassenger?.lastName?.trim()) {
            errors.lastName = "Last name is required.";
        } else if (!/^[a-zA-Z]+$/.test(tempPassenger.lastName.trim())) {
            errors.lastName = "Only letters are allowed.";
        }

        if (!tempPassenger?.gender) {
            errors.gender = "Gender is required.";
        }

        if (!tempPassenger?.dateOfBirth) {
            errors.dateOfBirth = "DOB is required.";
        } else {
            const dobParts = tempPassenger.dateOfBirth.split("-");
            const birthYear = parseInt(dobParts[0], 10);
            const todayStr = new Date().toISOString().split("T")[0];
            const currentYear = new Date().getFullYear();

            if (
                dobParts[0].length !== 4 ||
                isNaN(birthYear) ||
                birthYear < 1900 ||
                birthYear > currentYear
            ) {
                errors.dateOfBirth = "Year must be a valid 4-digit year.";
            } else if (tempPassenger.dateOfBirth > todayStr) {
                errors.dateOfBirth = "Date of birth cannot be in the future.";
            }
        }

        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            return;
        }

        const updated = [...editablePassengers];
        updated[index] = {
            ...tempPassenger,
        };

        setEditablePassengers(updated);
        setEditingIndex(null);
        setTempPassenger(null);
        setEditErrors({});
    };

    const handleCancelEditPassenger = () => {
        setEditingIndex(null);
        setTempPassenger(null);
        setEditErrors({});
    };

    /* =========================================================
       EDIT CONTACT
    ========================================================= */

    const handleStartEditContact = () => {
        setIsEditingContact(true);
        setTempContactInfo({
            ...editableContactInfo,
        });
        setEditErrors({});
    };

    const handleContactInputChange = (field, value) => {
        setTempContactInfo((prev) => ({
            ...prev,
            [field]: value,
        }));

        setEditErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const handleSaveContact = () => {
        const errors = {};

        if (!tempContactInfo.email?.trim()) {
            errors.email = "Email is required.";
        } else if (
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                tempContactInfo.email.trim()
            )
        ) {
            errors.email = "Please enter a valid email address.";
        }

        const cleanPhone = (tempContactInfo.phone || "").trim().replace(/[\s-]/g, "");
        if (!cleanPhone) {
            errors.phone = "Phone number is required.";
        } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
            errors.phone = "Please enter a valid phone number (7-15 digits).";
        }

        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            return;
        }

        setEditableContactInfo({
            ...tempContactInfo,
            countryCode: tempContactInfo.countryCode || "+1",
            fullPhone: `${tempContactInfo.countryCode || "+1"} ${(tempContactInfo.phone || "").trim()}`,
        });

        setIsEditingContact(false);
        setEditErrors({});
    };

    const handleCancelEditContact = () => {
        setIsEditingContact(false);
        setEditErrors({});
    };

    /* =========================================================
       SEAT HELPERS
    ========================================================= */

    const getSeatObject = (index, type) => {
        const key = `${index}-${type}`;
        const seat = currentSelectedSeats?.[key];

        if (!seat) {
            return null;
        }

        if (typeof seat === "object") {
            return seat;
        }

        return {
            designator: String(seat),
            serviceId: "",
            price: 0,
            currency: "USD",
        };
    };

    const getPassengerSeat = (index, type) => {
        const seat = getSeatObject(index, type);
        if (!seat) {
            return null;
        }
        return seat.designator || seat.seat || null;
    };

    const getSeatPrice = (index, type) => {
        const seat = getSeatObject(index, type);
        if (!seat) return 0;

        let price = 0;
        if (typeof seat.price === "number" || typeof seat.price === "string") {
            price = Number(seat.price);
        } else if (seat.price && typeof seat.price === "object") {
            price = Number(seat.price.amount || seat.price.value || 0);
        } else if (seat.total_amount && typeof seat.total_amount === "object") {
            price = Number(seat.total_amount.amount || 0);
        } else if (seat.amount !== undefined) {
            price = Number(seat.amount);
        }

        return Number.isFinite(price) ? price : 0;
    };

    const getSeatCurrency = (index, type) => {
        const seat = getSeatObject(index, type);
        return seat?.currency || seat?.total_currency || "USD";
    };

    const formatPrice = (price) => {
        const numericPrice = Number(price || 0);
        return Number.isFinite(numericPrice)
            ? numericPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            : "0.00";
    };

    // Calculate live seat charges from currentSelectedSeats
    const calculatedSeatCharges = editablePassengers.reduce((total, _, index) => {
        const departurePrice = getSeatPrice(index, "departure");
        const returnPrice = selectedReturn ? getSeatPrice(index, "return") : 0;
        return total + departurePrice + returnPrice;
    }, 0);

    const hasAnySeatsSelected = editablePassengers.some((_, index) => {
        return (
            Boolean(getPassengerSeat(index, "departure")) ||
            Boolean(selectedReturn && getPassengerSeat(index, "return"))
        );
    });

    const flightFare = Number(pricing?.grandTotalPrice || 0);

    const grandTotalPrice = flightFare;

    /* =========================================================
       HUB NAVIGATION ACTIONS
    ========================================================= */

    const buildHubState = () => {
        const cleanSeats = {};

        Object.keys(currentSelectedSeats || {}).forEach((key) => {
            const seat = currentSelectedSeats[key];
            if (!seat) return;

            if (typeof seat === "object") {
                cleanSeats[key] = {
                    designator: seat.designator || seat.seat || "",
                    serviceId: seat.serviceId || "",
                    price: Number(seat.price || 0),
                    currency: seat.currency || "USD",
                };
            } else {
                cleanSeats[key] = {
                    designator: String(seat),
                    serviceId: "",
                    price: 0,
                    currency: "USD",
                };
            }
        });

        return {
            selectedDeparture,
            selectedReturn,
            searchData,
            selectedFromCity,
            selectedToCity,

            passengers: editablePassengers,
            contactInfo: editableContactInfo,
            pricing,

            selectedSeats: cleanSeats,
            totalSeatCharges: calculatedSeatCharges,

            finalTotalPrice: grandTotalPrice,
        };
    };

    // Sub-Flow: Seat Selection Modal/Page
    const handleSelectSeats = () => {
        navigate("/seat-selection", {
            state: buildHubState(),
        });
    };

    // Reset Seats to Auto-Assigned Free Seats
    const handleResetSeats = () => {
        setCurrentSelectedSeats({});
    };

    // Back to Traveler Details
    const handleBackToTravelerDetails = () => {
        navigate("/flight-details", {
            state: {
                selectedDeparture,
                selectedReturn,
                searchData,
                selectedFromCity,
                selectedToCity,
                passengers: editablePassengers,
                contactInfo: editableContactInfo,
                pricing,
            },
        });
    };

    // Proceed to Payment
    const handleContinuePayment = () => {
        const paymentState = buildHubState();
        console.log("PROCEED TO PAYMENT STATE:", paymentState);

        navigate("/payment", {
            state: paymentState,
        });
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <main className="booking-review-page">

            {/* =================================================
                PROGRESS (Option B: 4 Steps)
            ================================================= */}

            <div className="review-progress-container">
                <div className="review-progress">
                    <div className="review-progress-step completed">
                        <div className="review-progress-number">✓</div>
                        <span>Flight Selection</span>
                    </div>

                    <div className="review-progress-line completed-line"></div>

                    <div className="review-progress-step completed">
                        <div className="review-progress-number">✓</div>
                        <span>Traveler Details</span>
                    </div>

                    <div className="review-progress-line active-line"></div>

                    <div className="review-progress-step active">
                        <div className="review-progress-number">3</div>
                        <span>Review Booking</span>
                    </div>

                    <div className="review-progress-line"></div>

                    <div className="review-progress-step">
                        <div className="review-progress-number">4</div>
                        <span>Payment</span>
                    </div>
                </div>
            </div>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="booking-review-header">
                <h1>Review Your Booking</h1>
                <p>
                    Review your itinerary and passenger details below before payment.
                </p>
            </div>

            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div className="booking-review-layout">

                {/* =================================================
                    LEFT SECTION (MAIN HUB CONTENT)
                ================================================= */}

                <section className="review-main-section">

                    {/* FLIGHT DETAILS */}
                    <div className="review-card">
                        <div className="review-card-heading">
                            <div className="review-heading-icon">✈️</div>
                            <div>
                                <h2>Flight Itinerary</h2>
                                <p>Your selected flight schedule</p>
                            </div>
                        </div>

                        {/* DEPARTURE */}
                        <div className="review-flight-block">
                            <span className="review-flight-tag">DEPARTURE</span>

                            <div className="review-flight-top">
                                <div>
                                    <strong>{selectedDeparture?.airline || "—"}</strong>
                                    <span>{selectedDeparture?.flightNumber || "—"}</span>
                                </div>
                                <span className="review-class">
                                    {searchData?.flightClass || "Economy"}
                                </span>
                            </div>

                            <div className="review-route">
                                <div>
                                    <strong>{selectedDeparture?.from || "—"}</strong>
                                    <span>{selectedDeparture?.departureTime || "—"}</span>
                                    <small>{selectedDeparture?.departureDate || "—"}</small>
                                </div>

                                <div className="review-arrow">→</div>

                                <div>
                                    <strong>{selectedDeparture?.to || "—"}</strong>
                                    <span>{selectedDeparture?.arrivalTime || "—"}</span>
                                    <small>
                                        {selectedDeparture?.arrivalDate ||
                                            selectedDeparture?.departureDate ||
                                            "—"}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* RETURN */}
                        {selectedReturn && (
                            <div className="review-flight-block return-flight-review">
                                <span className="review-flight-tag return-review-tag">RETURN</span>

                                <div className="review-flight-top">
                                    <div>
                                        <strong>{selectedReturn?.airline || "—"}</strong>
                                        <span>{selectedReturn?.flightNumber || "—"}</span>
                                    </div>
                                    <span className="review-class">
                                        {searchData?.flightClass || "Economy"}
                                    </span>
                                </div>

                                <div className="review-route">
                                    <div>
                                        <strong>{selectedReturn?.from || "—"}</strong>
                                        <span>{selectedReturn?.departureTime || "—"}</span>
                                        <small>{selectedReturn?.departureDate || "—"}</small>
                                    </div>

                                    <div className="review-arrow">→</div>

                                    <div>
                                        <strong>{selectedReturn?.to || "—"}</strong>
                                        <span>{selectedReturn?.arrivalTime || "—"}</span>
                                        <small>
                                            {selectedReturn?.arrivalDate ||
                                                selectedReturn?.departureDate ||
                                                "—"}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* =================================================
                        PASSENGERS
                    ================================================= */}

                    <div className="review-card">
                        <div className="review-card-heading">
                            <div className="review-heading-icon">👤</div>
                            <div>
                                <h2>Passenger Details</h2>
                                <p>Verified traveler information</p>
                            </div>
                        </div>

                        <div className="review-passenger-list">
                            {editablePassengers.map((passenger, index) => {
                                const isEditing = editingIndex === index;

                                return (
                                    <div className="review-passenger" key={index}>
                                        <div className="passenger-review-title">
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <strong>{passenger?.label || `Passenger ${index + 1}`}</strong>
                                                <span>{passenger?.passengerType || ""}</span>
                                            </div>

                                            {!isEditing && (
                                                <button
                                                    type="button"
                                                    className="edit-passenger-btn"
                                                    onClick={() => handleStartEditPassenger(index)}
                                                >
                                                    ✏️ Edit
                                                </button>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <div className="passenger-edit-form">
                                                <div className="passenger-edit-grid">
                                                    <div className="edit-field">
                                                        <label>First Name*</label>
                                                        <input
                                                            type="text"
                                                            value={tempPassenger?.firstName || ""}
                                                            onChange={(e) =>
                                                                handlePassengerInputChange("firstName", e.target.value)
                                                            }
                                                            className={editErrors.firstName ? "input-err" : ""}
                                                        />
                                                        {editErrors.firstName && (
                                                            <span className="err-msg">{editErrors.firstName}</span>
                                                        )}
                                                    </div>

                                                    <div className="edit-field">
                                                        <label>Last Name*</label>
                                                        <input
                                                            type="text"
                                                            value={tempPassenger?.lastName || ""}
                                                            onChange={(e) =>
                                                                handlePassengerInputChange("lastName", e.target.value)
                                                            }
                                                            className={editErrors.lastName ? "input-err" : ""}
                                                        />
                                                        {editErrors.lastName && (
                                                            <span className="err-msg">{editErrors.lastName}</span>
                                                        )}
                                                    </div>

                                                    <div className="edit-field">
                                                        <label>Gender*</label>
                                                        <select
                                                            value={tempPassenger?.gender || ""}
                                                            onChange={(e) =>
                                                                handlePassengerInputChange("gender", e.target.value)
                                                            }
                                                            className={editErrors.gender ? "input-err" : ""}
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        {editErrors.gender && (
                                                            <span className="err-msg">{editErrors.gender}</span>
                                                        )}
                                                    </div>

                                                    <div className="edit-field">
                                                        <label>Date of Birth*</label>
                                                        <input
                                                            type="date"
                                                            min="1900-01-01"
                                                            max={new Date().toISOString().split("T")[0]}
                                                            value={tempPassenger?.dateOfBirth || ""}
                                                            onInput={(e) => {
                                                                if (e.target.value) {
                                                                    const parts = e.target.value.split("-");
                                                                    if (parts[0] && parts[0].length > 4) {
                                                                        parts[0] = parts[0].slice(0, 4);
                                                                        e.target.value = parts.join("-");
                                                                        handlePassengerInputChange("dateOfBirth", e.target.value);
                                                                    }
                                                                }
                                                            }}
                                                            onChange={(e) =>
                                                                handlePassengerInputChange("dateOfBirth", e.target.value)
                                                            }
                                                            className={editErrors.dateOfBirth ? "input-err" : ""}
                                                        />
                                                        {editErrors.dateOfBirth && (
                                                            <span className="err-msg">{editErrors.dateOfBirth}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="passenger-edit-actions">
                                                    <button
                                                        type="button"
                                                        className="passenger-cancel-btn"
                                                        onClick={handleCancelEditPassenger}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="passenger-save-btn"
                                                        onClick={() => handleSavePassenger(index)}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="passenger-review-grid">
                                                <div>
                                                    <label>Full Name</label>
                                                    <span>
                                                        {passenger?.firstName || ""} {passenger?.lastName || ""}
                                                    </span>
                                                </div>

                                                <div>
                                                    <label>Gender</label>
                                                    <span>{passenger?.gender || "—"}</span>
                                                </div>

                                                <div>
                                                    <label>Date of Birth</label>
                                                    <span>{passenger?.dateOfBirth || "—"}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* =================================================
                        CONTACT DETAILS
                    ================================================= */}

                    <div className="review-card">
                        <div
                            className="review-card-heading"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
                                <div className="review-heading-icon">📞</div>
                                <div>
                                    <h2>Contact Details</h2>
                                    <p>Booking confirmation & E-ticket will be sent here</p>
                                </div>
                            </div>

                            {!isEditingContact && (
                                <button
                                    type="button"
                                    className="edit-passenger-btn"
                                    onClick={handleStartEditContact}
                                >
                                    ✏️ Edit
                                </button>
                            )}
                        </div>

                        {isEditingContact ? (
                            <div className="passenger-edit-form">
                                <div
                                    className="passenger-edit-grid"
                                    style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                                >
                                    <div className="edit-field">
                                        <label>Email*</label>
                                        <input
                                            type="email"
                                            value={tempContactInfo.email || ""}
                                            onChange={(e) =>
                                                handleContactInputChange("email", e.target.value)
                                            }
                                            className={editErrors.email ? "input-err" : ""}
                                        />
                                        {editErrors.email && (
                                            <span className="err-msg">{editErrors.email}</span>
                                        )}
                                    </div>

                                    <div className="edit-field">
                                        <label>Phone*</label>
                                        <PhoneInput
                                            countryCode={tempContactInfo.countryCode || "+1"}
                                            onCountryCodeChange={(code) => {
                                                setTempContactInfo((prev) => ({
                                                    ...prev,
                                                    countryCode: code,
                                                }));
                                            }}
                                            value={tempContactInfo.phone || ""}
                                            onChange={(e) =>
                                                handleContactInputChange("phone", e.target.value)
                                            }
                                            name="phone"
                                            placeholder="Phone number"
                                            error={editErrors.phone}
                                        />
                                        {editErrors.phone && (
                                            <span className="err-msg">{editErrors.phone}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="passenger-edit-actions">
                                    <button
                                        type="button"
                                        className="passenger-cancel-btn"
                                        onClick={handleCancelEditContact}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="passenger-save-btn"
                                        onClick={handleSaveContact}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="review-contact-grid">
                                <div>
                                    <label>Email</label>
                                    <span>{editableContactInfo?.email || "—"}</span>
                                </div>

                                <div>
                                    <label>Phone</label>
                                    <span>
                                        {editableContactInfo?.countryCode ? `${editableContactInfo.countryCode} ` : ""}
                                        {editableContactInfo?.phone || "—"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                </section>

                {/* =================================================
                    FULL WIDTH FARE SUMMARY
                ================================================= */}

                {/* =================================================
                    RIGHT SUMMARY (SIDEBAR)
                ================================================= */}

                <section className="review-summary-section full-width-fare-summary">

                    <div className="review-summary-card">
                        <h3>Fare Summary</h3>

                        <div className="review-price-row">
                            <span>Flight Base Fare & Taxes</span>
                            <span>${formatPrice(flightFare)}</span>
                        </div>


                        <hr />

                        <div className="review-total-row">
                            <span>Total Amount</span>
                            <strong>${formatPrice(grandTotalPrice)}</strong>
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <button
                        type="button"
                        className="proceed-payment-btn"
                        onClick={handleContinuePayment}
                    >
                        Proceed to Payment
                        <span>→</span>
                    </button>

                    <button
                        type="button"
                        className="back-addons-btn"
                        onClick={handleBackToTravelerDetails}
                    >
                        ← Back to Traveler Details
                    </button>

                </section>

            </div>

        </main>
    );
}

export default BookingReview;
