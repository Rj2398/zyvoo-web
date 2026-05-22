import React, { useEffect, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import markerImage from "../../assets/marker.png";

export default function Map({ lat, lng,locationImg ,bookingData}) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState("Fetching address...");

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const [markerPosition, setMarkerPosition] = useState({
    lat: lat ? parseFloat(lat) : 22.572645,
    lng: lng ? parseFloat(lng) : 88.363892,
  });

  const defaultProps = {
    center: markerPosition,
    zoom: 13,
  };

  const fetchAddress = (latitude, longitude) => {
    if (!window.google || !window.google.maps) return;
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: latitude, lng: longitude };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const newAddress = results[0].formatted_address;
        setAddress(newAddress);
        if (markerRef.current) {
          markerRef.current.setTitle(newAddress);
        }
      } else {
        setAddress("Address not found");
        if (markerRef.current) {
          markerRef.current.setTitle("Address not found");
        }
      }
    });
  };

  const openGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank"); // Open in a new tab
  };

  return (
    <>
      {(isMobileWidth || bookingData) && (
        <div
          style={{
            // position: "absolute",
            // top: 20,
            // left: 20,
            // backgroundColor: "#fff",
            // padding: "10px",
            // boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            // borderRadius: "5px",
            // borderBottom: "2px solid black",
            marginBottom: "10px",
            textDecoration : "underline"
          }}
          onClick={openGoogleMaps}
        >
          {/* <strong>Selected Location</strong> <br /> */}
          {address} <br />
        </div>
      )}

      <div
        style={{
          height: isMobileWidth ? "300px" : "400px",
          width: "100%",
          position: "relative",
          marginBottom: "0px",
          borderRadius: isMobileWidth ? "10px" : "",
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onGoogleApiLoaded={({ map, maps }) => {
            mapRef.current = map;
            map.setOptions({
              styles: [
                { elementType: "labels", stylers: [{ visibility: "off" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ visibility: "on" }]},
                { featureType: "poi", stylers: [{ visibility: "off" }]},
                { featureType: "administrative", stylers: [{ visibility: "off" }]},
              ],
            });
            markerRef.current = new maps.Marker({
              position: markerPosition,
              map,
              title: "Selected Location",
              draggable: false,
              icon: {
                url:(locationImg ||  bookingData) ? locationImg:markerImage,
                scaledSize: new window.google.maps.Size(35, 40),
              },
            });

            markerRef.current.addListener("click", (event) => {
              const latLng = event.latLng || markerRef.current.getPosition();
              const newLat = latLng.lat();
              const newLng = latLng.lng();
              setMarkerPosition({ lat: newLat, lng: newLng });
              fetchAddress(newLat, newLng);
            });

            fetchAddress(markerPosition.lat, markerPosition.lng);
          }}
          yesIWantToUseGoogleMapApiInternals
          onClick={({ lat, lng }) => {
            setMarkerPosition({ lat, lng });
            if (markerRef.current) {
              markerRef.current.setPosition({ lat, lng });
              fetchAddress(lat, lng);
            }
          }}
        />

        {/* Address Box - kept exactly as you had it */}

        {!isMobileWidth && !bookingData && (
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              backgroundColor: "#fff",
              padding: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              borderRadius: "5px",
            }}
          >
            <strong>Selected Location</strong> <br />
            {address} <br />
          </div>
        )}
      </div>
    </>
  );
}

// import React, { useRef, useState } from "react";
// import GoogleMapReact from "google-map-react";
// import markerImage from "../../assets/marker.png"

// export default function Map({ lat, lng }) {
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const [address, setAddress] = useState("Fetching address...");
//   const [markerPosition, setMarkerPosition] = useState({
//     lat: lat ? parseFloat(lat) : 22.572645,
//     lng: lng ? parseFloat(lng) : 88.363892,
//   });

//   const defaultProps = {
//     center: markerPosition,
//     zoom: 13,
//   };

//   const fetchAddress = (latitude, longitude) => {
//     if (!window.google || !window.google.maps) return;
//     const geocoder = new window.google.maps.Geocoder();
//     const latlng = { lat: latitude, lng: longitude };

//     geocoder.geocode({ location: latlng }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         const newAddress = results[0].formatted_address;
//         setAddress(newAddress);
//         if (markerRef.current) {
//           markerRef.current.setTitle(newAddress);
//         }
//       } else {
//         setAddress("Address not found");
//         if (markerRef.current) {
//           markerRef.current.setTitle("Address not found");
//         }
//       }
//     });
//   };

//   return (
//     <div
//       style={{
//         height: "400px",
//         width: "100%",
//         position: "relative",
//         marginBottom: "0px",
//       }}
//     >
//       <GoogleMapReact
//         bootstrapURLKeys={{ key: "AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw" }}
//         defaultCenter={defaultProps.center}
//         defaultZoom={defaultProps.zoom}
//         onGoogleApiLoaded={({ map, maps }) => {
//           mapRef.current = map;
//           markerRef.current = new maps.Marker({
//             position: markerPosition,
//             map,
//             title: "Selected Location",
//             draggable: true,
//             icon: {
//           url: markerImage,
//           scaledSize: new window.google.maps.Size(30, 40),
//         },
//           });

//           markerRef.current.addListener("click", (event) => {
//             const latLng = event.latLng || markerRef.current.getPosition();
//             const newLat = latLng.lat();
//             const newLng = latLng.lng();
//             setMarkerPosition({ lat: newLat, lng: newLng });
//             fetchAddress(newLat, newLng);
//           });

//           fetchAddress(markerPosition.lat, markerPosition.lng);
//         }}
//         yesIWantToUseGoogleMapApiInternals
//         onClick={({ lat, lng }) => {
//           setMarkerPosition({ lat, lng });
//           if (markerRef.current) {
//             markerRef.current.setPosition({ lat, lng });
//             fetchAddress(lat, lng);
//           }
//         }}
//       />

//       {/* Address Box - kept exactly as you had it */}
//       <div
//         style={{
//           position: "absolute",
//           top: 20,
//           left: 20,
//           backgroundColor: "#fff",
//           padding: "10px",
//           boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//           borderRadius: "5px",
//         }}
//       >
//         <strong>Selected Location</strong> <br />
//         {address} <br />
//       </div>
//     </div>
//   );
// }
