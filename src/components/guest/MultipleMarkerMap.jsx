import React, { useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import { Link, useLocation } from "react-router-dom";

const MultipleMarkerMap = ({ locations, currentLocation, isMobileWidth }) => {
  const mapRef = useRef(null);
  const mapsRef = useRef(null);
  const [currentZoom, setCurrentZoom] = useState(10);

  const parsedLocations = locations.map((loc) => ({
    ...loc,
    latitude: parseFloat(loc.latitude),
    longitude: parseFloat(loc.longitude),
  }));

  const handleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    mapsRef.current = maps;

    const mapDiv = map.getDiv();
    mapDiv.style.borderRadius = isMobileWidth ? "0px" : "20px";
    mapDiv.style.overflow = "hidden";

    const bounds = new maps.LatLngBounds();

    parsedLocations.forEach((location) => {
      const position = new maps.LatLng(location.latitude, location.longitude);
      bounds.extend(position);

      const markerDiv = document.createElement("div");
      markerDiv.innerHTML = `
        <span style="
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 20px;
          background: white;
          border-radius: 30px; /* More circular look */
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        ">
          <img
            src="/images/filters/time.svg"
            width="20px"
            loading="lazy" alt="time-icon"
            style="margin-right: 10px;"
          />
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

      markerDiv.addEventListener("click", () => {
        window.location.href = `/location/${location.property_id}`;
      });
    });

    map.fitBounds(bounds);

    setTimeout(() => {
      const initialZoom = map.getZoom();
      setCurrentZoom(initialZoom);
    }, 300);
  };

  const createMapOptions = (maps) => {
    return {
      styles: [
        {
          featureType: 'administrative.country',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'administrative.state',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'administrative.city',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'administrative.street',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        // {
        //   featureType: 'road',
        //   elementType: 'labels',
        //   stylers: [{ visibility: 'off' }],
        // },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      disableDefaultUI: true, // optional: hides zoom controls etc.
      // disableDefaultUI: false,     
      // zoomControl: true,      
      // streetViewControl: true,  
      // mapTypeControl: true,       
      // fullscreenControl: true,     
      // scaleControl: true,
    };
  };

  return (
    <>
      <div style={{ height: isMobileWidth ? "100%" : "80%", width: "100%" ,zIndex:999999}}>
        <GoogleMapReact bootstrapURLKeys={{ key: "AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw" }}
          defaultCenter={{ lat: currentLocation?.latitude || 59.9375, lng: currentLocation?.longitude|| 30.3086 }}
          defaultZoom={1}
          options={createMapOptions}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={handleApiLoaded}
        />
      </div>
    </>
 
  );
};

export default React.memo(MultipleMarkerMap);

