import React, { useEffect, useRef } from "react";

const LocationAutoComplete = ({
  apiKey,
  city,
  setCity,
  setAddress,
  setLocation,
  setFormData,
  placeholder = "Search for a city...",
  className = "",
  style = {},
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Load the Google Maps script only if it hasn't already been loaded
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete(); // Already loaded
        return;
      }

      if (document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)) {
        // If the script tag is already present, don't load again
        const waitForGoogle = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(waitForGoogle);
            initAutocomplete();
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        initAutocomplete();
      };

      document.body.appendChild(script);
    };

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["(cities)"],
      });

      autocompleteRef.current.setFields(["address_components", "formatted_address", "geometry"]);

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();

        if (!place || !place.address_components) return;

        setAddress?.(place.formatted_address || "");

        const lat = place.geometry?.location?.lat?.();
        const lng = place.geometry?.location?.lng?.();
        if (lat && lng) {
          setLocation?.({ lat, long: lng });
        }

        const cityComponent = place.address_components.find((component) =>
          component.types.includes("locality")
        );

        const selectedCity = cityComponent?.long_name || "";
        setCity?.(selectedCity);
        setFormData?.((prev) => ({ ...prev, city: selectedCity }));
      });
    };

    loadGoogleMapsScript();
  }, [apiKey, setCity, setAddress, setLocation, setFormData]);

  return (
    <input
      ref={inputRef}
      defaultValue={city}
      onChange={(e) => setCity?.(e.target.value)}
      placeholder={placeholder}
      className={className}
      style={{
        width: "100%",
        border: "1px solid grey",
        borderRadius: "30px",
        padding: "12px",
        color: "black",
        ...style,
      }}
    />
  );
};

export default React.memo(LocationAutoComplete);
