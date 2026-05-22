import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

function Loader({ visible }) {
  if (!visible) return null; 

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)", 
        zIndex: 1050,
      }}
    >
      <Button variant="primary" disabled>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          variant="warning"
        />
        <span className="visually-hidden">Loading...</span>
      </Button>
    </div>
  );
}

export default React.memo(Loader);
