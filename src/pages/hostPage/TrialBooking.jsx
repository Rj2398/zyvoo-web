import { useEffect, useState } from "react";
import useCardDetails from "../../hooks/host/useCardDetails";

const TrialBooking = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const { getCountry, getState, getCity, isLoading } = useCardDetails();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [zipcode, setZipcode] = useState("");

  // When component mounts
  useEffect(() => {
    getCountry().then((data) => setCountries(data.data));
  }, []);

  // When a country is selected
  useEffect(() => {
    if (selectedCountry) {
      getState(selectedCountry).then((data) => {
        setStates(data.data);
        setSelectedState("");
        setCities([]);
      });
    }
  }, [selectedCountry]);

  // When a state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      getCity({ countryCode: selectedCountry, stateCode: selectedState }).then(
        (data) => setCities(data.data)
      );
    }
  }, [selectedState]);

  return (
    <div className="form-group" style={{ width: "100%", margin: "0 auto", marginBottom: "20px" }} >
      {/* Country */}
      <select className="custom-input" value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        style={{
          width: "100%",
          borderRadius: "30px",
          padding: "12px",
          marginTop: "10px",
          border: "1px solid rgb(204, 204, 204)",
        }}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.iso2} value={country.iso2}>
            {country.name} ({country.iso2})
          </option>
        ))}
      </select>

      {/* State */}
      <select className="custom-input" value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        disabled={!selectedCountry}
        style={{
          width: "100%",
          borderRadius: "30px",
          padding: "12px",
          marginTop: "10px",
          border: "1px solid rgb(204, 204, 204)",
        }}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.iso2} value={state.iso2}>
            {state.name} ({state.iso2})
          </option>
        ))}
      </select>

      {/* City */}
      <select className="custom-input" disabled={!selectedState}
        style={{
          width: "100%",
          borderRadius: "30px",
          padding: "12px",
          marginTop: "10px",
          border: "1px solid rgb(204, 204, 204)",
        }}
      >
        <option value="">Select City</option>
        {cities.map((city, index) => (
          <option key={index} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      {/* Zipcode */}
      <input
        type="text"
        name="zipcode"
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
        placeholder="Zipcode"
        className="custom-input"
        style={{
          width: "100%",
          borderRadius: "30px",
          padding: "12px",
          marginTop: "10px",
          border: "1px solid rgb(204, 204, 204)",
        }}
      />
    </div>
  );
};

export default TrialBooking;
