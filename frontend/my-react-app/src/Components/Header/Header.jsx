import { useState } from "react";
import {
  PhoneCall,
  Menu,
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.jpg";
import footerLogo from "../../assets/footer-logo.png";

const Header = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // =====================================================
  // MOBILE MENU TOGGLE
  // =====================================================

  const handleMobileMenuToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleNavDestinations = () => {
    setOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById("destinations");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("destinations");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  };

  return (
    <div
      className={`header-wrapper ${isHomePage ? "is-home-header" : ""
        }`}
    >

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <header className="header">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <button
          type="button"
          className="logo logo-button"
          onClick={() => navigate("/")}
        >
          <img
            src={isHomePage ? footerLogo : logo}
            alt="Dream Travel"
          />
        </button>


        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav className="nav-links">

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            type="button"
            onClick={handleNavDestinations}
          >
            Destinations
          </button>

          <button
            type="button"
            onClick={() => navigate("/about")}
          >
            About Us
          </button>

          <button
            type="button"
            onClick={() => navigate("/contact-us")}
          >
            Contact Us
          </button>

        </nav>


        {/* =====================================================
            PHONE
        ===================================================== */}

        <a
          href="tel:+18887526024"
          className="phone-box"
          aria-label="Call Dream Travel at +1-888-752-6024"
        >

          <div className="phone-icon-wrapper">

            <PhoneCall
              size={18}
              strokeWidth={2.2}
            />

          </div>

          <div className="phone-text">

            <span className="phone-title">
              Call 24/7
            </span>
            <span className="phone-number">
              (888) 752-6024
            </span>

          </div>

        </a>





        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          className="menu-btn"
          onClick={handleMobileMenuToggle}
          aria-label="Toggle Menu"
          aria-expanded={open}
        >

          {open ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}

        </button>

      </header>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {open && (

        <div className="mobile-menu">

          {/* HOME */}

          <button
            type="button"
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
          >
            Home
          </button>

          {/* DESTINATIONS */}

          <button
            type="button"
            onClick={handleNavDestinations}
          >
            Destinations
          </button>

          {/* ABOUT */}

          <button
            type="button"
            onClick={() => {
              navigate("/about");
              setOpen(false);
            }}
          >
            About Us
          </button>


          {/* CONTACT */}

          <button
            type="button"
            onClick={() => {
              navigate("/contact-us");
              setOpen(false);
            }}
          >
            Contact Us
          </button>

          {/* CALL LINK IN MOBILE MENU */}
          <a
            href="tel:+18887526024"
            className="mobile-call-link"
            onClick={() => setOpen(false)}
          >
            <PhoneCall size={17} />
            <span>(888) 752-6024</span>
          </a>

        </div>

      )}

    </div>
  );
};

export default Header;