import React, { useState } from "react";

const AddCardView2 = () => {
  const [sameAsMailing, setSameAsMailing] = useState(true);

  const formStyle = {
    maxWidth: "700px",
    margin: "30px auto",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 0 20px rgba(0,0,0,0.05)",
    fontFamily: "sans-serif",
  };

  const inputStyle = {
    borderRadius: "20px",
    padding: "10px 15px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const sectionTitle = {
    fontWeight: "600",
    fontSize: "18px",
    marginBottom: "20px",
  };

  const submitStyle = {
    backgroundColor: "#3DF6B0",
    border: "none",
    borderRadius: "30px",
    padding: "10px 30px",
    fontWeight: "600",
    fontSize: "16px",
    color: "#000",
    marginTop: "30px",
  };

  const checkboxLabelStyle = {
    fontSize: "14px",
    marginLeft: "5px",
    verticalAlign: "middle",
  };

  return (
    <div style={formStyle}>
      <div style={sectionTitle}>Add Card Details</div>
      <div className="row g-3">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Name"
            className="form-control"
            style={inputStyle}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Card Number"
            className="form-control"
            style={inputStyle}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            placeholder="CVV Number"
            className="form-control"
            style={inputStyle}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" style={inputStyle}>
            <option>Month</option>
            <option>01</option>
            <option>02</option>
            <option>03</option>
            <option>04</option>
            {/* Add more months */}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" style={inputStyle}>
            <option>Year</option>
            <option>2025</option>
            <option>2026</option>
            {/* Add more years */}
          </select>
        </div>
      </div>

      <div style={{ ...sectionTitle, marginTop: "40px" }}>
        Add Billing Address
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Street"
            className="form-control"
            style={inputStyle}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            placeholder="City"
            className="form-control"
            style={inputStyle}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            placeholder="State"
            className="form-control"
            style={inputStyle}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Zip code" 
            className="form-control"
            style={inputStyle}
          />
        </div>
        <div className="col-12">
          <div className="form-check" style={{ marginTop: "10px" }}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={sameAsMailing}
              onChange={() => setSameAsMailing(!sameAsMailing)}
              id="sameAsMailing"
              style={{ cursor: "pointer" }}
            />
            <label
              className="form-check-label"
              htmlFor="sameAsMailing"
              style={checkboxLabelStyle}
            >
              Same as Mailing Address
            </label>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button type="submit" style={submitStyle}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddCardView2;
