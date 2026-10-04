/**
 * Comprehensive Local Airport Database
 * Instant 0ms autocomplete for top domestic & international destinations
 * Zero database dependency.
 */

export const POPULAR_AIRPORTS = [
    // INDIA (IN)
    { id: "DEL", cityName: "New Delhi", airportName: "Indira Gandhi International Airport", airportCode: "DEL", country: "India" },
    { id: "BOM", cityName: "Mumbai", airportName: "Chhatrapati Shivaji Maharaj International Airport", airportCode: "BOM", country: "India" },
    { id: "BLR", cityName: "Bengaluru", airportName: "Kempegowda International Airport", airportCode: "BLR", country: "India" },
    { id: "MAA", cityName: "Chennai", airportName: "Chennai International Airport", airportCode: "MAA", country: "India" },
    { id: "CCU", cityName: "Kolkata", airportName: "Netaji Subhash Chandra Bose International Airport", airportCode: "CCU", country: "India" },
    { id: "HYD", cityName: "Hyderabad", airportName: "Rajiv Gandhi International Airport", airportCode: "HYD", country: "India" },
    { id: "AMD", cityName: "Ahmedabad", airportName: "Sardar Vallabhbhai Patel International Airport", airportCode: "AMD", country: "India" },
    { id: "PNQ", cityName: "Pune", airportName: "Pune International Airport", airportCode: "PNQ", country: "India" },
    { id: "GOI", cityName: "Goa (Dabolim)", airportName: "Dabolim International Airport", airportCode: "GOI", country: "India" },
    { id: "GOX", cityName: "Goa (Mopa)", airportName: "Manohar International Airport", airportCode: "GOX", country: "India" },
    { id: "JAI", cityName: "Jaipur", airportName: "Jaipur International Airport", airportCode: "JAI", country: "India" },
    { id: "LKO", cityName: "Lucknow", airportName: "Chaudhary Charan Singh International Airport", airportCode: "LKO", country: "India" },
    { id: "COK", cityName: "Kochi", airportName: "Cochin International Airport", airportCode: "COK", country: "India" },
    { id: "TRV", cityName: "Thiruvananthapuram", airportName: "Trivandrum International Airport", airportCode: "TRV", country: "India" },
    { id: "GAU", cityName: "Guwahati", airportName: "Lokpriya Gopinath Bordoloi International Airport", airportCode: "GAU", country: "India" },
    { id: "IXC", cityName: "Chandigarh", airportName: "Shaheed Bhagat Singh International Airport", airportCode: "IXC", country: "India" },
    { id: "PAT", cityName: "Patna", airportName: "Jay Prakash Narayan Airport", airportCode: "PAT", country: "India" },
    { id: "BBI", cityName: "Bhubaneswar", airportName: "Biju Patnaik International Airport", airportCode: "BBI", country: "India" },
    { id: "IDR", cityName: "Indore", airportName: "Devi Ahilyabai Holkar Airport", airportCode: "IDR", country: "India" },
    { id: "VNS", cityName: "Varanasi", airportName: "Lal Bahadur Shastri International Airport", airportCode: "VNS", country: "India" },
    { id: "SXR", cityName: "Srinagar", airportName: "Sheikh ul-Alam International Airport", airportCode: "SXR", country: "India" },
    { id: "IXL", cityName: "Leh", airportName: "Kushok Bakula Rimpochee Airport", airportCode: "IXL", country: "India" },
    { id: "UDR", cityName: "Udaipur", airportName: "Maharana Pratap Airport", airportCode: "UDR", country: "India" },
    { id: "ATQ", cityName: "Amritsar", airportName: "Sri Guru Ram Dass Jee International Airport", airportCode: "ATQ", country: "India" },

    // UNITED STATES (US)
    { id: "JFK", cityName: "New York", airportName: "John F. Kennedy International Airport", airportCode: "JFK", country: "United States" },
    { id: "EWR", cityName: "Newark", airportName: "Newark Liberty International Airport", airportCode: "EWR", country: "United States" },
    { id: "LGA", cityName: "New York", airportName: "LaGuardia Airport", airportCode: "LGA", country: "United States" },
    { id: "LAX", cityName: "Los Angeles", airportName: "Los Angeles International Airport", airportCode: "LAX", country: "United States" },
    { id: "SFO", cityName: "San Francisco", airportName: "San Francisco International Airport", airportCode: "SFO", country: "United States" },
    { id: "ORD", cityName: "Chicago", airportName: "O'Hare International Airport", airportCode: "ORD", country: "United States" },
    { id: "DFW", cityName: "Dallas", airportName: "Dallas/Fort Worth International Airport", airportCode: "DFW", country: "United States" },
    { id: "MIA", cityName: "Miami", airportName: "Miami International Airport", airportCode: "MIA", country: "United States" },
    { id: "ATL", cityName: "Atlanta", airportName: "Hartsfield-Jackson Atlanta International Airport", airportCode: "ATL", country: "United States" },
    { id: "SEA", cityName: "Seattle", airportName: "Seattle-Tacoma International Airport", airportCode: "SEA", country: "United States" },
    { id: "BOS", cityName: "Boston", airportName: "Logan International Airport", airportCode: "BOS", country: "United States" },
    { id: "DEN", cityName: "Denver", airportName: "Denver International Airport", airportCode: "DEN", country: "United States" },
    { id: "LAS", cityName: "Las Vegas", airportName: "Harry Reid International Airport", airportCode: "LAS", country: "United States" },
    { id: "MCO", cityName: "Orlando", airportName: "Orlando International Airport", airportCode: "MCO", country: "United States" },
    { id: "IAD", cityName: "Washington", airportName: "Washington Dulles International Airport", airportCode: "IAD", country: "United States" },
    { id: "PHX", cityName: "Phoenix", airportName: "Phoenix Sky Harbor International Airport", airportCode: "PHX", country: "United States" },
    { id: "IAH", cityName: "Houston", airportName: "George Bush Intercontinental Airport", airportCode: "IAH", country: "United States" },

    // UNITED KINGDOM & EUROPE
    { id: "LHR", cityName: "London", airportName: "Heathrow Airport", airportCode: "LHR", country: "United Kingdom" },
    { id: "LGW", cityName: "London", airportName: "Gatwick Airport", airportCode: "LGW", country: "United Kingdom" },
    { id: "MAN", cityName: "Manchester", airportName: "Manchester Airport", airportCode: "MAN", country: "United Kingdom" },
    { id: "EDI", cityName: "Edinburgh", airportName: "Edinburgh Airport", airportCode: "EDI", country: "United Kingdom" },
    { id: "CDG", cityName: "Paris", airportName: "Charles de Gaulle Airport", airportCode: "CDG", country: "France" },
    { id: "ORY", cityName: "Paris", airportName: "Paris Orly Airport", airportCode: "ORY", country: "France" },
    { id: "FRA", cityName: "Frankfurt", airportName: "Frankfurt Airport", airportCode: "FRA", country: "Germany" },
    { id: "MUC", cityName: "Munich", airportName: "Munich Airport", airportCode: "MUC", country: "Germany" },
    { id: "AMS", cityName: "Amsterdam", airportName: "Amsterdam Airport Schiphol", airportCode: "AMS", country: "Netherlands" },
    { id: "FCO", cityName: "Rome", airportName: "Leonardo da Vinci–Fiumicino Airport", airportCode: "FCO", country: "Italy" },
    { id: "MXP", cityName: "Milan", airportName: "Milan Malpensa Airport", airportCode: "MXP", country: "Italy" },
    { id: "MAD", cityName: "Madrid", airportName: "Adolfo Suárez Madrid–Barajas Airport", airportCode: "MAD", country: "Spain" },
    { id: "BCN", cityName: "Barcelona", airportName: "Josep Tarradellas Barcelona-El Prat Airport", airportCode: "BCN", country: "Spain" },
    { id: "ZRH", cityName: "Zurich", airportName: "Zurich Airport", airportCode: "ZRH", country: "Switzerland" },
    { id: "VIE", cityName: "Vienna", airportName: "Vienna International Airport", airportCode: "VIE", country: "Austria" },
    { id: "DUB", cityName: "Dublin", airportName: "Dublin Airport", airportCode: "DUB", country: "Ireland" },
    { id: "IST", cityName: "Istanbul", airportName: "Istanbul Airport", airportCode: "IST", country: "Turkey" },

    // MIDDLE EAST
    { id: "DXB", cityName: "Dubai", airportName: "Dubai International Airport", airportCode: "DXB", country: "United Arab Emirates" },
    { id: "AUH", cityName: "Abu Dhabi", airportName: "Zayed International Airport", airportCode: "AUH", country: "United Arab Emirates" },
    { id: "DOH", cityName: "Doha", airportName: "Hamad International Airport", airportCode: "DOH", country: "Qatar" },
    { id: "RUH", cityName: "Riyadh", airportName: "King Khalid International Airport", airportCode: "RUH", country: "Saudi Arabia" },
    { id: "JED", cityName: "Jeddah", airportName: "King Abdulaziz International Airport", airportCode: "JED", country: "Saudi Arabia" },
    { id: "KWI", cityName: "Kuwait City", airportName: "Kuwait International Airport", airportCode: "KWI", country: "Kuwait" },
    { id: "MCT", cityName: "Muscat", airportName: "Muscat International Airport", airportCode: "MCT", country: "Oman" },
    { id: "BAH", cityName: "Manama", airportName: "Bahrain International Airport", airportCode: "BAH", country: "Bahrain" },

    // ASIA PACIFIC
    { id: "SIN", cityName: "Singapore", airportName: "Singapore Changi Airport", airportCode: "SIN", country: "Singapore" },
    { id: "BKK", cityName: "Bangkok", airportName: "Suvarnabhumi Airport", airportCode: "BKK", country: "Thailand" },
    { id: "DMK", cityName: "Bangkok", airportName: "Don Mueang International Airport", airportCode: "DMK", country: "Thailand" },
    { id: "HKT", cityName: "Phuket", airportName: "Phuket International Airport", airportCode: "HKT", country: "Thailand" },
    { id: "KUL", cityName: "Kuala Lumpur", airportName: "Kuala Lumpur International Airport", airportCode: "KUL", country: "Malaysia" },
    { id: "DPS", cityName: "Bali", airportName: "Ngurah Rai International Airport", airportCode: "DPS", country: "Indonesia" },
    { id: "CGK", cityName: "Jakarta", airportName: "Soekarno–Hatta International Airport", airportCode: "CGK", country: "Indonesia" },
    { id: "HND", cityName: "Tokyo", airportName: "Tokyo Haneda Airport", airportCode: "HND", country: "Japan" },
    { id: "NRT", cityName: "Tokyo", airportName: "Narita International Airport", airportCode: "NRT", country: "Japan" },
    { id: "ICN", cityName: "Seoul", airportName: "Incheon International Airport", airportCode: "ICN", country: "South Korea" },
    { id: "HKG", cityName: "Hong Kong", airportName: "Hong Kong International Airport", airportCode: "HKG", country: "Hong Kong" },
    { id: "SYD", cityName: "Sydney", airportName: "Sydney Kingsford Smith Airport", airportCode: "SYD", country: "Australia" },
    { id: "MEL", cityName: "Melbourne", airportName: "Melbourne Airport", airportCode: "MEL", country: "Australia" },
    { id: "AKL", cityName: "Auckland", airportName: "Auckland Airport", airportCode: "AKL", country: "New Zealand" },
    { id: "YYZ", cityName: "Toronto", airportName: "Toronto Pearson International Airport", airportCode: "YYZ", country: "Canada" },
    { id: "YVR", cityName: "Vancouver", airportName: "Vancouver International Airport", airportCode: "YVR", country: "Canada" },
];

/**
 * Searches local airports database with fuzzy keyword match
 */
export function searchLocalAirports(query) {
    if (!query || !query.trim()) return POPULAR_AIRPORTS.slice(0, 10);
    const q = query.trim().toLowerCase();

    return POPULAR_AIRPORTS.filter((item) => {
        return (
            item.airportCode.toLowerCase().includes(q) ||
            item.cityName.toLowerCase().includes(q) ||
            item.airportName.toLowerCase().includes(q) ||
            item.country.toLowerCase().includes(q)
        );
    }).slice(0, 10);
}
