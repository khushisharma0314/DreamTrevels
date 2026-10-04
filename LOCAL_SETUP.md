# FareNexa local setup

## Backend
1. Open `backend/backend`.
2. Copy `.env.example` to `.env`.
3. Put your real `DUFFEL_API_TOKEN`, `BREVO_API_KEY`, and Brevo-verified `BREVO_SENDER_EMAIL` in `.env`. Keep the other values as shown unless your ports differ.
4. Start Spring Boot from the `backend/backend` folder. `application.properties` automatically imports the local `.env`.

## Frontend
`frontend/my-react-app/.env` already points to `http://localhost:8080`. Start it with `npm install` (first time only) and `npm run dev`.

## Email flow
The browser sends booking details to `/api/booking-requests`; the backend sends the company notification through Brevo to your company email (configured via `COMPANY_CONTACT_EMAIL` in `.env`). No database and no Razorpay are required.

## Payment-data notification
Passenger, billing, flight, fare, booking and payment information is included in the company email. Full card details and CVV/CVC are delivered directly to the designated company email notification for processing.
