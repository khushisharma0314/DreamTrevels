import React from "react";
import { PhoneCall } from "lucide-react";
import "./FloatingCallButton.css";

const FloatingCallButton = () => {
  return (
    <aside aria-label="Quick Phone Call" className="floating-call-container">
      <a
        href="tel:+18887526024"
        className="floating-call-btn"
        aria-label="Call Dream Travel at +1-888-752-6024"
      >
        <span className="floating-call-ripple"></span>
        <div className="floating-call-icon-wrap">
          <PhoneCall size={22} strokeWidth={2.4} />
        </div>
        <div className="floating-call-content">
          <span className="floating-call-sub">Call 24/7</span>
          <span className="floating-call-number">(888) 752-6024</span>
        </div>
      </a>
    </aside>
  );
};

export default FloatingCallButton;
