
import aboutHeroImg from "../../assets/about.png";
import "./About.css";

function About() {
    return (
        <main className="about-page">

            {/* =================================================
               ABOUT HERO
            ================================================= */}

            <section className="about-hero">
                <div
                    className="about-hero-backdrop"
                    style={{ backgroundImage: `url(${aboutHeroImg})` }}
                ></div>

                <img
                    src={aboutHeroImg}
                    alt="About Dream Travel"
                    className="about-hero-image"
                />

                <div className="about-hero-overlay"></div>

                <div className="about-hero-content">
                    <h1>About Us</h1>


                </div>
            </section>


            {/* =================================================
               ABOUT INTRO
            ================================================= */}

            <section className="about-section">
                <div className="about-container about-intro">

                    <div className="about-intro-content">

                        <span className="about-label">
                            ABOUT DREAM TRAVEL
                        </span>

                        <h2>
                            Your Smarter Way to
                            <span> Search &amp; Book Flights</span>
                        </h2>

                        <p>
                            Welcome to Dream Travel, a modern flight booking
                            platform designed to make finding and booking
                            flights simple, convenient, and transparent.
                            Whether you're planning a short domestic trip or
                            an international journey, we help you explore
                            flight options that fit your travel plans.
                        </p>

                        <p>
                            From searching available flights and comparing
                            fares to selecting seats and customizing your
                            booking, Dream Travel brings the essential parts
                            of your flight journey together in one
                            easy-to-use experience.
                        </p>

                    </div>

                    <div className="about-intro-highlight">

                        <div className="about-highlight-icon">
                            ✈
                        </div>

                        <h3>
                            Travel Made Simpler
                        </h3>

                        <p>
                            Discover flights, compare options, customize
                            your journey, and complete your booking through
                            one convenient platform.
                        </p>

                    </div>

                </div>
            </section>


            {/* =================================================
               WHO WE ARE
            ================================================= */}

            <section className="about-section about-light-section">
                <div className="about-container">

                    <div className="about-section-title">
                        <span>WHO WE ARE</span>
                        <h2>Making Flight Booking Easier</h2>
                    </div>

                    <div className="about-text-content">

                        <p>
                            Dream Travel is a flight-focused booking platform
                            built for travelers who want a straightforward way
                            to discover and book flights online.
                        </p>

                        <p>
                            Our platform connects travelers with available
                            flight options and provides a convenient booking
                            journey from flight search to confirmation.
                        </p>

                        <p>
                            We focus on keeping the booking experience clear
                            and user-friendly, so travelers can review flight
                            details, passenger information, seat options, and
                            additional services before completing their
                            booking.
                        </p>

                    </div>

                </div>
            </section>


            {/* =================================================
               WHAT WE OFFER
            ================================================= */}

            <section className="about-section">
                <div className="about-container">

                    <div className="about-section-title">
                        <span>WHAT WE OFFER</span>
                        <h2>Everything You Need for Your Journey</h2>

                        <p>
                            Explore a simple and convenient flight booking
                            experience designed around modern travelers.
                        </p>
                    </div>

                    <div className="about-services">

                        <div className="about-service">
                            <div className="service-number">01</div>

                            <h3>Flight Search</h3>

                            <p>
                                Find domestic and international flights
                                according to your destinations, dates,
                                passengers, and preferred cabin class.
                            </p>

                            <ul>
                                <li>Domestic &amp; international flights</li>
                                <li>One-way &amp; round-trip options</li>
                                <li>Flexible travel dates</li>
                                <li>Multiple cabin classes</li>
                            </ul>
                        </div>


                        <div className="about-service">
                            <div className="service-number">02</div>

                            <h3>Flight Comparison</h3>

                            <p>
                                Explore available options and review the
                                important details before choosing your flight.
                            </p>

                            <ul>
                                <li>Compare available flights</li>
                                <li>Review fares and flight details</li>
                                <li>Check departure &amp; arrival times</li>
                                <li>Explore stops and airlines</li>
                            </ul>
                        </div>


                        <div className="about-service">
                            <div className="service-number">03</div>

                            <h3>Easy Booking</h3>

                            <p>
                                Complete your booking through a simple and
                                organized passenger and payment journey.
                            </p>

                            <ul>
                                <li>Simple passenger information</li>
                                <li>Booking review before payment</li>
                                <li>Optional seat selection</li>
                                <li>Convenient online booking</li>
                            </ul>
                        </div>


                        <div className="about-service">
                            <div className="service-number">04</div>

                            <h3>Travel Customization</h3>

                            <p>
                                Personalize your journey with available
                                services and booking options.
                            </p>

                            <ul>
                                <li>Seat selection options</li>
                                <li>Additional travel services</li>
                                <li>Baggage &amp; meal services</li>
                                <li>Booking details in one place</li>
                            </ul>
                        </div>

                    </div>

                </div>
            </section>


            {/* =================================================
               OUR MISSION
            ================================================= */}

            <section className="about-mission">
                <div className="about-container">
                    <div className="about-mission-card">
                        <span className="about-mission-badge">OUR MISSION</span>

                        <h2>
                            Making Every Journey
                            <br />
                            <span className="about-mission-highlight">Simpler to Plan</span>
                        </h2>

                        <div className="about-mission-line"></div>

                        <p>
                            Our mission is to bring flight discovery, comparison,
                            customization, and booking together in one seamless
                            online experience.
                        </p>

                        <p>
                            We aim to give travelers the information and
                            flexibility they need to make confident travel
                            decisions while keeping the booking process simple
                            from search to confirmation.
                        </p>
                    </div>
                </div>
            </section>


            {/* =================================================
               WHY CHOOSE DREAM TRAVEL
            ================================================= */}

            <section className="about-section">
                <div className="about-container">

                    <div className="about-section-title">
                        <span>WHY DREAM TRAVEL</span>

                        <h2>
                            Designed Around Travelers
                        </h2>

                        <p>
                            Every part of the platform is designed to make
                            flight discovery and booking easier.
                        </p>
                    </div>


                    <div className="about-why-content">

                        <div className="about-why-item">
                            <span>01</span>
                            <div>
                                <h3>Simple Flight Search</h3>

                                <p>
                                    Search flights using your preferred
                                    destinations, dates, passengers, and
                                    cabin class through a straightforward
                                    search experience.
                                </p>
                            </div>
                        </div>


                        <div className="about-why-item">
                            <span>02</span>
                            <div>
                                <h3>Explore Your Options</h3>

                                <p>
                                    Review available flights and compare
                                    fares, timings, stops, airlines, and
                                    journey duration.
                                </p>
                            </div>
                        </div>


                        <div className="about-why-item">
                            <span>03</span>
                            <div>
                                <h3>Flexible Booking Experience</h3>

                                <p>
                                    Customize your journey with available
                                    seat and additional service options
                                    before completing your booking.
                                </p>
                            </div>
                        </div>


                        <div className="about-why-item">
                            <span>04</span>
                            <div>
                                <h3>Clear Booking Details</h3>

                                <p>
                                    Review your flight, passenger, and booking
                                    information before moving forward with
                                    payment.
                                </p>
                            </div>
                        </div>


                        <div className="about-why-item">
                            <span>05</span>
                            <div>
                                <h3>Secure Booking Process</h3>

                                <p>
                                    A reliable booking flow keeps your travel
                                    and booking information organized
                                    throughout the process.
                                </p>
                            </div>
                        </div>


                        <div className="about-why-item">
                            <span>06</span>
                            <div>
                                <h3>Built for Travelers</h3>

                                <p>
                                    The platform is designed around making
                                    flight discovery and booking easier and
                                    more convenient.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </section>


            {/* =================================================
               VISION
            ================================================= */}

            <section className="about-section about-light-section">

                <div className="about-container about-vision">

                    <div>
                        <span className="about-label">
                            OUR VISION
                        </span>

                        <h2>
                            A Better Way to Plan
                            Your Next Journey
                        </h2>
                    </div>

                    <p>
                        Our vision is to create a convenient flight booking
                        platform where travelers can discover suitable flight
                        options and complete their journey with confidence.
                        We are committed to continuously improving the
                        booking experience by making search, comparison,
                        customization, and booking easier.
                    </p>

                </div>

            </section>


            {/* =================================================
               CONTACT US
            ================================================= */}

            <section className="about-contact-section">

                <div className="about-container">

                    <div className="about-contact-box">

                        <div className="about-contact-content">

                            <span>NEED HELP?</span>

                            <h2>
                                We're Here for Your
                                Travel Questions
                            </h2>

                            <p>
                                Have questions about your flight booking or
                                travel plans? Our customer support team is
                                here to help with your inquiries.
                            </p>

                        </div>


                        <div className="about-contact-details">

                            <div>
                                <strong>Email</strong>
                                <span>info@dreamtravel.com</span>
                            </div>

                            <div>
                                <strong>Toll-Free</strong>
                                <span>+1-844-317-9052</span>
                            </div>

                        </div>

                    </div>


                    <p className="about-contact-last">
                        Planning your next trip? Start by searching for your
                        flight and discover a simpler way to book your journey
                        with Dream Travel.
                    </p>

                </div>

            </section>

        </main>
    );
}

export default About;
