// import React from "react";
// import Spinner from "react-bootstrap/Spinner";

// function Loader2({ visible }) {
//   if (!visible) return null;

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         position: "fixed", // ✅ use fixed to cover entire page
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         // backgroundColor: "rgba(255, 255, 255, 0.2)", // lighter subtle overlay
//         backgroundColor: "transparent",
//         backdropFilter: "blur(2px)", // light glassmorphism blur
//         WebkitBackdropFilter: "blur(2px)", // Safari support
//         pointerEvents: "none", // allows clicking and scrolling through the loader (e.g. to access footer)
//         zIndex: 9999, // make sure it's on top of everything
//       }}
//     >
//       <Spinner
//         animation="border"
//         role="status"
//         style={{ width: "3rem", height: "3rem", color: "#3A4B4C" }}
//       >
//         <span className="visually-hidden">Loading...</span>
//       </Spinner>
//     </div>
//   );
// }

// export default React.memo(Loader2);

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
        // backgroundColor: "rgba(255, 255, 255, 0.8)", 
        backgroundColor: "transparent",
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

