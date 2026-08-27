
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

const NoResultsFound = () => {
  const [hasNoLocation, setHasNoLocation] = useState(true);
  // console.log(hasNoLocation, "hasNoLocation***");

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((status) => {
        const handleStateChange = (currentState) => {
          if (currentState === "granted") {
            setHasNoLocation(false);
          } else if (currentState === "denied") {
            setHasNoLocation(true);
          } else if (currentState === "prompt") {
            // 💡 The state is prompt! We must actually trigger the popup to ask them.
            setHasNoLocation(true); // Default to true until they accept

            navigator.geolocation.getCurrentPosition(
              (position) => {
                // User clicked "Allow"
                setHasNoLocation(false);
              },
              (error) => {
                // User clicked "Block" or closed it
                setHasNoLocation(true);
              }
            );
          }
        };

        // Run it initially
        handleStateChange(status.state);

        // Listen for future toggles in site settings
        status.onchange = () => handleStateChange(status.state);
      });
    }
  }, []);
  return (
    <div
      className="sorry-wrap"
      style={{
        textAlign: "center",
        padding: "50px 15px",
        backgroundColor: "white",
        backgroundImage:
          " radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
        backgroundSize: "20px 20px",
      }}
    >
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <div className="sorry-inner">
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  marginBottom: "15px",
                }}
              >
                {!hasNoLocation
                  ? "Sorry, we couldn’t find any results."
                  : "Enable your location to find the results."}
              </h1>
              <hr
                style={{
                  width: "60%",
                  maxWidth: "300px",
                  margin: "15px auto",
                  border: "1px solid #ccc",
                  opacity: "0.5",
                }}
              />
              <Image
                src="/images/sorry.svg"
                loading="lazy"
                alt="No Results Found"
                fluid
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "250px",
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NoResultsFound;



// import React from "react";
// import { Container, Row, Col, Image } from "react-bootstrap";

// const NoResultsFound = () => {
//   return (
//     <div
//       className="sorry-wrap"
//       style={{
//         textAlign: "center",
//         padding: "50px 15px",
//         backgroundColor: "white",
//         backgroundImage:
//           "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px)",
//         backgroundSize: "20px 20px",
//       }}
//     >
//       <Container fluid>
//         <Row className="justify-content-center">
//           <Col xs={12} md={10} lg={8}>
//             <div className="sorry-inner">
//               <h1
//                 style={{
//                   fontSize: "24px",
//                   fontWeight: "600",
//                   marginBottom: "15px",
//                 }}
//               >
//                 Sorry, we couldn’t find any results.
//               </h1>
//               <hr
//                 style={{
//                   width: "60%",
//                   maxWidth: "300px",
//                   margin: "15px auto",
//                   border: "1px solid #ccc",
//                   opacity: "0.5",
//                 }}
//               />
//               <Image
//                 src="/images/sorry.svg"
//                 loading="lazy"
//                 alt="No Results Found"
//                 fluid
//                 style={{
//                   maxWidth: "100%",
//                   height: "auto",
//                   maxHeight: "250px",
//                 }}
//               />
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default NoResultsFound;