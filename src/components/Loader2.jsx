import React from "react";
import Spinner from "react-bootstrap/Spinner";

function Loader2({ visible }) {
  if (!visible) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed", // ✅ use fixed to cover entire page
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        // backgroundColor: "rgba(255, 255, 255, 0.4)", // subtle overlay
        // backdropFilter: "blur(1px)",
        zIndex: 9999, // make sure it's on top of everything
      }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{ width: "3rem", height: "3rem", color: "#3A4B4C" }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default React.memo(Loader2);
