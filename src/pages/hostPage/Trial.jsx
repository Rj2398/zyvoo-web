// import React, { useEffect, useRef, useState } from "react";
// import { Container, Row, Col, Card, Button, Table, Badge, InputGroup, Form, } from "react-bootstrap";
// import { FaFilter, FaMapMarkerAlt, FaRegCalendarAlt, FaStar, } from "react-icons/fa";
// import moment from "moment";
// import DatePicker from "react-datepicker";
// import { SlidersHorizontal } from "lucide-react";
// import { format, eachDayOfInterval } from "date-fns";
// import Header from "../../components/host/Header";
// import Footer from "../../components/guest/Footer";
// import { useLocation } from "react-router-dom";
// import { imageBase } from "../../config/Constant";
// import AddPropertyModal from "../../components/host/addBusiness/AddPropertyModal";
// import useBook from "../../hooks/host/useBook";
// import { DateRangePicker } from "rsuite";
// import "rsuite/dist/rsuite.min.css";

// const Trial = () => {
//   const location = useLocation();
//   const { routedData } = location.state || {};
//   const propertyData = routedData;

//   const { propertyBookingDetails } = useBook();
//   const [addProperyShow, setAddPropertyShow] = useState(false);
//   const [propertyDetails, setPropertyDetails] = useState();
//   const [originalData, setOriginalData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   const [startDate, setStartDate] = useState(new Date());
//   const [value, setValue] = useState(null);
//   const [endDate, setEndDate] = useState(new Date());
//   const [days, setDays] = useState([]);
//   const formatDate = (date) => {
//     const parsedDate = new Date(date);
//     return format(parsedDate, "yyyy-MM-dd");
//   };

//   const times = [ "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM", ];

//   const [showModal, setShowModal] = useState(false);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const calendarRef = useRef(null);

//   const handleDateChange = (dates) => {
//     const [start, end] = dates;

//     if (start && end && end < start) {
//       setStartDate(end);
//       setEndDate(start);
//     } else {
//       setStartDate(start);
//       setEndDate(end);
//     }
//   };

//   useEffect(() => {
//     if (startDate && endDate) {
//       const filtered = propertyDetails?.bookings?.filter((item) => {
//         const itemDate = new Date(item?.booking_date);
//         return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
//       });
//       setFilteredData(filtered);
//       const newDays = eachDayOfInterval({ start: startDate, end: endDate }).map(
//         (date) => format(date, "MMM d YYY") // Formatting each date
//       );
//       setDays(newDays);
//     }
//   }, [startDate, endDate]);

//   // Close calendar when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (calendarRef.current && !calendarRef.current.contains(event.target)) {
//         setShowCalendar(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const getPropertBookingList = async () => {
//     try {
//       const response = await propertyBookingDetails({
//         property_id: propertyData?.property_id || 122,
//         user_id: propertyData?.host_id || 366,
//         start_date: formatDate(startDate),
//         end_date: formatDate(endDate),
//         latitude: propertyData?.latitude,
//         longitude: propertyData?.longitude,
//       });
//       if (response) {
//         if (response) {
//           setOriginalData(response.data);
//           setFilteredData(response.data); // Initialize filteredData
//           setPropertyDetails(response.data); // If you're using this elsewhere
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if(startDate && endDate) {
//     getPropertBookingList();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [startDate, endDate]);

// function toDateOnly(date) {
//   const d = new Date(date);
//   d.setHours(0, 0, 0, 0);
//   return d.getTime();
// }

// function getMatchingHours(times, booking_start_end) {
//   if (!booking_start_end) return null;

//   // Normalize input by trimming spaces
//   const bookingRange = booking_start_end.trim();

//   // Example booking_start_end: "01:00 AM - 02:00 AM"
//   const [start, end] = bookingRange.split(" - ").map(t => t.trim());

//   // Check if both start and end exist in times array
//   const startIndex = times.indexOf(start);
//   const endIndex = times.indexOf(end);

//   if (startIndex === -1 || endIndex === -1) {
//     // If times not found in array, just return original booking_start_end
//     return booking_start_end;
//   }

//   // Return a nicely formatted string from times array
//   return `${times[startIndex]} - ${times[endIndex]}`;
// }

//   return (
//     <>
//       {/* <Header /> */}
//       <main>
//         <Container fluid
//           style={{
//             padding: "20px",
//             fontFamily: "Arial, sans-serif",
//             background: "#F8F9FA",
//             backgroundColor: "white",
//             backgroundImage: " radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
//             backgroundSize: "20px 20px",
//           }} >
//           <Row>
//             {/* Calendar Section */}
//             <Col md={9} style={{
//                 background: "transparent",
//                 padding: "20px",
//                 borderRadius: "10px",
//                 boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
//               }} >
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div style={{ position: "relative", display: "inline-block" }} ref={calendarRef} >
//                   {/* Date Picker Input */}
//                   <InputGroup onClick={() => setShowCalendar(!showCalendar)}
//                     style={{
//                       border: "1px solid #ccc",
//                       borderRadius: "30px",
//                       padding: "8px 15px",
//                       background: "#fff",
//                       cursor: "pointer",
//                       minWidth: "250px",
//                       alignItems: "center",
//                       display: "flex",
//                     }} >
//                     <img src="/images/Host/date-range-host.svg" alt="Calendar" width={20} style={{ marginRight: "10px" }} />
//                     <Form.Control type="text" readOnly
//                       value={`${format(startDate, "MMM d")} - ${format(endDate, "MMM d yyyy")}`}
//                       style={{
//                         fontSize: "16px",
//                         fontWeight: "500",
//                         color: "#333",
//                         background: "none",
//                         border: "none",
//                         boxShadow: "none",
//                         cursor: "pointer",
//                       }} />
//                     <span style={{ marginLeft: "auto", fontSize: "14px", color: "#555", }} >
//                       ▼
//                     </span>
//                   </InputGroup>

//                   {/* Date Range Picker */}
//                   {showCalendar && (
//                     <div style={{
//                         position: "absolute",
//                         top: "110%",
//                         left: "0",
//                         zIndex: "1000",
//                         background: "#fff",
//                         padding: "10px",
//                         borderRadius: "10px",
//                         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//                       }} >
//                       <div style={{ display: "flex", gap: "10px" }}>
//                         <DatePicker
//                           selected={startDate}
//                           selectsRange
//                           onChange={handleDateChange}
//                           startDate={startDate}
//                           endDate={endDate}
//                           inline />
//                       </div>
//                     </div>
//                   )}
//                   {/* <DateRangePicker /> */}
//                 </div>
//                 <div onClick={() => setShowModal(true)}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-around",
//                     alignItems: "center",
//                     paddingLeft: "10px",
//                     paddingRight: "10px",
//                     border: "1px solid #ddd",
//                     borderRadius: "30px",
//                     cursor: "pointer",
//                   }} >

//                   <SlidersHorizontal size={20} color="black" fontWeight={"500"} />
//                   <Button style={{
//                       background: "none",
//                       border: "none",
//                       fontSize: "16px",
//                       color: "#333",
//                       fontWeight: "500",
//                     }} >
//                     Filter
//                   </Button>
//                 </div>
//               </div>

//               <div style={{
//                   width: "100%",
//                   maxHeight: "80vh",
//                   display: "flex",
//                   flexDirection: "column",
//                   // border: "1px solid #ddd",
//                   borderRadius: "12px",
//                 }} >
//                 {/* Scrollable Content */}
//                 <div style={{
//                     width: "100%",
//                     overflowX: "auto",
//                     overflowY: "auto",
//                     whiteSpace: "nowrap",
//                     position: "relative",
//                   }} >
//                   <Table style={{ width: "max-content", minWidth: "100%", borderCollapse: "collapse" }} >
//                     <thead>
//                       <tr>
//                         <th style={{
//                             width: "80px",
//                             border: "none",
//                             fontSize: "14px",
//                             color: "#333",
//                             background: "transparent",
//                           }} ></th>
//                         {days.map((day, index) => (
//                           <th key={index} style={{
//                               minWidth: "120px",
//                               height: "50px",
//                               background: "transparent",
//                               fontSize: "14px",
//                               color: "#333",
//                               textAlign: "center",
//                               fontWeight: "600",
//                               border: "none",
//                               whiteSpace: "nowrap",
//                               position: "sticky",
//                               top: 0, // Ensures it sticks at the top
//                               backgroundColor: "white", // Prevents overlap issues
//                               zIndex: 5, // Keeps it above other elements
//                             }} >
//                             <div style={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 height: "50px",
//                                 width: "100%",
//                                 minHeight: "60px",
//                                 borderRadius: "12px",
//                                 backgroundColor: "#EFF2F5",
//                                 padding: "8px",
//                               }} > {day}
//                             </div>
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {times.map((time, rowIndex) => (
//                         <tr key={rowIndex}>
//                           <td style={{
//                               fontWeight: "bold",
//                               background: "transparent",
//                               width: "80px",
//                               textAlign: "center",
//                               verticalAlign: "middle",
//                               borderRadius: "20px",
//                               border: "none",
//                               position: "sticky",
//                               zIndex: 10,
//                               left: 0,
//                             }} >
//                             <div style={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 height: "100%",
//                                 width: "80px",
//                                 minHeight: "80px",
//                                 borderRadius: "12px",
//                                 backgroundColor: "#EFF2F5",
//                               }} >
//                               {time}
//                             </div>
//                           </td>

//                           {days.map((item, colIndex) => (
//                             <td key={colIndex} style={{
//                                 position: "relative",
//                                 minWidth: "120px",
//                                 height: "50px",
//                                 background: "transparent",
//                                 fontSize: "14px",
//                                 color: "#333",
//                                 textAlign: "center",
//                                 fontWeight: "500",
//                                 border: "none",
//                                 whiteSpace: "nowrap",
//                               }} >

//                               {toDateOnly(item) == toDateOnly(filteredData?.bookings?.[0]?.booking_date) ? (
//                                 <div
//                                   style={{
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     justifyContent: "center",
//                                     alignItems: "flex-start",
//                                     borderRadius: "12px",
//                                     borderLeft: "5px solid #6ff7be",
//                                     borderTop: "1px solid #ddd",
//                                     borderRight: "1px solid #ddd",
//                                     borderBottom: "1px solid #ddd",
//                                     position: "relative",
//                                     width: "100%",
//                                     minHeight: "60px",
//                                     padding: "8px 12px",
//                                     fontSize: "12px",
//                                     textAlign: "left",
//                                     backgroundColor: "#ffffff",
//                                     color: "black",
//                                     fontWeight: "bold",
//                                   }} >
//                                   <div style={{ fontSize: "14px" }}>
//                                     {filteredData?.bookings?.[0]?.guest_name || "No Guest"}
//                                   </div>
//                                   <div style={{ fontWeight: "600", color: "#28a745", fontSize: "13px", }}>
//                                     {filteredData?.bookings?.[0]?.booking_status || "Status"}
//                                   </div>

//                                   {filteredData?.length > 0 && (
//                                     <div style={{ marginTop: "1rem" }}>
//                                       <strong>Filtered Data:</strong>
//                                       <ul>
//                                         No Data Found
//                                       </ul>
//                                     </div>
//                                   )}

//                                   <div style={{ fontSize: "12px", color: "#333" }} >
//   {getMatchingHours(times, filteredData?.bookings?.[0]?.booking_start_end)}
// </div>

//                                 </div>
//                               ) : (
//                                 <div
//                                   style={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     height: "50px",
//                                     width: "100%",
//                                     borderRadius: "12px",
//                                     minHeight: "70px",
//                                     border: "1px solid #ddd",
//                                     position: "relative",
//                                   }}
//                                 ></div>
//                               )}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               </div>
//             </Col>

//             <Col md={3}>
//               <Card style={{ borderRadius: "12px", overflow: "hidden",
//                   boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
//                   padding: "25px",
//                   backgroundColor: "#fff",
//                   maxHeight: "90vh",
//                 }} >
//                 {/* Image */}
//                 <Card.Img variant="top" src={imageBase + propertyData?.profile_image} alt="Cabin"
//                   style={{ height: "350px", objectFit: "cover", borderRadius: "12px", }} />

//                 {/* Card Body */}
//                 <Card.Body style={{ padding: "0px" }}>
//                   {/* Title */}
//                   <Card.Title style={{
//                       fontSize: "18px",
//                       fontWeight: "bold",
//                       marginBottom: "5px",
//                       marginTop: "10px",
//                     }} >
//                     {propertyData?.title}
//                   </Card.Title>

//                   {/* Rating & Price */}
//                   <Card.Text style={{ fontSize: "16px", color: "#666", marginBottom: "5px", }} >
//                     <FaStar style={{ color: "#FFD700", marginRight: "5px" }} />
//                     <span style={{ fontWeight: "500", color: "#333" }}>
//                       {propertyData?.property_rating}
//                     </span>
//                     <span style={{ color: "#999", marginRight: "5px" }}>
//                       {" "}
//                       ({propertyData?.property_review_count})
//                     </span>
//                     &nbsp;&bull;&nbsp;
//                     <span style={{ fontWeight: "500", color: "#333" }}>
//                       ${propertyData?.hourly_rate} / h
//                     </span>
//                   </Card.Text>

//                   {/* Distance */}
//                   <Card.Text
//                     style={{
//                       fontSize: "16px",
//                       color: "#999",
//                       marginBottom: "5px",
//                     }}
//                   >
//                     <FaMapMarkerAlt style={{ marginRight: "5px" }} />
//                     {propertyData?.distance_miles} miles away
//                   </Card.Text>
//                   <div style={{ display: "flex", justifyContent: "center", width: "100%", }}>
//                     <div style={{
//                         width: "100%",
//                         height: "1px",
//                         backgroundColor: "#ccc",
//                         position: "relative",
//                         margin: "15px",
//                       }} ></div>
//                   </div>
//                   <div style={{ width: "90%",alignItems: "center", justifyContent: "center", }} >
//                     {/* Buttons */}
//                     <Button variant="dark" style={{
//                         width: "100%",
//                         marginBottom: "10px",
//                         borderRadius: "8px",
//                         fontWeight: "500",
//                         backgroundColor: "#2E3A35",
//                         border: "none",
//                       }} >
//                       Pause Bookings
//                     </Button>

//                     <Button variant="outline-dark" onClick={() => setAddPropertyShow(true)}
//                       style={{
//                         width: "100%",
//                         borderRadius: "8px",
//                         fontWeight: "500",
//                         border: "1px solid #333",
//                       }} >
//                       Edit Place
//                     </Button>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </main>
//       {/* <Footer /> */}

//       <AddPropertyModal show={addProperyShow}
//         onHide={() => setAddPropertyShow(false)}
//         property_id={propertyData?.property_id || 122}
//       />
//     </>
//   );
// };

// export default Trial;
