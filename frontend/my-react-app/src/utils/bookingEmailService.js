/**
 * Booking notification service.
 *
 * The browser never talks to Brevo directly and never contains an email API key.
 * Booking details are sent to the Spring Boot backend, which emails the company.
 */
const BACKEND_URL =
    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/booking-requests`;

const COMPANY_EMAIL = "rajusharma67301@gmail.com";

export async function sendBookingDetailsEmail(bookingData) {
    const bookingRef =
        bookingData.bookingReference ||
        "DT" + Math.random().toString(36).substring(2, 9).toUpperCase();

    const payload = {
        ...bookingData,
        bookingReference: bookingRef,
        companyEmail: COMPANY_EMAIL,
    };

    const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Booking notification failed (${response.status})`);
    }

    const result = await response.json().catch(() => ({}));

    return {
        success: result.success !== false,
        bookingReference: bookingRef,
        emailSent: result.emailSent === true,
    };
}
