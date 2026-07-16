import React, { useRef, useState, useEffect, useCallback } from "react";
import GoogleMapReact from "google-map-react";

const MultipleMarkerMap = ({ locations, currentLocation, isMobileWidth }) => {
  // console.log(locations, "locationssss*****");
  const mapRef = useRef(null);
  const mapsRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  // 1. Valid coordinates filter aur parse karein (0.00 lat/long ko hatakar)
  const parsedLocations = locations
    .filter(
      (loc) => loc.latitude && loc.longitude && parseFloat(loc.latitude) !== 0
    )
    .map((loc) => ({
      ...loc,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
    }));

  // Haversine Formula distance calculate karne ke liye (KM mein)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth Radius in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const updateMap = useCallback(() => {
    const map = mapRef.current;
    const maps = mapsRef.current;

    if (!map || !maps) return;

    // Purane markers clean karein taaki duplicate glitch na ho
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (parsedLocations.length > 0) {
      if (
        currentLocation &&
        currentLocation.latitude &&
        currentLocation.longitude
      ) {
        let nearestLoc = parsedLocations[0];
        let minDistance = Infinity;

        // Ekdum simple logic: Array ki sabhi properties mein se jo aapke system ke sabse paas hai, use dhoondho
        parsedLocations.forEach((location) => {
          const dist = getDistance(
            parseFloat(currentLocation.latitude),
            parseFloat(currentLocation.longitude),
            location.latitude,
            location.longitude
          );
          if (dist < minDistance) {
            minDistance = dist;
            nearestLoc = location;
          }
        });

        if (nearestLoc) {
          console.log("🎯 Final Target Zoom Location Details:", {
            property_id: nearestLoc.property_id,
            location_name: nearestLoc.title,
            host_address: nearestLoc.host_address,
            latitude: nearestLoc.latitude,
            longitude: nearestLoc.longitude,
            zoomLevel: 17,
          });

          const targetCenter = new maps.LatLng(
            nearestLoc.latitude,
            nearestLoc.longitude
          );
          map.setCenter(targetCenter);
          map.setZoom(17); // Street level zoom executed
        }
      } else {
        const bounds = new maps.LatLngBounds();
        parsedLocations.forEach((loc) =>
          bounds.extend(new maps.LatLng(loc.latitude, loc.longitude))
        );
        map.fitBounds(bounds);
      }
    }

    // Saare markers render karne ka loop
    parsedLocations.forEach((location) => {
      const position = new maps.LatLng(location.latitude, location.longitude);
      const markerDiv = document.createElement("div");

      markerDiv.innerHTML = `
        <span style="
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 20px;
          background: white;
          border-radius: 30px; 
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        ">
          <img src="/images/filters/time.svg" width="20px" loading="lazy" alt="time-icon" style="margin-right: 10px;" />
          $${parseInt(location.hourly_rate)} /h
        </span>
      `;

      const CustomMarker = function () {
        this.div = markerDiv;
      };
      CustomMarker.prototype = new maps.OverlayView();
      CustomMarker.prototype.onAdd = function () {
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div);
      };
      CustomMarker.prototype.draw = function () {
        const projection = this.getProjection();
        const point = projection.fromLatLngToDivPixel(position);
        if (point && this.div) {
          this.div.style.position = "absolute";
          this.div.style.left = `${point.x}px`;
          this.div.style.top = `${point.y}px`;
          this.div.style.transform = "translate(-50%, -100%)";
        }
      };
      CustomMarker.prototype.onRemove = function () {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
        }
      };

      const customMarker = new CustomMarker();
      customMarker.setMap(map);
      markersRef.current.push(customMarker);

      markerDiv.addEventListener("click", () => {
        window.location.href = `/location/${location.property_id}`;
      });
    });
  }, [currentLocation, locations]);

  useEffect(() => {
    if (mapReady) {
      updateMap();
    }
  }, [mapReady, updateMap]);

  const handleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    mapsRef.current = maps;

    const mapDiv = map.getDiv();
    mapDiv.style.borderRadius = isMobileWidth ? "0px" : "20px";
    mapDiv.style.overflow = "hidden";

    setMapReady(true);
  };

  const createMapOptions = (maps) => {
    return {
      styles: [
        {
          featureType: "administrative.country",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.state",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.city",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.street",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      disableDefaultUI: true,
    };
  };

  return (
    <div
      style={{
        height: isMobileWidth ? "100%" : "80%",
        width: "100%",
        zIndex: 999999,
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw" }}
        defaultCenter={{
          lat: currentLocation?.latitude,
          lng: currentLocation?.longitude,
        }}
        defaultZoom={10}
        options={createMapOptions}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
      />
    </div>
  );
};

export default React.memo(MultipleMarkerMap);

// import React, { useRef, useState } from "react";
// import GoogleMapReact from "google-map-react";
// import { Link, useLocation } from "react-router-dom";

// const MultipleMarkerMap = ({ locations, currentLocation, isMobileWidth }) => {
//   const mapRef = useRef(null);
//   const mapsRef = useRef(null);
//   const [currentZoom, setCurrentZoom] = useState(10);

//   const parsedLocations = locations.map((loc) => ({
//     ...loc,
//     latitude: parseFloat(loc.latitude),
//     longitude: parseFloat(loc.longitude),
//   }));

//   // Helper function to calculate distance (Haversine formula)
//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the earth in km
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   const handleApiLoaded = ({ map, maps }) => {
//     mapRef.current = map;
//     mapsRef.current = maps;

//     const mapDiv = map.getDiv();
//     mapDiv.style.borderRadius = isMobileWidth ? "0px" : "20px";
//     mapDiv.style.overflow = "hidden";

//     // --- ZOOM TO NEAREST LOCATION LOGIC ---
//     if (currentLocation && parsedLocations.length > 0) {
//       let nearestLoc = parsedLocations[0];
//       let minDistance = Infinity;

//       parsedLocations.forEach((location) => {
//         const dist = getDistance(
//           parseFloat(currentLocation.latitude),
//           parseFloat(currentLocation.longitude),
//           location.latitude,
//           location.longitude
//         );
//         if (dist < minDistance) {
//           minDistance = dist;
//           nearestLoc = location;
//         }
//       });

//       // Center map on the closest location and set a tighter zoom level
//       const targetCenter = new maps.LatLng(
//         nearestLoc.latitude,
//         nearestLoc.longitude
//       );
//       map.setCenter(targetCenter);
//       map.setZoom(17); // Set to 17 as requested
//       setCurrentZoom(17);
//     } else if (parsedLocations.length > 0) {
//       // Fallback: If no currentLocation is provided, fit all bounds as before
//       const bounds = new maps.LatLngBounds();
//       parsedLocations.forEach((loc) =>
//         bounds.extend(new maps.LatLng(loc.latitude, loc.longitude))
//       );
//       map.fitBounds(bounds);
//     }

//     // --- RENDER MARKERS ---
//     parsedLocations.forEach((location) => {
//       const position = new maps.LatLng(location.latitude, location.longitude);

//       const markerDiv = document.createElement("div");
//       markerDiv.innerHTML = `
//         <span style="
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           padding: 10px 20px;
//           background: white;
//           border-radius: 30px;
//           font-family: sans-serif;
//           font-size: 14px;
//           font-weight: 500;
//           box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
//           cursor: pointer;
//         ">
//           <img
//             src="/images/filters/time.svg"
//             width="20px"
//             loading="lazy" alt="time-icon"
//             style="margin-right: 10px;"
//           />
//           $${parseInt(location.hourly_rate)} /h
//         </span>
//       `;

//       const CustomMarker = function () {
//         this.div = markerDiv;
//       };

//       CustomMarker.prototype = new maps.OverlayView();
//       CustomMarker.prototype.onAdd = function () {
//         const panes = this.getPanes();
//         panes.overlayMouseTarget.appendChild(this.div);
//       };
//       CustomMarker.prototype.draw = function () {
//         const projection = this.getProjection();
//         const point = projection.fromLatLngToDivPixel(position);
//         if (point && this.div) {
//           this.div.style.position = "absolute";
//           this.div.style.left = `${point.x}px`;
//           this.div.style.top = `${point.y}px`;
//           this.div.style.transform = "translate(-50%, -100%)";
//         }
//       };
//       CustomMarker.prototype.onRemove = function () {
//         if (this.div && this.div.parentNode) {
//           this.div.parentNode.removeChild(this.div);
//         }
//       };

//       const customMarker = new CustomMarker();
//       customMarker.setMap(map);

//       markerDiv.addEventListener("click", () => {
//         window.location.href = `/location/${location.property_id}`;
//       });
//     });
//   };

//   const createMapOptions = (maps) => {
//     return {
//       styles: [
//         {
//           featureType: "administrative.country",
//           elementType: "labels",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "administrative.state",
//           elementType: "labels",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "administrative.city",
//           elementType: "labels",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "administrative.street",
//           elementType: "labels",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "transit",
//           elementType: "labels",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "poi",
//           elementType: "labels",
//           stylers: [{ visibility: "off" }],
//         },
//       ],
//       disableDefaultUI: true,
//     };
//   };

//   return (
//     <div
//       style={{
//         height: isMobileWidth ? "100%" : "80%",
//         width: "100%",
//         zIndex: 999999,
//       }}
//     >
//       <GoogleMapReact
//         bootstrapURLKeys={{ key: "AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw" }}
//         defaultCenter={{
//           lat: currentLocation?.latitude ,
//           lng: currentLocation?.longitude ,
//         }}
//         defaultZoom={1}
//         options={createMapOptions}
//         yesIWantToUseGoogleMapApiInternals
//         onGoogleApiLoaded={handleApiLoaded}
//       />
//     </div>
//   );
// };

// export default React.memo(MultipleMarkerMap);

// import React, { useRef, useState } from "react";
// import GoogleMapReact from "google-map-react";
// import { Link, useLocation } from "react-router-dom";

// const MultipleMarkerMap = ({ locations, currentLocation, isMobileWidth }) => {
//   const mapRef = useRef(null);
//   const mapsRef = useRef(null);
//   const [currentZoom, setCurrentZoom] = useState(10);

//   const parsedLocations = locations.map((loc) => ({
//     ...loc,
//     latitude: parseFloat(loc.latitude),
//     longitude: parseFloat(loc.longitude),
//   }));

//   const handleApiLoaded = ({ map, maps }) => {
//     mapRef.current = map;
//     mapsRef.current = maps;

//     const mapDiv = map.getDiv();
//     mapDiv.style.borderRadius = isMobileWidth ? "0px" : "20px";
//     mapDiv.style.overflow = "hidden";

//     const bounds = new maps.LatLngBounds();

//     parsedLocations.forEach((location) => {
//       const position = new maps.LatLng(location.latitude, location.longitude);
//       bounds.extend(position);

//       const markerDiv = document.createElement("div");
//       markerDiv.innerHTML = `
//         <span style="
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           padding: 10px 20px;
//           background: white;
//           border-radius: 30px; /* More circular look */
//           font-family: sans-serif;
//           font-size: 14px;
//           font-weight: 500;
//           box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
//           cursor: pointer;
//         ">
//           <img
//             src="/images/filters/time.svg"
//             width="20px"
//             loading="lazy" alt="time-icon"
//             style="margin-right: 10px;"
//           />
//           $${parseInt(location.hourly_rate)} /h
//         </span>
//       `;

//       const CustomMarker = function () {
//         this.div = markerDiv;
//       };

//       CustomMarker.prototype = new maps.OverlayView();
//       CustomMarker.prototype.onAdd = function () {
//         const panes = this.getPanes();
//         panes.overlayMouseTarget.appendChild(this.div);
//       };
//       CustomMarker.prototype.draw = function () {
//         const projection = this.getProjection();
//         const point = projection.fromLatLngToDivPixel(position);
//         if (point && this.div) {
//           this.div.style.position = "absolute";
//           this.div.style.left = `${point.x}px`;
//           this.div.style.top = `${point.y}px`;
//           this.div.style.transform = "translate(-50%, -100%)";
//         }
//       };
//       CustomMarker.prototype.onRemove = function () {
//         if (this.div && this.div.parentNode) {
//           this.div.parentNode.removeChild(this.div);
//         }
//       };

//       const customMarker = new CustomMarker();
//       customMarker.setMap(map);

//       markerDiv.addEventListener("click", () => {
//         window.location.href = `/location/${location.property_id}`;
//       });
//     });

//     map.fitBounds(bounds);

//     setTimeout(() => {
//       const initialZoom = map.getZoom();
//       setCurrentZoom(initialZoom);
//     }, 300);
//   };

//   const createMapOptions = (maps) => {
//     return {
//       styles: [
//         {
//           featureType: 'administrative.country',
//           elementType: 'labels',
//           stylers: [{ visibility: 'off' }],
//         },
//         {
//           featureType: 'administrative.state',
//           elementType: 'labels',
//           stylers: [{ visibility: 'off' }],
//         },
//         {
//           featureType: 'administrative.city',
//           elementType: 'labels',
//           stylers: [{ visibility: 'off' }],
//         },
//         {
//           featureType: 'administrative.street',
//           elementType: 'labels',
//           stylers: [{ visibility: 'off' }],
//         },
//         // {
//         //   featureType: 'road',
//         //   elementType: 'labels',
//         //   stylers: [{ visibility: 'off' }],
//         // },
//         {
//           featureType: 'transit',
//           elementType: 'labels',
//           stylers: [{ visibility: 'off' }],
//         },
//         {
//           featureType: 'poi',
//           elementType: 'labels',
//           stylers: [{ visibility: 'off' }],
//         },
//       ],
//       disableDefaultUI: true, // optional: hides zoom controls etc.
//       // disableDefaultUI: false,
//       // zoomControl: true,
//       // streetViewControl: true,
//       // mapTypeControl: true,
//       // fullscreenControl: true,
//       // scaleControl: true,
//     };
//   };

//   return (
//     <>
//       <div style={{ height: isMobileWidth ? "100%" : "80%", width: "100%" ,zIndex:999999}}>
//         <GoogleMapReact bootstrapURLKeys={{ key: "AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw" }}
//           defaultCenter={{ lat: currentLocation?.latitude || 59.9375, lng: currentLocation?.longitude|| 30.3086 }}
//           defaultZoom={1}
//           options={createMapOptions}
//           yesIWantToUseGoogleMapApiInternals
//           onGoogleApiLoaded={handleApiLoaded}
//         />
//       </div>
//     </>

//   );
// };

// export default React.memo(MultipleMarkerMap);
