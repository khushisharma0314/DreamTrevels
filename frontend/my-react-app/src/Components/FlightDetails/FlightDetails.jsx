import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plane, Lock, ShieldCheck, Mail, Phone, Award, CheckCircle2, AlertCircle, Sparkles, CreditCard, ChevronRight } from "lucide-react";
import PhoneInput from "../Common/PhoneInput";
import {
    detectIsInternational,
    saveBookingSession,
    getBookingSession
} from "../../utils/flightUtils";
import { sendBookingDetailsEmail } from "../../utils/bookingEmailService";
import userDetailsBg from "../../assets/userdetails.png";
import "./FlightDetails.css";

function FlightDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    const sessionState = getBookingSession()?.state || {};
    const locationState = location.state || {};

    const activeState = {
        ...sessionState,
        ...locationState,
    };

    const {
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
    } = activeState;

    const adults = Math.max(1, Number(searchData?.adults || 1));
    const children = Number(searchData?.children || 0);
    const infants = Number(searchData?.infants || 0);
    const totalPassengersCount = adults + children + infants;

    // International Flight Check
    const isInternational = detectIsInternational(
        selectedFromCity,
        selectedToCity,
        searchData,
        selectedDeparture
    );

    // =========================================================
    // 1. PASSENGERS STATE (ALL EMPTY BY DEFAULT - USER FILLS)
    // =========================================================
    const [passengers, setPassengers] = useState(() => {
        const list = [];
        for (let i = 0; i < adults; i++) {
            list.push({
                title: "",
                firstName: "",
                middleName: "",
                lastName: "",
                gender: "",
                dateOfBirth: "",
                passengerType: "ADULT",
                label: `Adult ${i + 1}`,
                nationality: "",
                passportNumber: "",
                passportExpiry: "",
                passportIssuingCountry: "",
            });
        }
        for (let i = 0; i < children; i++) {
            list.push({
                title: "",
                firstName: "",
                middleName: "",
                lastName: "",
                gender: "",
                dateOfBirth: "",
                passengerType: "CHILD",
                label: `Child ${i + 1}`,
                nationality: "",
                passportNumber: "",
                passportExpiry: "",
                passportIssuingCountry: "",
            });
        }
        for (let i = 0; i < infants; i++) {
            list.push({
                title: "",
                firstName: "",
                middleName: "",
                lastName: "",
                gender: "",
                dateOfBirth: "",
                passengerType: "INFANT",
                label: `Infant ${i + 1}`,
                nationality: "",
                passportNumber: "",
                passportExpiry: "",
                passportIssuingCountry: "",
            });
        }
        return list;
    });

    // =========================================================
    // 2. BILLING & CONTACT STATE (ALL EMPTY BY DEFAULT)
    // =========================================================
    const [billing, setBilling] = useState({
        streetAddress: "",
        country: "United States",
        zipCode: "",
        city: "",
        state: "",
        phone: "",
        countryCode: "+1",
        email: "",
    });

    // =========================================================
    // 3. PAYMENT DETAILS STATE (ALL EMPTY BY DEFAULT)
    // =========================================================
    const [payment, setPayment] = useState({
        cardType: "Visa",
        cardNumber: "",
        nameOnCard: "",
        cardExpiry: "",
        cardCvv: "",
    });

    // Promo & Validation State
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [customPromoInput, setCustomPromoInput] = useState("");
    const [promoFeedback, setPromoFeedback] = useState({ error: "", success: "" });
    const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Available Travel Offers
    const availableOffers = [
        {
            code: "FLYHIGH15",
            title: "Instant Flight Savings",
            discount: 15,
            minBooking: 50,
            desc: "Get $15 off on all domestic & international bookings",
            tag: "POPULAR",
        },
        {
            code: "DREAM25",
            title: "Special Traveler Discount",
            discount: 25,
            minBooking: 100,
            desc: "Save $25 on bookings over $100",
            tag: "BEST VALUE",
        },
        {
            code: "GLOBAL40",
            title: "International Explorer Deal",
            discount: 40,
            minBooking: 150,
            desc: "Save $40 on all long-haul international flights",
            tag: "LIMITED TIME",
        },
    ];

    /* =========================================================
       USD PRICE CALCULATIONS
    ========================================================= */
    const toUSD = (val) => {
        const num = Number(val || 0);
        return Number.isFinite(num) ? num : 0;
    };

    const depPriceUSD = selectedDeparture ? toUSD(selectedDeparture.price) : 360;
    const retPriceUSD = selectedReturn ? toUSD(selectedReturn.price) : 0;
    const basePricePerPersonUSD = depPriceUSD + retPriceUSD;

    const totalBasePrice = Math.round(basePricePerPersonUSD * totalPassengersCount * 100) / 100;
    const taxesAndFees = Math.round((totalBasePrice * 0.12 + 14 * totalPassengersCount) * 100) / 100;
    const subtotalPrice = Math.round((totalBasePrice + taxesAndFees) * 100) / 100;

    const promoDiscountAmount = Number(appliedPromo?.discountAmount || 0);
    const grandTotalPrice = Math.max(0, Math.round((subtotalPrice - promoDiscountAmount) * 100) / 100);

    const formatUSD = (amount) => {
        return `$${Number(amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    /* =========================================================
       SESSION CHECK
    ========================================================= */
    if (!searchData || !selectedDeparture) {
        return (
            <main className="flight-details-page">
                <div className="details-error-card">
                    <h2>Flight Selection Required</h2>
                    <p>We could not find your selected flight. Please select a flight from our search results.</p>
                    <button type="button" className="custom-proceed-btn" onClick={() => navigate("/")}>
                        Search Flights
                    </button>
                </div>
            </main>
        );
    }

    /* =========================================================
       HANDLERS: CHANGE FLIGHTS
    ========================================================= */
    const handleChangeDeparture = () => {
        navigate("/flight-results", {
            state: {
                searchData,
                selectedFromCity,
                selectedToCity,
                selectedDeparture: null,
                selectedReturn: selectedReturn || null,
                changeFlight: "departure",
            },
        });
    };

    const handleChangeReturn = () => {
        navigate("/flight-results", {
            state: {
                searchData,
                selectedFromCity,
                selectedToCity,
                selectedDeparture,
                selectedReturn: null,
                changeFlight: "return",
            },
        });
    };

    /* =========================================================
       HANDLERS: PASSENGER FIELDS
    ========================================================= */
    const handlePassengerChange = (index, field, value) => {
        let sanitizedValue = value;
        if (field === "dateOfBirth" && sanitizedValue) {
            const parts = sanitizedValue.split("-");
            const currentYear = new Date().getFullYear();
            if (parts[0]) {
                if (parts[0].length > 4) parts[0] = parts[0].slice(0, 4);
                const yr = parseInt(parts[0], 10);
                if (!isNaN(yr) && parts[0].length === 4 && yr > currentYear) {
                    parts[0] = String(currentYear);
                }
                sanitizedValue = parts.join("-");
            }
        } else if ((field === "firstName" || field === "lastName" || field === "middleName") && sanitizedValue) {
            sanitizedValue = sanitizedValue.replace(/[^A-Za-z\s'-]/g, "");
        }

        setPassengers((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: sanitizedValue,
            };
            return updated;
        });

        setErrors((prev) => ({
            ...prev,
            [`p_${index}_${field}`]: "",
        }));
    };

    /* =========================================================
       HANDLERS: BILLING FIELDS
    ========================================================= */
    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBilling((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [`billing_${name}`]: "",
        }));
    };

    /* =========================================================
       HANDLERS: PAYMENT FIELDS (FORMATTING & INPUT)
    ========================================================= */
    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPayment((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [`payment_${name}`]: "",
        }));
    };

    // Format Card Number (XXXX XXXX XXXX XXXX)
    const handleCardNumberInput = (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 16) val = val.slice(0, 16);
        const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
        setPayment((prev) => ({ ...prev, cardNumber: formatted }));
        setErrors((prev) => ({ ...prev, payment_cardNumber: "" }));
    };

    // Format Expiry (MM/YY)
    const handleExpiryInput = (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 4) val = val.slice(0, 4);
        let formatted = val;
        if (val.length >= 3) {
            formatted = `${val.slice(0, 2)}/${val.slice(2)}`;
        }
        setPayment((prev) => ({ ...prev, cardExpiry: formatted }));
        setErrors((prev) => ({ ...prev, payment_cardExpiry: "" }));
    };

    // Format CVV (3 or 4 digits)
    const handleCvvInput = (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 4) val = val.slice(0, 4);
        setPayment((prev) => ({ ...prev, cardCvv: val }));
        setErrors((prev) => ({ ...prev, payment_cardCvv: "" }));
    };

    /* =========================================================
       PROMO CODES
    ========================================================= */
    const handleApplyOffer = (offer) => {
        if (subtotalPrice < (offer.minBooking || 0)) {
            setPromoFeedback({
                error: `Minimum booking of ${formatUSD(offer.minBooking)} required for code ${offer.code}.`,
                success: "",
            });
            return;
        }

        setAppliedPromo({
            code: offer.code,
            title: offer.title,
            discountAmount: offer.discount,
        });

        setPromoFeedback({
            error: "",
            success: `Promo ${offer.code} applied! Saved ${formatUSD(offer.discount)}.`,
        });

        setTimeout(() => {
            setIsOffersModalOpen(false);
            setPromoFeedback({ error: "", success: "" });
        }, 800);
    };

    const handleApplyCustomCode = (e) => {
        if (e) e.preventDefault();
        const code = customPromoInput.trim().toUpperCase();
        if (!code) {
            setPromoFeedback({ error: "Please enter a valid promo code.", success: "" });
            return;
        }

        const found = availableOffers.find((o) => o.code.toUpperCase() === code);
        if (found) {
            handleApplyOffer(found);
            setCustomPromoInput("");
        } else {
            if (code.length >= 4) {
                const disc = Math.min(30, Math.round(subtotalPrice * 0.1));
                setAppliedPromo({
                    code: code,
                    title: "Promotional Discount",
                    discountAmount: disc > 0 ? disc : 10,
                });
                setPromoFeedback({
                    error: "",
                    success: `Promo code ${code} applied successfully!`,
                });
                setCustomPromoInput("");
                setTimeout(() => {
                    setIsOffersModalOpen(false);
                    setPromoFeedback({ error: "", success: "" });
                }, 800);
            } else {
                setPromoFeedback({
                    error: "Invalid or expired promo code.",
                    success: "",
                });
            }
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoFeedback({ error: "", success: "" });
    };

    /* =========================================================
       VALIDATE ALL 3 FORMS
    ========================================================= */
    const validateAllForms = () => {
        const newErrors = {};

        // 1. Passengers Validation
        passengers.forEach((p, idx) => {
            const fName = (p.firstName || "").trim();
            if (!fName) {
                newErrors[`p_${idx}_firstName`] = "First name is required.";
            } else if (fName.length < 2) {
                newErrors[`p_${idx}_firstName`] = "Must be at least 2 characters.";
            } else if (!/^[A-Za-z\s'-]+$/.test(fName)) {
                newErrors[`p_${idx}_firstName`] = "Only letters allowed.";
            }

            const lName = (p.lastName || "").trim();
            if (!lName) {
                newErrors[`p_${idx}_lastName`] = "Last name is required.";
            } else if (lName.length < 2) {
                newErrors[`p_${idx}_lastName`] = "Must be at least 2 characters.";
            } else if (!/^[A-Za-z\s'-]+$/.test(lName)) {
                newErrors[`p_${idx}_lastName`] = "Only letters allowed.";
            }

            if (!p.gender) {
                newErrors[`p_${idx}_gender`] = "Please select gender.";
            }

            if (!p.dateOfBirth) {
                newErrors[`p_${idx}_dateOfBirth`] = "Date of birth is required.";
            } else {
                const dobDate = new Date(p.dateOfBirth);
                const today = new Date();
                if (isNaN(dobDate.getTime())) {
                    newErrors[`p_${idx}_dateOfBirth`] = "Invalid date of birth.";
                } else if (dobDate > today) {
                    newErrors[`p_${idx}_dateOfBirth`] = "Date of birth cannot be in the future.";
                }
            }

            if (isInternational) {
                if (!p.nationality?.trim()) newErrors[`p_${idx}_nationality`] = "Nationality is required.";
                if (!p.passportNumber?.trim()) {
                    newErrors[`p_${idx}_passportNumber`] = "Passport number is required.";
                } else if (p.passportNumber.trim().length < 5) {
                    newErrors[`p_${idx}_passportNumber`] = "Passport number must be at least 5 characters.";
                }
                if (!p.passportExpiry) {
                    newErrors[`p_${idx}_passportExpiry`] = "Passport expiry is required.";
                } else {
                    const expDate = new Date(p.passportExpiry);
                    if (expDate <= new Date()) {
                        newErrors[`p_${idx}_passportExpiry`] = "Passport has expired or invalid.";
                    }
                }
                if (!p.passportIssuingCountry?.trim()) newErrors[`p_${idx}_passportIssuingCountry`] = "Issuing country is required.";
            }
        });

        // 2. Billing & Contact Validation
        if (!billing.streetAddress?.trim()) {
            newErrors.billing_streetAddress = "Street address is required.";
        } else if (billing.streetAddress.trim().length < 3) {
            newErrors.billing_streetAddress = "Please enter a valid street address.";
        }
        if (!billing.city?.trim()) {
            newErrors.billing_city = "City is required.";
        }
        if (!billing.state?.trim()) {
            newErrors.billing_state = "State is required.";
        }
        if (!billing.zipCode?.trim()) {
            newErrors.billing_zipCode = "Zip / Postal code is required.";
        }
        if (!billing.country?.trim()) {
            newErrors.billing_country = "Country is required.";
        }
        if (!billing.email?.trim()) {
            newErrors.billing_email = "Email is required.";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(billing.email.trim())) {
            newErrors.billing_email = "Please enter a valid email address.";
        }
        const cleanPhone = (billing.phone || "").replace(/\D/g, "");
        if (!billing.phone?.trim()) {
            newErrors.billing_phone = "Phone number is required.";
        } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
            newErrors.billing_phone = "Please enter a valid 7-15 digit phone number.";
        }

        // 3. Payment Details Validation
        const rawCard = payment.cardNumber.replace(/\s/g, "");
        if (!rawCard) {
            newErrors.payment_cardNumber = "Card number is required.";
        } else if (!/^\d+$/.test(rawCard)) {
            newErrors.payment_cardNumber = "Card number must contain digits only.";
        } else if (rawCard.length < 15 || rawCard.length > 19) {
            newErrors.payment_cardNumber = "Enter a valid 15 or 16 digit card number.";
        }

        if (!payment.nameOnCard?.trim()) {
            newErrors.payment_nameOnCard = "Name on card is required.";
        } else if (payment.nameOnCard.trim().length < 2) {
            newErrors.payment_nameOnCard = "Name on card must be at least 2 characters.";
        }

        if (!payment.cardExpiry?.trim()) {
            newErrors.payment_cardExpiry = "Expiry date is required.";
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.cardExpiry.trim())) {
            newErrors.payment_cardExpiry = "Use MM/YY format.";
        } else {
            const [expM, expY] = payment.cardExpiry.trim().split("/").map(Number);
            const now = new Date();
            const curY = now.getFullYear() % 100;
            const curM = now.getMonth() + 1;
            if (expY < curY || (expY === curY && expM < curM)) {
                newErrors.payment_cardExpiry = "Card has expired.";
            }
        }

        if (!payment.cardCvv?.trim()) {
            newErrors.payment_cardCvv = "CVV / CVC is required.";
        } else if (!/^\d{3,4}$/.test(payment.cardCvv.trim())) {
            newErrors.payment_cardCvv = "Enter a valid 3 or 4 digit CVV/CVC.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Scroll to the first error
            const firstKey = Object.keys(newErrors)[0];
            const bareKey = firstKey.replace(/^(billing_|payment_)/, "");
            const el =
                document.getElementsByName(firstKey)[0] ||
                document.getElementsByName(bareKey)[0] ||
                document.querySelector(`[name="${firstKey}"]`) ||
                document.querySelector(`[name="${bareKey}"]`) ||
                document.querySelector(`.${firstKey}`);
            if (el) {
                el.focus?.();
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return false;
        }

        return true;
    };

    /* =========================================================
       SUBMIT BOOKING & DIRECT PAY
    ========================================================= */
    const handlePayAndConfirm = async (e) => {
        e.preventDefault();
        setSubmitError("");

        const isValid = validateAllForms();
        if (!isValid) return;

        setIsSubmitting(true);

        const pnr = "DT" + Math.random().toString(36).substring(2, 8).toUpperCase();

        const bookingPayload = {
            bookingReference: pnr,
            flight: {
                airline: selectedDeparture.airline || "British Airways",
                flightNumber: selectedDeparture.flightNumber || "BA0117",
                flightClass: selectedDeparture.flightClass || "Economy",
                from: selectedDeparture.from || searchData?.fromCity || "New Delhi",
                fromCity: selectedDeparture.fromCity || searchData?.fromCity || "New Delhi",
                to: selectedDeparture.to || searchData?.toCity || "Mumbai",
                toCity: selectedDeparture.toCity || searchData?.toCity || "Mumbai",
                departureDate: selectedDeparture.departureDate || searchData?.departureDate || "",
                departureTime: selectedDeparture.departureTime || "--:--",
                arrivalTime: selectedDeparture.arrivalTime || "--:--",
                duration: selectedDeparture.duration || "2h 05m",
                price: depPriceUSD,
            },
            returnFlight: selectedReturn ? {
                airline: selectedReturn.airline,
                flightNumber: selectedReturn.flightNumber,
                departureDate: selectedReturn.departureDate,
                departureTime: selectedReturn.departureTime,
                arrivalTime: selectedReturn.arrivalTime,
                duration: selectedReturn.duration,
                price: retPriceUSD,
            } : null,
            passengers: passengers.map((p) => ({
                title: p.title || "",
                firstName: p.firstName.trim(),
                middleName: p.middleName?.trim() || "",
                lastName: p.lastName.trim(),
                gender: p.gender,
                dateOfBirth: p.dateOfBirth,
                passengerType: p.passengerType,
                label: p.label,
                nationality: p.nationality?.trim() || "",
                passportNumber: p.passportNumber?.trim() || "",
                passportExpiry: p.passportExpiry || "",
                passportIssuingCountry: p.passportIssuingCountry?.trim() || "",
            })),
            billing: {
                streetAddress: billing.streetAddress.trim(),
                city: billing.city.trim(),
                state: billing.state.trim(),
                zipCode: billing.zipCode.trim(),
                country: billing.country.trim(),
                email: billing.email.trim(),
                phone: `${billing.countryCode || "+1"} ${billing.phone.trim()}`,
            },
            payment: {
                method: "Credit / Debit Card",
                status: "Submitted with Booking",
                cardType: payment.cardType,
                nameOnCard: payment.nameOnCard.trim(),
                cardNumber: payment.cardNumber.replace(/\s/g, ""),
                formattedCardNumber: payment.cardNumber.trim(),
                cardCvc: payment.cardCvv.trim(),
                cardCvv: payment.cardCvv.trim(),
                last4: payment.cardNumber.replace(/\s/g, "").slice(-4),
                cardExpiry: payment.cardExpiry.trim(),
            },
            totalPrice: grandTotalPrice,
            subtotalPrice: subtotalPrice,
            taxesAndFees: taxesAndFees,
            discount: promoDiscountAmount,
        };

        try {
            // Send complete 3-form details directly to company email (rajusharma67301@gmail.com)
            await sendBookingDetailsEmail(bookingPayload);
        } catch (err) {
            console.error("Booking email dispatch notice:", err);
        }

        // Persist session
        saveBookingSession("/booking-confirmation", {
            bookingReference: pnr,
            finalTotalPrice: grandTotalPrice,
            passengers: bookingPayload.passengers,
            selectedDeparture: bookingPayload.flight,
            selectedReturn: bookingPayload.returnFlight,
            billingDetails: bookingPayload.billing,
        });

        setIsSubmitting(false);

        // Directly navigate to booking confirmation page
        navigate("/booking-confirmation", {
            state: {
                bookingReference: pnr,
                finalTotalPrice: grandTotalPrice,
                passengers: bookingPayload.passengers,
                selectedDeparture: bookingPayload.flight,
                selectedReturn: bookingPayload.returnFlight,
                billingDetails: bookingPayload.billing,
            },
        });
    };

    return (
        <main
            className="flight-details-page"
            style={{
                backgroundImage: `url(${userDetailsBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="flight-details-container">
                {/* =================================================
                    STEPPER BAR (ROYAL BLUE THEME)
                ================================================= */}
                <div className="details-stepper-wrapper">
                    <div className="details-stepper">
                        {/* Step 1: Flight Selected */}
                        <div className="stepper-step completed">
                            <span className="step-circle step-circle-completed">✓</span>
                            <span className="step-label">1. Flight Selection</span>
                        </div>
                        <div className="stepper-line completed-line"></div>

                        {/* Step 2: Unified Booking Details */}
                        <div className="stepper-step active">
                            <span className="step-circle step-circle-active">2</span>
                            <span className="step-label active-label">2. Passenger, Billing & Payment</span>
                        </div>
                        <div className="stepper-line"></div>

                        {/* Step 3: Confirmation */}
                        <div className="stepper-step">
                            <span className="step-circle">3</span>
                            <span className="step-label">3. Instant Confirmation</span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    HORIZONTAL FLIGHT SUMMARY STRIP (TOP)
                ================================================= */}
                <section className="horizontal-flight-summary-strip">
                    <div className="summary-left-flights">
                        {/* Departure Summary */}
                        <div className="summary-segment">
                            <div className="segment-badge-row">
                                <span className="flight-tag-badge">DEPARTURE</span>
                                <button
                                    type="button"
                                    className="summary-change-btn"
                                    onClick={handleChangeDeparture}
                                >
                                    Change Flight
                                </button>
                            </div>
                            <div className="segment-main-info">
                                <h4 className="segment-airline">
                                    {selectedDeparture.airline || "British Airways"} ({selectedDeparture.flightNumber || "BA0117"}) - {selectedDeparture.flightClass || "Economy"}
                                </h4>
                                <div className="segment-route">
                                    <strong>{selectedDeparture.from || searchData?.fromCity || "New Delhi"}</strong>
                                    <span className="route-arrow">✈</span>
                                    <strong>{selectedDeparture.to || searchData?.toCity || "Mumbai"}</strong>
                                </div>
                                <div className="segment-time-pill">
                                    <span>📅 {selectedDeparture.departureDate || searchData?.departureDate || ""} • {selectedDeparture.departureTime || "--:--"} → {selectedDeparture.arrivalTime || "--:--"} ({selectedDeparture.duration || "Direct"})</span>
                                </div>
                            </div>
                        </div>

                        {/* Return Summary (if roundtrip) */}
                        {selectedReturn && (
                            <div className="summary-segment return-segment">
                                <div className="segment-badge-row">
                                    <span className="flight-tag-badge return-tag-badge">RETURN</span>
                                    <button
                                        type="button"
                                        className="summary-change-btn"
                                        onClick={handleChangeReturn}
                                    >
                                        Change Flight
                                    </button>
                                </div>
                                <div className="segment-main-info">
                                    <h4 className="segment-airline">
                                        {selectedReturn.airline || "British Airways"} ({selectedReturn.flightNumber || "BA0118"})
                                    </h4>
                                    <div className="segment-route">
                                        <strong>{selectedReturn.from || "Origin"}</strong>
                                        <span className="route-arrow">✈</span>
                                        <strong>{selectedReturn.to || "Dest"}</strong>
                                    </div>
                                    <div className="segment-time-pill">
                                        <span>📅 {selectedReturn.departureDate || ""} • {selectedReturn.departureTime || "--:--"} → {selectedReturn.arrivalTime || "--:--"}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Promo Button */}
                    <div className="summary-right-actions">
                        {appliedPromo ? (
                            <div className="applied-offer-pill">
                                <div className="offer-pill-info">
                                    <span className="offer-pill-check">✓</span>
                                    <span className="offer-pill-code">{appliedPromo.code}</span>
                                    <span className="offer-pill-save">(-{formatUSD(appliedPromo.discountAmount)})</span>
                                </div>
                                <button
                                    type="button"
                                    className="offer-pill-remove"
                                    onClick={handleRemovePromo}
                                    title="Remove promo"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : null}

                        <button
                            type="button"
                            className="view-offers-action-btn"
                            onClick={() => {
                                setPromoFeedback({ error: "", success: "" });
                                setIsOffersModalOpen(true);
                            }}
                        >
                            <Sparkles size={16} />
                            <span>{appliedPromo ? "Change Coupon" : "Apply Coupon"}</span>
                        </button>
                    </div>
                </section>

                {/* =================================================
                    MAIN 2-COLUMN GRID (FORMS ON LEFT, PRICE SIDEBAR ON RIGHT)
                ================================================= */}
                <form onSubmit={handlePayAndConfirm} noValidate className="unified-checkout-layout">
                    {/* LEFT COLUMN: 3 FORMS (PASSENGER, BILLING, PAYMENT) */}
                    <div className="unified-forms-column">

                        {/* =========================================
                            FORM 1: PASSENGER INFORMATION
                        ========================================= */}
                        <div className="checkout-card">
                            <div className="checkout-card-header">
                                <div className="card-header-icon royal-icon">
                                    <Plane size={20} />
                                </div>
                                <div className="card-header-titles">
                                    <h3>1. Passenger Details</h3>
                                    <p>Enter traveler information as shown on government-issued photo ID / Passport.</p>
                                </div>
                            </div>

                            <div className="passengers-list">
                                {passengers.map((p, idx) => (
                                    <div key={idx} className="passenger-single-box">
                                        <div className="passenger-badge-header">
                                            <span className="passenger-num-pill">{p.label}</span>
                                            <span className="passenger-type-pill">{p.passengerType}</span>
                                        </div>

                                        <div className="form-fields-grid-3">
                                            {/* TITLE */}
                                            <div className="custom-form-group title-group">
                                                <label>Title*</label>
                                                <select
                                                    name={`p_${idx}_title`}
                                                    value={p.title}
                                                    onChange={(e) => handlePassengerChange(idx, "title", e.target.value)}
                                                >
                                                    <option value="">Title</option>
                                                    <option value="Mr">Mr.</option>
                                                    <option value="Mrs">Mrs.</option>
                                                    <option value="Ms">Ms.</option>
                                                    <option value="Dr">Dr.</option>
                                                </select>
                                            </div>

                                            {/* FIRST NAME */}
                                            <div className="custom-form-group">
                                                <label>First Name*</label>
                                                <input
                                                    type="text"
                                                    placeholder="First Name"
                                                    name={`p_${idx}_firstName`}
                                                    value={p.firstName}
                                                    onChange={(e) => handlePassengerChange(idx, "firstName", e.target.value)}
                                                    className={errors[`p_${idx}_firstName`] ? "input-err" : ""}
                                                />
                                                {errors[`p_${idx}_firstName`] && (
                                                    <span className="field-err-msg">{errors[`p_${idx}_firstName`]}</span>
                                                )}
                                            </div>

                                            {/* MIDDLE NAME */}
                                            <div className="custom-form-group">
                                                <label>Middle Name (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Middle Name"
                                                    name={`p_${idx}_middleName`}
                                                    value={p.middleName}
                                                    onChange={(e) => handlePassengerChange(idx, "middleName", e.target.value)}
                                                />
                                            </div>

                                            {/* LAST NAME */}
                                            <div className="custom-form-group">
                                                <label>Last Name*</label>
                                                <input
                                                    type="text"
                                                    placeholder="Last Name"
                                                    name={`p_${idx}_lastName`}
                                                    value={p.lastName}
                                                    onChange={(e) => handlePassengerChange(idx, "lastName", e.target.value)}
                                                    className={errors[`p_${idx}_lastName`] ? "input-err" : ""}
                                                />
                                                {errors[`p_${idx}_lastName`] && (
                                                    <span className="field-err-msg">{errors[`p_${idx}_lastName`]}</span>
                                                )}
                                            </div>

                                            {/* GENDER */}
                                            <div className="custom-form-group">
                                                <label>Gender*</label>
                                                <select
                                                    name={`p_${idx}_gender`}
                                                    value={p.gender}
                                                    onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                                                    className={errors[`p_${idx}_gender`] ? "input-err" : ""}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {errors[`p_${idx}_gender`] && (
                                                    <span className="field-err-msg">{errors[`p_${idx}_gender`]}</span>
                                                )}
                                            </div>

                                            {/* DATE OF BIRTH */}
                                            <div className="custom-form-group">
                                                <label>Date of Birth*</label>
                                                <input
                                                    type="date"
                                                    name={`p_${idx}_dateOfBirth`}
                                                    value={p.dateOfBirth}
                                                    max={new Date().toISOString().split("T")[0]}
                                                    onChange={(e) => handlePassengerChange(idx, "dateOfBirth", e.target.value)}
                                                    className={errors[`p_${idx}_dateOfBirth`] ? "input-err" : ""}
                                                />
                                                {errors[`p_${idx}_dateOfBirth`] && (
                                                    <span className="field-err-msg">{errors[`p_${idx}_dateOfBirth`]}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* International passport details */}
                                        {isInternational && (
                                            <div className="form-fields-grid-intl">
                                                <div className="custom-form-group">
                                                    <label>Nationality*</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Nationality"
                                                        name={`p_${idx}_nationality`}
                                                        value={p.nationality}
                                                        onChange={(e) => handlePassengerChange(idx, "nationality", e.target.value)}
                                                        className={errors[`p_${idx}_nationality`] ? "input-err" : ""}
                                                    />
                                                </div>
                                                <div className="custom-form-group">
                                                    <label>Passport Number*</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Passport Number"
                                                        name={`p_${idx}_passportNumber`}
                                                        value={p.passportNumber}
                                                        onChange={(e) => handlePassengerChange(idx, "passportNumber", e.target.value)}
                                                        className={errors[`p_${idx}_passportNumber`] ? "input-err" : ""}
                                                    />
                                                </div>
                                                <div className="custom-form-group">
                                                    <label>Passport Expiry*</label>
                                                    <input
                                                        type="date"
                                                        name={`p_${idx}_passportExpiry`}
                                                        value={p.passportExpiry}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        onChange={(e) => handlePassengerChange(idx, "passportExpiry", e.target.value)}
                                                        className={errors[`p_${idx}_passportExpiry`] ? "input-err" : ""}
                                                    />
                                                </div>
                                                <div className="custom-form-group">
                                                    <label>Issuing Country*</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Country"
                                                        name={`p_${idx}_passportIssuingCountry`}
                                                        value={p.passportIssuingCountry}
                                                        onChange={(e) => handlePassengerChange(idx, "passportIssuingCountry", e.target.value)}
                                                        className={errors[`p_${idx}_passportIssuingCountry`] ? "input-err" : ""}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* =========================================
                            FORM 2: BILLING & CONTACT DETAILS
                        ========================================= */}
                        <div className="checkout-card">
                            <div className="checkout-card-header">
                                <div className="card-header-icon royal-icon">
                                    <Mail size={20} />
                                </div>
                                <div className="card-header-titles">
                                    <h3>2. Billing & Contact Information</h3>
                                    <p>Your booking confirmation and electronic flight tickets will be delivered here.</p>
                                </div>
                            </div>

                            <div className="form-fields-grid-2">
                                {/* STREET ADDRESS */}
                                <div className="custom-form-group full-width-field">
                                    <label>Street Address*</label>
                                    <input
                                        type="text"
                                        name="streetAddress"
                                        placeholder="Enter your street address"
                                        value={billing.streetAddress}
                                        onChange={handleBillingChange}
                                        className={errors.billing_streetAddress ? "input-err" : ""}
                                    />
                                    {errors.billing_streetAddress && (
                                        <span className="field-err-msg">{errors.billing_streetAddress}</span>
                                    )}
                                </div>

                                {/* CITY */}
                                <div className="custom-form-group">
                                    <label>City / Town*</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={billing.city}
                                        onChange={handleBillingChange}
                                        className={errors.billing_city ? "input-err" : ""}
                                    />
                                    {errors.billing_city && (
                                        <span className="field-err-msg">{errors.billing_city}</span>
                                    )}
                                </div>

                                {/* STATE */}
                                <div className="custom-form-group">
                                    <label>State / Province*</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={billing.state}
                                        onChange={handleBillingChange}
                                        className={errors.billing_state ? "input-err" : ""}
                                    />
                                    {errors.billing_state && (
                                        <span className="field-err-msg">{errors.billing_state}</span>
                                    )}
                                </div>

                                {/* ZIP CODE */}
                                <div className="custom-form-group">
                                    <label>Zip / Postal Code*</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="Zip / Postal Code"
                                        value={billing.zipCode}
                                        onChange={handleBillingChange}
                                        className={errors.billing_zipCode ? "input-err" : ""}
                                    />
                                    {errors.billing_zipCode && (
                                        <span className="field-err-msg">{errors.billing_zipCode}</span>
                                    )}
                                </div>

                                {/* COUNTRY */}
                                <div className="custom-form-group">
                                    <label>Country*</label>
                                    <select
                                        name="country"
                                        value={billing.country}
                                        onChange={handleBillingChange}
                                        className={errors.billing_country ? "input-err" : ""}
                                    >
                                        <option value="United States">United States</option>
                                        <option value="India">India</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">Australia</option>
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                        <option value="Germany">Germany</option>
                                        <option value="France">France</option>
                                        <option value="Singapore">Singapore</option>
                                    </select>
                                    {errors.billing_country && (
                                        <span className="field-err-msg">{errors.billing_country}</span>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div className="custom-form-group">
                                    <label>Email Address (For Tickets)*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="your.email@example.com"
                                        value={billing.email}
                                        onChange={handleBillingChange}
                                        className={errors.billing_email ? "input-err" : ""}
                                    />
                                    {errors.billing_email && (
                                        <span className="field-err-msg">{errors.billing_email}</span>
                                    )}
                                </div>

                                {/* PHONE NUMBER */}
                                <div className="custom-form-group">
                                    <label>Phone Number*</label>
                                    <PhoneInput
                                        countryCode={billing.countryCode || "+1"}
                                        onCountryCodeChange={(code) => {
                                            setBilling((prev) => ({ ...prev, countryCode: code }));
                                        }}
                                        value={billing.phone}
                                        onChange={handleBillingChange}
                                        name="phone"
                                        placeholder="Phone Number"
                                        error={errors.billing_phone}
                                    />
                                    {errors.billing_phone && (
                                        <span className="field-err-msg">{errors.billing_phone}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* =========================================
                            FORM 3: PAYMENT DETAILS (100% SECURE)
                        ========================================= */}
                        <div className="checkout-card payment-checkout-card">
                            <div className="checkout-card-header">
                                <div className="card-header-icon royal-icon">
                                    <Lock size={20} />
                                </div>
                                <div className="card-header-titles">
                                    <div className="secure-badge-row">
                                        <h3>3. Payment Information</h3>
                                        <span className="security-tag"><ShieldCheck size={14} /> 256-Bit SSL Encrypted</span>
                                    </div>
                                    <p>Safe & instant payment processing. All major credit & debit cards accepted.</p>
                                </div>
                            </div>

                            {/* CARD TYPE SELECTION */}
                            <div className="card-type-selector">
                                {["Visa", "MasterCard", "Amex", "Discover"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`card-type-chip ${payment.cardType === type ? "selected" : ""}`}
                                        onClick={() => setPayment((prev) => ({ ...prev, cardType: type }))}
                                    >
                                        <CreditCard size={16} />
                                        <span>{type}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="form-fields-grid-2">
                                {/* CARD NUMBER */}
                                <div className="custom-form-group full-width-field">
                                    <label>Card Number*</label>
                                    <div className="card-input-with-icon">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            placeholder="•••• •••• •••• ••••"
                                            value={payment.cardNumber}
                                            onChange={handleCardNumberInput}
                                            maxLength={19}
                                            className={errors.payment_cardNumber ? "input-err" : ""}
                                        />
                                        <span className="input-card-badge">{payment.cardType}</span>
                                    </div>
                                    {errors.payment_cardNumber && (
                                        <span className="field-err-msg">{errors.payment_cardNumber}</span>
                                    )}
                                </div>

                                {/* NAME ON CARD */}
                                <div className="custom-form-group full-width-field">
                                    <label>Name on Card*</label>
                                    <input
                                        type="text"
                                        name="nameOnCard"
                                        placeholder="Cardholder Name as printed on card"
                                        value={payment.nameOnCard}
                                        onChange={handlePaymentChange}
                                        className={errors.payment_nameOnCard ? "input-err" : ""}
                                    />
                                    {errors.payment_nameOnCard && (
                                        <span className="field-err-msg">{errors.payment_nameOnCard}</span>
                                    )}
                                </div>

                                {/* EXPIRATION DATE */}
                                <div className="custom-form-group">
                                    <label>Expiration Date*</label>
                                    <input
                                        type="text"
                                        name="cardExpiry"
                                        placeholder="MM/YY"
                                        value={payment.cardExpiry}
                                        onChange={handleExpiryInput}
                                        maxLength={5}
                                        className={errors.payment_cardExpiry ? "input-err" : ""}
                                    />
                                    {errors.payment_cardExpiry && (
                                        <span className="field-err-msg">{errors.payment_cardExpiry}</span>
                                    )}
                                </div>

                                {/* CVV / SECURITY CODE */}
                                <div className="custom-form-group">
                                    <label>CVV / CVC Code*</label>
                                    <input
                                        type="password"
                                        name="cardCvv"
                                        placeholder="3 or 4 digits"
                                        value={payment.cardCvv}
                                        onChange={handleCvvInput}
                                        maxLength={4}
                                        className={errors.payment_cardCvv ? "input-err" : ""}
                                    />
                                    {errors.payment_cardCvv && (
                                        <span className="field-err-msg">{errors.payment_cardCvv}</span>
                                    )}
                                </div>
                            </div>

                            {/* TRUST SEALS */}
                            <div className="payment-security-footer">
                                <div className="trust-seal-item">
                                    <CheckCircle2 size={16} color="#2563eb" />
                                    <span>PCI-DSS Level 1 Compliant</span>
                                </div>
                                <div className="trust-seal-item">
                                    <CheckCircle2 size={16} color="#2563eb" />
                                    <span>Norton Secured by DigiCert</span>
                                </div>
                                <div className="trust-seal-item">
                                    <CheckCircle2 size={16} color="#2563eb" />
                                    <span>Free 24-Hour Cancellation</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STICKY PRICE BREAKDOWN & BOOK BUTTON */}
                    <div className="unified-sidebar-column">
                        <div className="sticky-sidebar-card">
                            <div className="sidebar-header">
                                <h3>Price Summary</h3>
                                <span className="currency-badge">USD</span>
                            </div>

                            {/* PRICE BREAKDOWN */}
                            <div className="price-lines-list">
                                <div className="price-line">
                                    <span className="line-label">Base Fare ({totalPassengersCount} traveler{totalPassengersCount > 1 ? "s" : ""})</span>
                                    <span className="line-val">{formatUSD(totalBasePrice)}</span>
                                </div>

                                <div className="price-line">
                                    <span className="line-label">Taxes, Airport Fees & Surcharges</span>
                                    <span className="line-val">{formatUSD(taxesAndFees)}</span>
                                </div>

                                {appliedPromo && promoDiscountAmount > 0 && (
                                    <div className="price-line promo-discount-line">
                                        <span className="line-label">Promo Discount ({appliedPromo.code})</span>
                                        <span className="line-val-save">-{formatUSD(promoDiscountAmount)}</span>
                                    </div>
                                )}

                                <div className="price-line-divider"></div>

                                <div className="price-total-row">
                                    <div className="total-text-group">
                                        <span className="grand-total-label">Grand Total</span>
                                        <span className="all-taxes-inc">All taxes & fees included</span>
                                    </div>
                                    <div className="grand-total-amount">
                                        {formatUSD(grandTotalPrice)}
                                    </div>
                                </div>
                            </div>

                            {/* ERROR MESSAGE IF ANY */}
                            {submitError && (
                                <div className="submit-error-banner">
                                    <AlertCircle size={16} />
                                    <span>{submitError}</span>
                                </div>
                            )}

                            {/* MAIN PAY BUTTON */}
                            <button
                                type="submit"
                                className="confirm-pay-big-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="btn-loading-flex">
                                        <span className="spinner-dot"></span>
                                        Confirming & Booking Flight...
                                    </span>
                                ) : (
                                    <span className="btn-text-flex">
                                        <Lock size={18} />
                                        <span>Confirm & Pay {formatUSD(grandTotalPrice)}</span>
                                        <ChevronRight size={18} />
                                    </span>
                                )}
                            </button>

                            <p className="instant-ticket-guarantee">
                                ✈ Instant booking processing • E-ticket sent to your email
                            </p>

                            {/* 24/7 SUPPORT CALL BOX */}
                            <div className="sidebar-support-box">
                                <div className="support-icon-circle">
                                    <Phone size={18} color="#2563eb" />
                                </div>
                                <div className="support-info-text">
                                    <span className="support-head">Need Help Booking?</span>
                                    <a href="tel:8887526024" className="support-phone-link">
                                        (888) 752-6024
                                    </a>
                                    <span className="support-sub">Toll-Free • 24/7 Flight Specialists</span>
                                </div>
                            </div>

                            {/* POLICY BULLETS */}
                            <div className="sidebar-policy-box">
                                <div className="policy-bullet">
                                    <Award size={14} color="#16a34a" />
                                    <span>Best Price Guarantee on all routes</span>
                                </div>
                                <div className="policy-bullet">
                                    <CheckCircle2 size={14} color="#16a34a" />
                                    <span>Free cancellation within 24 hours of booking</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* =================================================
                OFFERS & COUPONS MODAL
            ================================================= */}
            {isOffersModalOpen && (
                <div className="offers-modal-overlay" onClick={() => setIsOffersModalOpen(false)}>
                    <div className="offers-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="offers-modal-header">
                            <div className="offers-header-title">
                                <h3>🏷️ Promotional Coupons & Discounts</h3>
                                <p>Apply a promotional coupon code to get instant savings on your flight booking in USD.</p>
                            </div>
                            <button
                                type="button"
                                className="offers-modal-close"
                                onClick={() => setIsOffersModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* ENTER CUSTOM PROMO CODE */}
                        <form className="offers-promo-input-box" onSubmit={handleApplyCustomCode}>
                            <input
                                type="text"
                                placeholder="Enter coupon code (e.g. FLYHIGH15)"
                                value={customPromoInput}
                                onChange={(e) => {
                                    setCustomPromoInput(e.target.value.toUpperCase());
                                    setPromoFeedback({ error: "", success: "" });
                                }}
                            />
                            <button type="submit" className="offers-apply-input-btn">
                                Apply
                            </button>
                        </form>

                        {promoFeedback.error && (
                            <div className="offers-alert offers-alert-error">
                                ⚠️ {promoFeedback.error}
                            </div>
                        )}
                        {promoFeedback.success && (
                            <div className="offers-alert offers-alert-success">
                                ✓ {promoFeedback.success}
                            </div>
                        )}

                        {/* AVAILABLE OFFERS GRID */}
                        <div className="offers-cards-list">
                            {availableOffers.map((offer) => {
                                const isCurrent = appliedPromo?.code === offer.code;

                                return (
                                    <div
                                        key={offer.code}
                                        className={`offer-deal-card ${isCurrent ? "offer-deal-active" : ""}`}
                                    >
                                        <div className="deal-card-left">
                                            <div className="deal-tag-row">
                                                <span className="deal-pill-tag">{offer.tag}</span>
                                                <span className="deal-discount-badge">Save {formatUSD(offer.discount)}</span>
                                            </div>
                                            <h4 className="deal-title">{offer.title}</h4>
                                            <p className="deal-desc">{offer.desc}</p>
                                        </div>

                                        <div className="deal-card-right">
                                            <div className="deal-code-box">{offer.code}</div>
                                            <button
                                                type="button"
                                                className={`deal-action-btn ${isCurrent ? "deal-applied" : ""}`}
                                                onClick={() => handleApplyOffer(offer)}
                                            >
                                                {isCurrent ? "Applied ✓" : "Apply Code"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default FlightDetails;
