import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KEYS } from "../../../config/Constant";
import { forEach } from "rsuite/esm/internals/utils/ReactChildren";

const MessageHost = ({ type, data,handleMsgClick }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userType = localStorage.getItem(KEYS.USER_TYPE);

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      style={{
        textAlign: "center",
        width: isMobileWidth ? "57%" : "100%",
        fontSize:isMobileWidth?'14px':''
      }}
    >
      <button
        onClick={() => {
          userType === "host"
            ? navigate("/chat", { state: data })
            : setIsOpen(!isOpen);
          isMobileWidth && handleMsgClick()
        }}
        style={{
          padding: "10px 15px",
          borderRadius: isMobileWidth ? "10px" : "5px",
          border: "1px solid black",
          backgroundColor: "white",
          color: "black",
          cursor: "pointer",
          marginBottom: "10px",
          width: isMobileWidth && userType ? "90%" : "100%",
          position:'relative'
        }}
      >
        Message the {`${type?.charAt(0)?.toUpperCase() + type?.slice(1)}`}
      </button>

      {isOpen && <MessageForm data={data}  isMobileWidth={isMobileWidth}/>}
    </div>
  );
};

const MessageForm = ({ data,isMobileWidth }) => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!selectedReason) {
      toast.error("Please select a reason.");
      return;
    }
    if (selectedReason == "Other reason") {
      if (!message) {
        toast.error("Please enter a message.");
        return;
      }
    }
    navigate("/chat", {
      state: {
        data,
        selectedReason:
          selectedReason == "Other reason" ? message : selectedReason,
      },
    });
  };

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
  };



  return (
    <div
      // style={{
      //   border: "1px solid #ddd",
      //   borderRadius: "10px",
      //   padding: "15px",
      //   margin: "0 auto",
      //   backgroundColor: "#fff",
      //   boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      // }}



    style={{
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    margin: "0 auto",
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px", // or whatever you want for desktop
    boxSizing: "border-box",

    position:isMobileWidth && "absolute",
    left:'0'
  }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {["I have a doubt", "Available days", "Other reason"].map((reason) => (
          <button
            key={reason}
            style={{
              ...optionStyle,
              backgroundColor:selectedReason === reason ? "white" : "white",
              border:selectedReason === reason ? "1px solid #3a4b4c" : "none",
            }}
            onClick={() => handleReasonClick(reason)}
          >
            {reason}
          </button>
        ))}

        {selectedReason == "Other reason" && (
          <textarea
            className="text-placeholder"
            placeholder="Share a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: "100%",
              height: "60px",
              padding: "8px",
              borderRadius: "5px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              backgroundColor: "white",
              outline:'none',
              border:'none',
              resize: "none",   
            }}
          />
        )}

        <button
          onClick={handleSubmit}
          style={{
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor:'#3A4B4C',
            border:'none'
          }}
        >
          Message Host
        </button>
      </div>
    </div>
  );
};

const optionStyle = {
  padding: "8px",
  borderRadius: "5px",
  // border: "1px solid white",
  textAlign: "left",
  cursor: "pointer",
  color: "black",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
  backgroundColor: "white"
};


export default React.memo(MessageHost);


// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { KEYS } from "../../../config/Constant";

// const MessageHost = ({ type, data }) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const userType = localStorage.getItem(KEYS.USER_TYPE);

//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };

//     checkWindowWidth(); // run on mount
//     window.addEventListener("resize", checkWindowWidth);

//     return () => window.removeEventListener("resize", checkWindowWidth);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   return (
//     <div
//       ref={dropdownRef}
//       style={{
//         textAlign: "center",
//         width: isMobileWidth ? "58%" : "100%",
//       }}
//     >
//       <button
//         onClick={() => {
//           userType === "host"
//             ? navigate("/chat", { state: data })
//             : setIsOpen(!isOpen);
//         }}
//         style={{
//           padding: "10px 15px",
//           borderRadius: isMobileWidth ? "10px" : "5px",
//           border: "1px solid black",
//           backgroundColor: "white",
//           color: "black",
//           cursor: "pointer",
//           marginBottom: "10px",
//           width: isMobileWidth && userType ? "90%" : "100%",
//         }}
//       >
//         Message the {type}
//       </button>

//       {isOpen && <MessageForm data={data} />}
//     </div>
//   );
// };

// const MessageForm = ({ data }) => {
//   const navigate = useNavigate();
//   const [selectedReason, setSelectedReason] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = () => {
//     if (!selectedReason) {
//       toast.error("Please select a reason.");
//       return;
//     }
//     if (selectedReason == "Other reason") {
//       if (!message) {
//         toast.error("Please enter a message.");
//         return;
//       }
//     }
//     navigate("/chat", {
//       state: {
//         data,
//         selectedReason:
//           selectedReason == "Other reason" ? message : selectedReason,
//       },
//     });
//   };

//   const handleReasonClick = (reason) => {
//     setSelectedReason(reason);
//   };

//   return (
//     <div
//       style={{
//         border: "1px solid #ddd",
//         borderRadius: "10px",
//         padding: "15px",
//         margin: "0 auto",
//         backgroundColor: "#fff",
//         boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//       }}
//     >
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//         {["I have a doubt", "Available days", "Other reason"].map((reason) => (
//           <button
//             key={reason}
//             style={{
//               ...optionStyle,
//               backgroundColor:
//                 selectedReason === reason ? "#e0e0e0" : "#f9f9f9",
//             }}
//             onClick={() => handleReasonClick(reason)}
//           >
//             {reason}
//           </button>
//         ))}

//         {selectedReason == "Other reason" && (
//           <textarea
//             placeholder="Share a message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             style={{
//               width: "100%",
//               height: "60px",
//               padding: "8px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//               resize: "none",
//             }}
//           />
//         )}

//         <button
//           onClick={handleSubmit}
//           style={{
//             backgroundColor: "white",
//             color: "black",
//             padding: "10px",
//             borderRadius: "5px",
//             border: "1px solid black",
//             cursor: "pointer",
//           }}
//         >
//           Message Host
//         </button>
//       </div>
//     </div>
//   );
// };

// const optionStyle = {
//   padding: "8px",
//   borderRadius: "5px",
//   border: "1px solid #ddd",
//   textAlign: "left",
//   cursor: "pointer",
// };

// export default React.memo(MessageHost);
