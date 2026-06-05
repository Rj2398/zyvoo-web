import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";

import GoogleMapReact from "google-map-react";
import markerImage from "../../../assets/marker1.png";
// import { AiOutlinePlus } from "react-icons/ai";
// import axios from "axios";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAddPropertyDetails } from "../../../store/slices/hostuserSlice";
import { GOOGLE_KEY, imageBase } from "../../../config/Constant";
import Autocomplete from "react-google-autocomplete";
import { Link } from "react-router-dom";
import countries from "world-countries";

const GalleryLocation = ({
  switchToAddProperty,
  propertyDataa,
  isEdited,
  onBack,
  activeTab,
}) => {
  const [propertyData, setPropertyData] = useState(propertyDataa);
  const [GoogleApi, setGoogleAple] = useState(null);

  useEffect(() => {
    setPropertyData(propertyDataa);
  }, [propertyDataa]);

  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [city, setCity] = useState();
  const [street, setStreet] = useState();

  const [displayImg, setDisplayImg] = useState(
    Array.isArray(propertyData?.property_images)
      ? propertyData?.property_images.map((img) => ({
          id: img.id,
          image_url: `${imageBase}${img.image_url}`,
        }))
      : []
  );

  const [location, setLocation] = useState({
    lat: Number(propertyDataa?.latitude) ?? null,
    lng: Number(propertyDataa?.longitude) ?? null,
  });
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title:
      propertyData?.title != null && propertyData?.title !== undefined
        ? propertyData.title
        : "",
    description:
      propertyData?.property_description != null &&
      propertyData?.property_description !== undefined
        ? propertyData?.property_description
        : "",
    street:
      propertyData?.street_address != null &&
      propertyData?.street_address !== undefined
        ? propertyData?.street_address
        : "",
    city:
      propertyData?.city != null && propertyData?.city !== undefined
        ? propertyData?.city
        : "",
    state:
      propertyData?.state != null && propertyData?.state !== undefined
        ? propertyData?.state
        : "",
    country:
      propertyData?.country != null && propertyData?.country !== undefined
        ? propertyData?.country
        : "",
    zipCode:
      propertyData?.zip_code != null && propertyData?.zip_code !== undefined
        ? propertyData?.zip_code
        : "",
    parking_rules:
      propertyData?.parking_rules != null &&
      propertyData?.parking_rules !== undefined
        ? propertyData?.parking_rules
        : "",
    host_rules:
      propertyData?.host_rules != null && propertyData?.host_rules !== undefined
        ? propertyData?.host_rules
        : "",
  });

  const [errors, setErrors] = useState({});

  // const handleImageUpload = (event) => {
  //   if (images.length > 4 || displayImg.length > 4) {
  //     toast.error("You can only upload up to five images");
  //     return;
  //   }

  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       const base64String = reader.result;

  //       setImages((prevImages) => [...prevImages, base64String]);
  //       setDisplayImg((prevImages) => [
  //         ...prevImages,
  //         { id: null, image_url: base64String },
  //       ]);
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files); // convert FileList to array
    const totalImages = images.length + displayImg.length + files.length;

    if (totalImages > 5) {
      toast.error("You can only upload up to five images");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;

        setImages((prevImages) => [...prevImages, base64String]);
        setDisplayImg((prevImages) => [
          ...prevImages,
          { id: null, image_url: base64String },
        ]);
      };

      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (!propertyData?.latitude) {
      getLocation();
    }
  }, [propertyData]);

  const handleImageDelete = (index) => {
    const deletedImage = displayImg[index];

    if (deletedImage.id) {
      setDeletedImages((prev) => [...prev, deletedImage.id]);
    }

    setImages(images.filter((_, i) => i !== index));
    setDisplayImg(displayImg.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setGoogleAple(GOOGLE_KEY);
  }, [GOOGLE_KEY, GoogleApi]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.street.trim()) newErrors.street = "Street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "state is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip Code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: Number(position.coords.latitude),
            lng: Number(position.coords.longitude),
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  let params = {
    title: formData?.title,
    description: formData?.description,
    street_address: formData?.street,
    city: formData?.city,
    zip_code: formData?.zipCode,
    country: formData?.country,
    state: formData?.state,
    latitude: Number(location?.lat) || null,
    longitude: Number(location?.lng) || null,
    images: images,
    parking_rules: formData?.parking_rules,
    host_rules: formData?.host_rules,
  };

  if (isEdited) {
    params.delete_images = deletedImages;
  }
  const GalleryValidation = () => {
    let flag = true;

    if (!formData.title.trim()) {
      toast.error("Please enter a title", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!formData.street.trim()) {
      toast.error("Please enter a street address", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }
    if (
      images.length === 0 &&
      (!propertyData?.property_images ||
        propertyData?.property_images.length === 0)
    ) {
      toast.error("Please select at least one image", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    // my code
    if (images.length > 5) {
      toast.error("you can upload only five images", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!formData.city.trim()) {
      toast.error("Please enter a city", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!formData.zipCode.trim()) {
      toast.error("Please enter a zip code", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!formData.country.trim()) {
      toast.error("Please select a country", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!formData.state.trim()) {
      toast.error("Please enter a state", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    return flag;
  };

  const handleGalleryLocation = (async) => {
    if (!GalleryValidation()) return;
    dispatch(setAddPropertyDetails(params));
    switchToAddProperty("price_availability");
  };

  function separateAddress(address) {
    if (!address) return { city: "", state: "", country: "", zipCode: "" };

    const parts = address.split(",").map((part) => part.trim());
    const country = parts[parts.length - 1] || "";
    let stateWithZip = parts.length > 1 ? parts[parts.length - 2] : "";
    const city = parts.length > 2 ? parts[parts.length - 3] : "";

    const zipMatch = stateWithZip.match(/\d{4,}/);
    const zipCode = zipMatch ? zipMatch[0] : "";

    const state = zipCode
      ? stateWithZip.replace(zipCode, "").trim()
      : stateWithZip;

    setFormData((prev) => ({ ...prev, country: country }));
    setFormData((prev) => ({ ...prev, state: state }));
    setFormData((prev) => ({ ...prev, zipCode: zipCode }));
  }

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [GOOGLE_KEY]);

  useEffect(() => {
    separateAddress(address);
  }, [address]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        .pac-container {
          z-index: 100000000 !important; /* Higher than Bootstrap modal */
          position: absolute !important;
        }`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const defaultCenter = {
    lat: 28.6139, // Delhi
    lng: 77.209,
  };

  const center = location?.lat && location?.lng ? location : defaultCenter;

  useEffect(() => {
    const modalElement = document.getElementById("location-modal");
    const pacContainers = document.querySelectorAll(".pac-container");
    pacContainers.forEach((container) => {
      if (modalElement) {
        modalElement.appendChild(container);
      }
    });
  }, []);

  // const [activeTab, setActiveTab] = useState("home_setup");
  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  // };

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  if (!isScriptLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <Container
      className="mt-lg-4"
      style={{
        alignItems: "center",
        marginLeft: "0px",
        padding: isMobileWidth ? "0 7px 0 7px " : "",
        marginRight: isMobileWidth ? "0px" : "20px",
      }}
    >
      {/* Gallery Section */}
      {isMobileWidth && (
        <>
          <div className="container-fluid d-flex justify-content-between">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    {/* <Link to="/profile">
                      <i className="fa-regular fa-arrow-left" style={{ textAlign: 'center' }}></i>
                    </Link> */}

                    <button
                      onClick={() => switchToAddProperty("home_setup")}
                      className="mob-back-btn"
                      style={{
                        marginLeft: "-8px",
                      }}
                    >
                      <i
                        className="fa-regular fa-arrow-left"
                        style={{
                          textAlign: "center",
                          appearance: "none",
                          WebkitAppearance: "none",
                          color: "black",
                        }}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="save-continue-btn"
              style={{
                backgroundColor: "#4AEAB1",
                borderColor: "#4AEAB1",
                fontWeight: isMobileWidth ? "300" : "500",
                fontSize: isMobileWidth ? "14px" : "",
                color: "black",
                borderRadius: "40px",
              }}
              onClick={handleGalleryLocation}
            >
              Save and Continue
            </Button>
          </div>
        </>
      )}
      {isMobileWidth && (
        <>
          <hr
            style={{
              borderColor: "1px soild rgb(187 166 163)",
              width: "calc(100% + 56px)",
              marginLeft: "-28px",
            }}
          />
          <h4
            className="property-modal-main-heading"
            style={{ marginLeft: isMobileWidth && "0px" }}
          >
            {" "}
            Manage your place{" "}
          </h4>
          <h6
            className="property-modal-main-sub-heading"
            style={{ marginLeft: isMobileWidth && "0px" }}
          >
            {" "}
            Setup places, availability, prices and more.{" "}
          </h6>

          <div className="property-modal-radio-switch">
            {[
              { key: "home_setup", label: "Home Setup" },
              { key: "gallery_location", label: "Gallery & Location" },
              { key: "price_availability", label: "Price and Availability" },
            ].map(({ key, label }) => (
              <button
                key={key}
                disabled
                className="property-modal-radio-switch-btn"
                onClick={() => switchToAddProperty(key)}
                style={{
                  backgroundColor:
                    activeTab === key ? "#FFFFFF" : "transparent",
                  color: activeTab === key ? "#000000" : "#000",
                  border:
                    activeTab === key
                      ? "1px solid #FFFFFF"
                      : "2px solid transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
      <hr
        style={{
          borderColor: "1px soild rgb(187 166 163)",
          width: "calc(100% + 56px)",
          marginLeft: "-28px",
        }}
      />
      <h4 className="heading-title">Gallery</h4>
      <Row className="ms-0">
        {displayImg.map((img, index) => (
          <Col
            key={index}
            xs={3}
            className="position-relative p-0 uploaded-image me-2 me-lg-3 mb-3"
            style={{
              width: isMobileWidth ? "82px" : "100px",
              height: isMobileWidth ? "80px" : "100px",
            }}
          >
            <div style={{ width: "100%", height: "100%" }}>
              <img
                src={
                  img?.image_url != null && img?.image_url !== undefined
                    ? img?.image_url
                    : img
                }
                loading="lazy"
                alt="Selected"
                className="img-fluid rounded border"
                style={{ width: "100%", height: "100%", objectFit: "cover" }} // Set fixed size
              />
            </div>

            <MdDelete
              className="position-absolute bg-white rounded-circle p-1 "
              style={{ cursor: "pointer", top: "5px", right: "5px" }}
              onClick={() => handleImageDelete(index)}
              size={25}
              color={"black"}
            />
          </Col>
        ))}

        <Col xs={2} className="ps-0">
          {displayImg?.length < 5 && (
            <label
              className="d-flex justify-content-center align-items-center rounded"
              style={{
                width: isMobileWidth ? "80px" : "100px",
                height: isMobileWidth ? "80px" : "100px",
                cursor: "pointer",
                border: "1px dashed grey",
                flexDirection: "column",
                color: "#ccc",
                gap: "4px",
                fontWeight: "500",
              }}
            >
              <i
                className="fa-solid fa-circle-plus"
                style={{ fontSize: "21px" }}
              ></i>
              Add More
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: "none", border: "1px dashed grey" }}
              />
            </label>
          )}
        </Col>
      </Row>
      <hr
        style={{
          borderColor: "1px soild rgb(187 166 163)",
          width: "calc(100% + 56px)",
          marginLeft: "-28px",
        }}
      />
      {/* About the Space Section */}
      <h4 className="heading-title">About the Space</h4>
      <Form.Control
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="mb-2 custom-input"
        style={{
          height: "45px",
          width: "100%",
          borderRadius: "30px",
          border: "1px solid #B1B1B1",
          padding: "12px",
          color: "black",
          fontSize: "15px",
        }}
      />
      <style>
        {`
    .custom-input::placeholder {
      color: black;
    
    }
  
  `}
      </style>
      {errors.title && <Alert variant="danger">{errors.title}</Alert>}
      <Form.Control
        as="textarea"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="mb-2 custom-input"
        style={{
          width: "100%",
          height: "100px",
          borderRadius: "10px",
          border: "1px solid #B1B1B1",
          padding: "12px",
          color: "black",
          fontSize: "15px",
        }}
      />
      <style>
        {`
    .custom-input::placeholder {
      color: black;
    
    }
 
  `}
      </style>
      {errors.description && (
        <Alert variant="danger">{errors.description}</Alert>
      )}{" "}
      <hr
        style={{
          borderColor: "1px soild rgb(187 166 163)",
          width: "calc(100% + 56px)",
          marginLeft: "-28px",
          marginTop: "25px",
          marginBottom: "25px",
        }}
      />
      <h4 className="heading-title">Parking Rules</h4>
      <Form.Control
        as="textarea"
        name="parking_rules"
        value={formData.parking_rules}
        onChange={handleChange}
        placeholder="(Optional)"
        className="mb-2 custom-input"
        style={{
          width: "100%",
          height: "100px",
          borderRadius: "10px",
          border: "1px solid #B1B1B1",
          padding: "12px",
          color: "black",
          fontSize: "15px",
        }}
      />
      <style>
        {`
    .custom-input::placeholder {
      color: black;
    
    }
 
  `}
      </style>
      {errors.parking_rules && (
        <Alert variant="danger">{errors.parking_rules}</Alert>
      )}
      <hr
        style={{
          borderColor: "1px soild rgb(187 166 163)",
          width: "calc(100% + 56px)",
          marginLeft: "-28px",
          marginTop: "25px",
          marginBottom: "25px",
        }}
      />
      <h4 className="heading-title">Host Rules</h4>
      <Form.Control
        as="textarea"
        name="host_rules"
        value={formData.host_rules}
        onChange={handleChange}
        placeholder="(Optional)"
        className="mb-2 custom-input"
        style={{
          width: "100%",
          height: "100px",
          borderRadius: "10px",
          border: "1px solid #B1B1B1",
          padding: "12px",
          color: "black",
          fontSize: "15px",
        }}
      />
      <style>
        {`
        .custom-input::placeholder {
          color: black;
        }
      `}
      </style>
      {errors.host_rules && <Alert variant="danger">{errors.host_rules}</Alert>}
      {/* Address Section */}
      <hr
        style={{
          borderColor: "1px soild rgb(187 166 163)",
          width: "calc(100% + 56px)",
          marginLeft: "-28px",
        }}
      />
      <h4 className="mt-lg-4  heading-title">Address</h4>
      <div
        style={{
          // marginRight: "75px",
          position: "relative",
          marginBottom: "15px",
          width: "100%",
        }}
      >
        <InputGroup>
          {/* <Form.Control
        type="hidden"
        name="street"
        value={formData.street||street}
        onChange={(e) => {
              setStreet(e.target.value);
              setFormData((prev) => ({ ...prev, street: e.target.value }));}}
        placeholder="Street"
        // className="mb-2"
        // className="custom-input"
        style={{
          width: "100%",
          border: "1px solid #B1B1B1",
          padding: "12px",
          color: "black",
          borderRadius: "30px",
          fontSize:'15px',
          marginBottom:'10px'
      
        }}
      /> */}

          <style>
            {`
          .custom-input::placeholder {
            color: black;
          }
          .custom-input{
            margin-bottom:10px;
          }
        `}
          </style>

          <Autocomplete
            apiKey={GoogleApi}
            onPlaceSelected={(place) => {
              try {
                if (!place?.address_components) {
                  console.error("No place details available");
                  return;
                }

                const components = place.address_components;

                const streetNumber =
                  components.find((c) => c.types.includes("street_number"))
                    ?.long_name || "";

                const route =
                  components.find((c) => c.types.includes("route"))
                    ?.long_name || "";

                const city =
                  components.find((c) => c.types.includes("locality"))
                    ?.long_name || "";

                const stateName =
                  components.find((c) =>
                    c.types.includes("administrative_area_level_1")
                  )?.short_name || "";

                const postalCode =
                  components.find((c) => c.types.includes("postal_code"))
                    ?.long_name || "";

                const countryName =
                  components.find((c) => c.types.includes("country"))
                    ?.long_name || "";

                // Build street & full address including country
                const street = `${streetNumber} ${route}`.trim();
                const fullAddress =
                  `${street}, ${city}, ${stateName} ${postalCode}, ${countryName}`.trim();

                // Update local states
                setStreet(street);
                setAddress(fullAddress);

                // Update form data
                setFormData((prev) => ({
                  ...prev,
                  street,
                  city,
                  state: stateName,
                  country: countryName,
                  zipCode: postalCode,
                }));

                // Update location if available
                if (place.geometry?.location) {
                  setLocation({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  });
                }
              } catch (error) {
                console.error("Error handling place selection:", error);
              }
            }}
            options={{
              types: ["address"], // full street addresses
              fields: ["formatted_address", "address_components", "geometry"],
            }}
            value={formData.street} // ✅ just use formData.street
            placeholder="Street Address"
            className="google-autocomplete custom_input"
            onChange={(e) => {
              const value = e.target.value;
              setStreet(value);
              setFormData((prev) => ({ ...prev, street: value }));
            }}
            style={{
              width: "100%",
              border: "1px solid #B1B1B1",
              padding: "12px",
              color: "black",
              borderRadius: "30px",
              fontSize: "15px",
              marginBottom: "10px",
            }}
          />
        </InputGroup>
      </div>
      {console.log(formData)}
      {errors.street && <Alert variant="danger">{errors.street}</Alert>}
      {/* <div
        style={{
          // marginRight: "75px",
          position: "relative",
          marginBottom: "10px",
          width: "100%",
        }}
      > */}
      {/* <InputGroup> */}
      {/* Visible Input Box */}
      <Form.Control
        // type="hidden"
        name="city"
        // value={formData.city || city}
        // onChange={(e) => {
        //   setCity(e.target.value);
        //   setFormData((prev) => ({ ...prev, city: e.target.value })); // Update formData
        // }}

        value={formData.city}
        onChange={handleChange}
        placeholder="City"
        className="custom-input"
        style={{
          width: "100%",
          border: "1px solid #B1B1B1",
          padding: "12px",
          color: "black",
          borderRadius: "30px",
          fontSize: "15px",
          marginBottom: "20px",
          position: "relative",
        }}
      />
      <style>
        {`
              .custom-input::placeholder {
                color: black;
              }
            `}
      </style>
      <style>
        {`
              .custom-input::placeholder {
                color: black;
              }
            `}
      </style>
      {/* </InputGroup> */}
      {/* </div> */}
      {errors.city && <Alert variant="danger">{errors.city}</Alert>}
      <div className={isMobileWidth ? "" : "row"}>
        <Col style={{ paddingRight: "0px" }}>
          <Form.Control
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
            className="custom-input"
            style={{
              width: "100%",
              border: "1px solid #B1B1B1",
              padding: "12px",
              color: "black",
              borderRadius: "30px",
              fontSize: "15px",
              marginBottom: "15px",
            }}
          />

          <style>
            {`
            .custom-input::placeholder {
              color: black;
            
            }
              .custom-input{
                margin-bottom:10px;
              }
          `}
          </style>
          {errors.zipCode && <Alert variant="danger">{errors.zipCode}</Alert>}
        </Col>
        <Col style={{ paddingRight: "0px" }}>
          <Form.Control
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="custom-input"
            style={{
              width: "100%",
              border: "1px solid #B1B1B1",
              padding: "12px",
              color: "black",
              borderRadius: "30px",
              fontSize: "15px",
              marginBottom: "15px",
            }}
          />

          <style>
            {`
              .custom-input::placeholder {
                color: black;
              
              }
                .custom-input{
                  margin-bottom:10px;
                }
            `}
          </style>
          {errors.country && <Alert variant="danger">{errors.country}</Alert>}
        </Col>

        <Col>
          <Form.Control
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="custom-input"
            style={{
              width: "100%",
              border: "1px solid #B1B1B1",
              padding: "12px",
              color: "black",
              borderRadius: "30px",
              fontSize: "15px",
              marginBottom: "15px",
            }}
          />

          <style>
            {`
    .custom-input::placeholder {
      color: black;
    
    }
      .custom-input{
        margin-bottom:10px;
      }
  `}
          </style>
          {errors.state && <Alert variant="danger">{errors.state}</Alert>}
        </Col>
      </div>
      <div
        style={{
          height: "400px",
          width: "100%",
          marginTop: "30px",
          marginBottom: "30px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDcDl4RoLc2oLDDpkJqdhWOWHP0B4qBEqk" }}
          defaultCenter={defaultCenter} 
          center={center} 
          defaultZoom={12}
        >
          <img

            src={markerImage}
            loading="lazy" alt="marker"
            style={{
              width: "40px",
              height: "45px",
              transform: "translate(-50%, -100%)",
              position: "absolute",
              cursor: "pointer",
              zIndex: 10,
            }}
          />
        </GoogleMapReact> */}

        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDcDl4RoLc2oLDDpkJqdhWOWHP0B4qBEqk" }}
          defaultCenter={defaultCenter}
          center={center}
          defaultZoom={12}
          // Add this options prop to hide everything - START
          options={{
            styles: [
              {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }], // Hides all text/names
              },
              {
                featureType: "poi",
                elementType: "all",
                stylers: [{ visibility: "off" }], // Hides points of interest
              },
              {
                featureType: "transit",
                elementType: "all",
                stylers: [{ visibility: "off" }], // Hides bus/train lines
              },
            ],
          }}
          // Add this options prop to hide everything - END
        >
          <img
            src={markerImage}
            loading="lazy"
            alt="marker"
            style={{
              width: "40px",
              height: "45px",
              transform: "translate(-50%, -100%)",
              position: "absolute",
              cursor: "pointer",
              zIndex: 10,
            }}
          />
        </GoogleMapReact>
      </div>
      <hr
        style={{
          borderColor: "1px soild rgb(187 166 163)",
          width: "calc(100% + 56px)",
          marginLeft: "-28px",
        }}
      />
      {!isMobileWidth && (
        <>
          <Container className="mt-4 d-flex justify-content-between">
            {/* Clear All Button */}
            {/* <button
              className="btn-outline-success save-continue-btn"
              onClick={() => switchToAddProperty("home_setup")}
              style={{
                 color: "#000",
                background: "#fff",
                borderColor: "#E5E5E5",
                fontWeight: "400",
                borderRadius: "40px",
                padding:'13px 26px',
                marginLeft:'-15px'
              }}
            >
              <style>
                {`.btn-outline-success:hover {
                background-color: #fff;
                // border-color: #000;
                color: black !important;
              }
            `}
              </style>
              Go back
            </button> */}

            <Button
              className="go-back-btn save-continue-btn"
              variant="outline-success"
              onClick={() => switchToAddProperty("home_setup")}
              style={{
                color: "#000",
                background: "#fff",
                borderColor: "#E5E5E5",
                fontWeight: "400",
                borderRadius: "40px",
                padding: "13px 26px",
                marginLeft: "-15px",
              }}
            >
              Go back
            </Button>

            {/* Save and Continue Button */}
            <Button
              className="save-continue-btn"
              style={{
                backgroundColor: "#4AEAB1",
                borderColor: "#4AEAB1",
                fontWeight: "400",
                color: "black",
                borderRadius: "40px",
                padding: "13px 26px",
              }}
              onClick={handleGalleryLocation}
            >
              Save and Continue
            </Button>
          </Container>
        </>
      )}
      {/* <ToastContainer /> */}
    </Container>
  );
};

export default GalleryLocation;
