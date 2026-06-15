 import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/ic_loader_animator.json";

function Loader2({ visible }) {
  if (!visible) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
         backgroundColor: "rgba(255, 255, 255, 0.8)", 
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
      }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        style={{
          width: 150,
          height: 150,
        }}
      />
    </div>
  );
}

export default React.memo(Loader2);



// import React from "react";
// import Spinner from "react-bootstrap/Spinner";

// function Loader({ visible }) {
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

// export default React.memo(Loader);
