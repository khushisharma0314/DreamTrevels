package com.farenexa.backend.service;

import com.farenexa.backend.dto.ContactRequest;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;
import java.util.List;

@Service
public class EmailService {

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:}")
    private String brevoSenderEmail;

    @Value("${brevo.sender.name:FareNexa Travel}")
    private String brevoSenderName;

    @Value("${company.contact.email:}")
    private String companyEmail;

    private boolean sendBrevoEmail(
            String toEmail,
            String toName,
            String replyToEmail,
            String subject,
            String htmlContent,
            String attachmentName,
            byte[] attachmentBytes
    ) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            System.err.println("Brevo API key is not configured. Set BREVO_API_KEY.");
            return false;
        }

        if (brevoSenderEmail == null || brevoSenderEmail.isBlank()) {
            System.err.println("Brevo sender email is not configured. Set BREVO_SENDER_EMAIL.");
            return false;
        }

        if (toEmail == null || toEmail.isBlank()) {
            return false;
        }

        try {
            JSONObject payload = new JSONObject();

            JSONObject sender = new JSONObject();
            sender.put("name", brevoSenderName);
            sender.put("email", brevoSenderEmail);
            payload.put("sender", sender);

            JSONArray recipients = new JSONArray();
            JSONObject recipient = new JSONObject();
            recipient.put("email", toEmail.trim());

            if (toName != null && !toName.isBlank()) {
                recipient.put("name", toName.trim());
            }

            recipients.put(recipient);
            payload.put("to", recipients);

            if (replyToEmail != null && !replyToEmail.isBlank()) {
                JSONObject replyTo = new JSONObject();
                replyTo.put("email", replyToEmail.trim());
                payload.put("replyTo", replyTo);
            }

            payload.put("subject", subject);
            payload.put("htmlContent", htmlContent);

            if (attachmentBytes != null
                    && attachmentBytes.length > 0
                    && attachmentName != null) {

                JSONArray attachments = new JSONArray();

                JSONObject attachment = new JSONObject();
                attachment.put("name", attachmentName);
                attachment.put(
                        "content",
                        Base64.getEncoder().encodeToString(attachmentBytes)
                );

                attachments.put(attachment);
                payload.put("attachment", attachments);
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .header("api-key", brevoApiKey)
                    .POST(
                            HttpRequest.BodyPublishers.ofString(
                                    payload.toString(),
                                    StandardCharsets.UTF_8
                            )
                    )
                    .timeout(Duration.ofSeconds(20))
                    .build();

            HttpResponse<String> response = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build()
                    .send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() >= 200
                    && response.statusCode() < 300) {

                System.out.println("Brevo email sent to " + toEmail);
                return true;
            }

            System.err.println(
                    "Brevo API error (" +
                            response.statusCode() +
                            "): " +
                            response.body()
            );

            return false;

        } catch (Exception e) {

            System.err.println(
                    "Email delivery failed: " +
                            e.getMessage()
            );

            return false;
        }
    }

    public void sendCompanyNotification(ContactRequest request) {

        String subject =
                "New Contact Request from " +
                        safe(request.getName());

        String html = """
                <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#1e293b;">
                  <h2 style="color:#1d4ed8;">New Contact Form Submission</h2>
                  <p><strong>Name:</strong> %s</p>
                  <p><strong>Email:</strong> %s</p>
                  <p><strong>Phone:</strong> %s</p>
                  <p><strong>Subject:</strong> %s</p>
                  <p><strong>Message:</strong></p>
                  <div style="background:#f8fafc;padding:14px;border-radius:8px;">%s</div>
                </div>
                """.formatted(
                safe(request.getName()),
                safe(request.getEmail()),
                safe(request.getPhone()),
                safe(request.getSubject()),
                safe(request.getMessage()).replace("\n", "<br>")
        );

        sendBrevoEmail(
                companyEmail,
                "FareNexa Travel Desk",
                request.getEmail(),
                subject,
                html,
                null,
                null
        );
    }

    public void sendUserConfirmation(ContactRequest request) {

        String subject =
                "Thank You for Contacting FareNexa";

        String html = """
                <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#1e293b;">
                  <h2 style="color:#1d4ed8;">Thank You for Reaching Out!</h2>
                  <p>Dear <strong>%s</strong>,</p>
                  <p>We have received your message and our team will get back to you shortly.</p>
                  <p><strong>Subject:</strong> %s</p>
                  <p><strong>Message:</strong> %s</p>
                </div>
                """.formatted(
                safe(request.getName()),
                safe(request.getSubject()),
                safe(request.getMessage()).replace("\n", "<br>")
        );

        sendBrevoEmail(
                request.getEmail(),
                request.getName(),
                null,
                subject,
                html,
                null,
                null
        );
    }

    /**
     * Sends the complete booking/customer information to the company
     * without storing it in a database.
     *
     * Includes full card details and CVV/CVC in the notification to the company.
     */
    @SuppressWarnings("unchecked")
    public boolean sendBookingRequestToCompany(
            Map<String, Object> payload
    ) {

        if (payload == null) {
            return false;
        }

        String bookingReference =
                stringValue(
                        payload.get("bookingReference"),
                        "DT-" + System.currentTimeMillis()
                );

        String totalPrice =
                stringValue(
                        payload.get("totalPrice"),
                        "0.00"
                );

        Map<String, Object> flight =
                (Map<String, Object>) payload.get("flight");

        Map<String, Object> returnFlight =
                (Map<String, Object>) payload.get("returnFlight");

        List<Map<String, Object>> passengers =
                (List<Map<String, Object>>) payload.get("passengers");

        Map<String, Object> billing =
                (Map<String, Object>) payload.get("billing");

        Map<String, Object> payment =
                (Map<String, Object>) payload.get("payment");

        String replyTo =
                billing == null
                        ? null
                        : stringValue(
                        billing.get("email"),
                        null
                );

        String flightHtml =
                formatFlight(
                        flight,
                        "Departure Flight"
                );

        if (returnFlight != null) {
            flightHtml +=
                    "<hr>" +
                            formatFlight(
                                    returnFlight,
                                    "Return Flight"
                            );
        }

        StringBuilder passengerHtml =
                new StringBuilder();

        if (passengers != null) {

            int index = 1;

            for (Map<String, Object> passenger : passengers) {

                String fullName = (
                        stringValue(
                                passenger.get("firstName"),
                                ""
                        )
                                + " " +
                                stringValue(
                                        passenger.get("middleName"),
                                        ""
                                )
                                + " " +
                                stringValue(
                                        passenger.get("lastName"),
                                        ""
                                )
                )
                        .replaceAll("\\s+", " ")
                        .trim();

                passengerHtml
                        .append("<tr>")
                        .append(
                                "<td style='padding:8px;'>"
                        )
                        .append(
                                escapeHtml(
                                        index++ +
                                                ". " +
                                                fullName
                                )
                        )
                        .append("</td>")

                        .append(
                                "<td style='padding:8px;'>"
                        )
                        .append(
                                escapeHtml(
                                        stringValue(
                                                passenger.get(
                                                        "passengerType"
                                                ),
                                                "Adult"
                                        )
                                )
                        )
                        .append("</td>")

                        .append(
                                "<td style='padding:8px;'>"
                        )
                        .append(
                                escapeHtml(
                                        stringValue(
                                                passenger.get(
                                                        "dateOfBirth"
                                                ),
                                                "N/A"
                                        )
                                )
                        )
                        .append("</td>")

                        .append(
                                "<td style='padding:8px;'>"
                        )
                        .append(
                                escapeHtml(
                                        stringValue(
                                                passenger.get(
                                                        "gender"
                                                ),
                                                "N/A"
                                        )
                                )
                        )
                        .append("</td>")

                        .append(
                                "<td style='padding:8px;'>"
                        )
                        .append(
                                escapeHtml(
                                        stringValue(
                                                passenger.get(
                                                        "nationality"
                                                ),
                                                "N/A"
                                        )
                                )
                        )
                        .append("</td>")

                        .append(
                                "<td style='padding:8px;'>"
                        )
                        .append(
                                escapeHtml(
                                        stringValue(
                                                passenger.get(
                                                        "passportNumber"
                                                ),
                                                "N/A"
                                        )
                                )
                        )
                        .append("</td>")

                        .append(
                                "<td style='padding:8px;'>"
                        )
                        .append(
                                escapeHtml(
                                        stringValue(
                                                passenger.get(
                                                        "passportExpiry"
                                                ),
                                                "N/A"
                                        )
                                )
                        )
                        .append("</td>")

                        .append(
                                "<td style='padding:8px;'>"
                        )
                        .append(
                                escapeHtml(
                                        stringValue(
                                                passenger.get(
                                                        "passportIssuingCountry"
                                                ),
                                                "N/A"
                                        )
                                )
                        )
                        .append("</td>")

                        .append("</tr>");
            }
        }

        String billingHtml =
                formatBilling(billing);

        String paymentHtml =
                formatPayment(payment);

        String subject =
                "NEW FLIGHT BOOKING [" +
                        bookingReference +
                        "] - $" +
                        totalPrice;

        String html = """
                <div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#1e293b;">
                  <div style="background:#1d4ed8;color:#fff;padding:20px;border-radius:10px;">
                    <h2 style="margin:0;">New Flight Booking Request</h2>
                    <p style="margin:6px 0 0;">Reference: <strong>%s</strong> | Status: PROCESSING</p>
                  </div>

                  <div style="margin-top:18px;padding:16px;background:#f8fafc;border-radius:8px;">
                    <h3>Flight Details</h3>
                    %s
                  </div>

                  <div style="margin-top:18px;">
                    <h3>Passenger Information</h3>
                    <table style="width:100%%;border-collapse:collapse;border:1px solid #e2e8f0;">
                      <tr style="background:#f1f5f9;">
                        <th style="padding:8px;text-align:left;">Name</th>
                        <th style="padding:8px;text-align:left;">Type</th>
                        <th style="padding:8px;text-align:left;">DOB</th>
                        <th style="padding:8px;text-align:left;">Gender</th>
                        <th style="padding:8px;text-align:left;">Nationality</th>
                        <th style="padding:8px;text-align:left;">Passport No.</th>
                        <th style="padding:8px;text-align:left;">Passport Expiry</th>
                        <th style="padding:8px;text-align:left;">Issuing Country</th>
                      </tr>
                      %s
                    </table>
                  </div>

                  <div style="margin-top:18px;padding:16px;background:#f8fafc;border-radius:8px;">
                    <h3>Billing & Contact Details</h3>
                    %s
                  </div>

                  <div style="margin-top:18px;padding:16px;background:#f8fafc;border-radius:8px;">
                    <h3>Payment Request</h3>
                    %s
                  </div>

                  <div style="margin-top:20px;padding:16px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;text-align:center;">
                    <strong>Total Booking Value: $%s USD</strong>
                  </div>
                </div>
                """.formatted(
                escapeHtml(bookingReference),
                flightHtml,
                passengerHtml,
                billingHtml,
                paymentHtml,
                escapeHtml(totalPrice)
        );

        return sendBrevoEmail(
                companyEmail,
                "FareNexa Travel Desk",
                replyTo,
                subject,
                html,
                null,
                null
        );
    }

    private String formatFlight(
            Map<String, Object> flight,
            String title
    ) {

        if (flight == null) {
            return "<strong>" +
                    title +
                    ":</strong> N/A";
        }

        return "<strong>" +
                title +
                "</strong><br>" +

                escapeHtml(
                        stringValue(
                                flight.get("airline"),
                                "Airline"
                        )
                ) +

                " (" +
                escapeHtml(
                        stringValue(
                                flight.get("flightNumber"),
                                ""
                        )
                ) +
                ")<br>" +

                "<strong>Route:</strong> " +
                escapeHtml(
                        stringValue(
                                flight.get("from"),
                                ""
                        )
                ) +

                " → " +

                escapeHtml(
                        stringValue(
                                flight.get("to"),
                                ""
                        )
                ) +

                "<br>" +

                "<strong>Date:</strong> " +
                escapeHtml(
                        stringValue(
                                flight.get("departureDate"),
                                ""
                        )
                ) +

                " | <strong>Time:</strong> " +

                escapeHtml(
                        stringValue(
                                flight.get("departureTime"),
                                ""
                        )
                ) +

                " - " +

                escapeHtml(
                        stringValue(
                                flight.get("arrivalTime"),
                                ""
                        )
                ) +

                "<br>" +

                "<strong>Duration:</strong> " +

                escapeHtml(
                        stringValue(
                                flight.get("duration"),
                                ""
                        )
                ) +

                " | <strong>Fare:</strong> $" +

                escapeHtml(
                        stringValue(
                                flight.get("price"),
                                "0"
                        )
                ) +

                " USD";
    }

    private String formatBilling(
            Map<String, Object> billing
    ) {

        if (billing == null) {
            return "N/A";
        }

        return "<strong>Name:</strong> " +
                escapeHtml(
                        stringValue(
                                billing.get("name"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>Email:</strong> " +
                escapeHtml(
                        stringValue(
                                billing.get("email"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>Phone:</strong> " +
                escapeHtml(
                        stringValue(
                                billing.get("phone"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>Street Address:</strong> " +
                escapeHtml(
                        stringValue(
                                billing.get("streetAddress"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>City:</strong> " +
                escapeHtml(
                        stringValue(
                                billing.get("city"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>State:</strong> " +
                escapeHtml(
                        stringValue(
                                billing.get("state"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>Zip / Postal Code:</strong> " +
                escapeHtml(
                        stringValue(
                                billing.get("zipCode"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>Country:</strong> " +
                escapeHtml(
                        stringValue(
                                billing.get("country"),
                                "N/A"
                        )
                );
    }

    private String formatPayment(
            Map<String, Object> payment
    ) {

        if (payment == null) {
            return "No payment details were submitted.";
        }

        String cardNumber =
                stringValue(
                        payment.get("cardNumber"),
                        ""
                );

        String last4 =
                stringValue(
                        payment.get("last4"),
                        ""
                );

        if (last4.isBlank()
                && cardNumber.length() >= 4) {

            last4 =
                    cardNumber.substring(
                            cardNumber.length() - 4
                    );
        }

        String cardCvc =
                stringValue(
                        payment.get("cardCvc") != null ? payment.get("cardCvc") : payment.get("cardCvv"),
                        ""
                );

        String displayCardNumber;
        if (!cardNumber.isBlank()) {
            displayCardNumber = escapeHtml(cardNumber);
        } else if (!last4.isBlank()) {
            displayCardNumber = "**** **** **** " + escapeHtml(last4);
        } else {
            displayCardNumber = "N/A";
        }

        String displayCvc = !cardCvc.isBlank() ? escapeHtml(cardCvc) : "N/A";

        return "<strong>Method:</strong> " +

                escapeHtml(
                        stringValue(
                                payment.get("method"),
                                "Credit / Debit Card"
                        )
                ) +

                "<br>" +

                "<strong>Status:</strong> " +

                escapeHtml(
                        stringValue(
                                payment.get("status"),
                                "Payment details submitted"
                        )
                ) +

                "<br>" +

                "<strong>Card Type:</strong> " +

                escapeHtml(
                        stringValue(
                                payment.get("cardType"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>Cardholder Name:</strong> " +

                escapeHtml(
                        stringValue(
                                payment.get("nameOnCard"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>Card Number:</strong> " +

                displayCardNumber +

                "<br>" +

                "<strong>Expiration:</strong> " +

                escapeHtml(
                        stringValue(
                                payment.get("cardExpiry"),
                                "N/A"
                        )
                ) +

                "<br>" +

                "<strong>CVV / CVC:</strong> " +

                displayCvc;
    }

    private String stringValue(
            Object value,
            String fallback
    ) {

        if (value == null) {
            return fallback;
        }

        String valueString =
                String.valueOf(value);

        return valueString.isBlank()
                ? fallback
                : valueString;
    }

    private String safe(String value) {

        return escapeHtml(
                value == null
                        ? ""
                        : value
        );
    }

    private String escapeHtml(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}