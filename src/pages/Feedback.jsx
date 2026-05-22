import { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { KEYS } from "../config/Constant";
import { useDispatch, useSelector } from "react-redux";
import { setUserType } from "../store/slices/userSlice";
import useAddDetails from "../hooks/host/useAddDetails";
import { toast } from "react-toastify";

const Feedback = () => {

  const {userInfo} = useSelector(({user})=>user)

  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))||  JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId = userInfo?.user_id||userData?.user_id;

  const dispatch = useDispatch();
  const { setFeedBack } = useAddDetails();

  const [useTypes, setUserTypes] = useState(localStorage.getItem(KEYS.USER_TYPE) || "guest");
  const [option, setOption] = useState("");
  const [detailsText, setDetailText] = useState("");
  const [error, setError] = useState("");
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, [])

  dispatch(setUserType(useTypes));

  const handleFeedBack = async (e) => {
    if (e) e.preventDefault(); // Prevent default if event exists

    if (!userId) {
      return;
    }

    if (!detailsText) {
      setError(true);
      return;
    }

    if (!option && !isMobileWidth) {
      toast.error("Please select the option");
      return;
    }

    try {
      const res = await setFeedBack({
        user_id: userId,
        type: useTypes,
        details: detailsText,
      });
      // toast.success(res?.message || "Feedback submitted successfully");
      toast.success("Thank you for your feedback." || res?.message);

      setDetailText("");
    } catch (error) {
      toast.error("Error in submitting feedback:" || error?.res?.message);
    }
    setOption("");
  };

  return (
    <>
      {/* mobile */}
      <div className="mob-search-filter border-start-0 border-end-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mob-search-filter-in">
                <div className="mob-search-bar-back">
                  <Link to="/profile">
                    <i className="fa-regular fa-arrow-left"></i>
                  </Link>
                  <h3 className="feedback-title-mob"  >Share Feedback</h3>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{}} className="feedback-main" >
        <div>
          <h3 className="feedback-title" >Share Feedback</h3>

          {!isMobileWidth && (
            <p style={{ fontSize: "12px", color: "gray" }}>
              Last Updated 07/04/2024
            </p>
          )}

        </div>

        {!isMobileWidth && (

          <div
            style={{
              fontWeight: "400",
              width: "100%",
              height: "1px",
              background: "#000000",
              opacity: 0.3,
              zIndex: 10,
              marginBottom: "8vh",
            }}
          ></div>
        )}
        <div>
          {
            isMobileWidth && (
           <div style={{ margin: "auto" }}>
            <p style={{ lineHeight: "1.6",  color:isMobileWidth?'black':"#555", fontSize:isMobileWidth && '13px'  }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
            )
          }

           
             { !isMobileWidth  && (
            <div style={{ margin: "auto" }}>
            <p style={{ lineHeight: "1.6",  color:isMobileWidth?'black':"#555", fontSize:isMobileWidth && '13px' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. Lorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the
              1500s, when an unknown printer took a galley of type and scrambled
              it to make a type specimen book. Lorem Ipsum is simply dummy text
              of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. Lorem Ipsum is simply dummy text of the
              printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. Lorem Ipsum is simply dummy text of the
              printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. Lorem Ipsum is simply dummy text of the
              printing and typestting industry.
            </p>
          </div>
            )
          }
        </div>

         { !isMobileWidth  && (
        <div style={{ margin: "auto" }}>
          <p style={{ lineHeight: "1.6", color:isMobileWidth?'black':"#555", fontSize:isMobileWidth && '13px'  }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>)}
        <Card style={{ marginTop: "20px", border: "none" }} className="form-select-chutiya">
          <Form onSubmit={handleFeedBack}      >
            <Form.Group controlId="feedbackCategory">
              <Form.Label style={{ fontWeight:isMobileWidth ?"noraml":"500",color:'black',fontSize:isMobileWidth ?"14px" :'18px' }}>
                What's your feedback about?
              </Form.Label>
              <Form.Select

                // style={{ height: "50px", borderRadius: "10px", width: "65%" }}
                value={useTypes}
                onChange={(e) => setUserTypes(e.target.value)}
                 style={{fontSize:'13px', padding:isMobileWidth && '10px'}}
              >
                <option 
                  value={useTypes === "guest"}
                  disabled={useTypes === "host"}
                >
                  Guest
                </option>
                <option
                  value={useTypes === "host"}
                  disabled={useTypes === "guest"}
                >
                  Host
                </option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="feedbackDetails" className="mt-3">
              {
                isMobileWidth && (
                      <Form.Label style={{ fontWeight: "400",color:'black',fontSize:'18px' }}>
                Add Details
              </Form.Label>
                )
              }
              
              <Form.Control
                value={detailsText}
                onChange={(e) => {
                  setDetailText(e.target.value);
                  setError(false);
                }}
                as="textarea"
                rows={4}
                placeholder={!isMobileWidth && "Add Details"}
                style={{color:'#8E8E8E',fontSize:'13px'}}
              // className="form-select-chutiya"
              // style={{ borderRadius: "5px", width: "65%" }}
              />
              {error && (
                <Form.Text style={{ color: "red" }}>
                  {" "}
                  Detail is Required{" "}
                </Form.Text>
              )}
            </Form.Group>
            <div style={{ marginTop:!isMobileWidth && "40px" }}>
              <h5 style={{ fontWeight: "600" ,fontSize:'18px',color:'black',marginTop:isMobileWidth && '10px' }}>Need to get in touch?</h5>
              <p style={{ fontSize: "14px", color: "#080707" }}>
                We'll start with some questions and guide you to the right
                place.
              </p>
              {
                !isMobileWidth && (
                  <>
                    <Form.Select   style={{color:'#8E8E8E',fontSize:'13px'}}
                      //  className="form-select-chutiya"
                      // style={{ height: "50px", borderRadius: "5px", width: "65%" }}
                      value={option}
                      onChange={(e) => setOption(e.target.value)}
                   
                    >
                      <option value="">Please select</option>
                      <option value="Contact Support">Contact Support</option>
                      <option value="Report a Bug">Report a Bug</option>
                    </Form.Select>
                  </>
                )
              }

            </div>
            <div className="d-flex mt-4">
              <Link
                to="/contactUs"
                style={{ textDecoration: "none", color: "#080707" }}
              >
                <Button
                  variant="light"
                  style={{
                    border: isMobileWidth ? "1px solid black" : "1px solid #4AEAB1",
                    marginRight: "10px",
                    padding: "10px 20px",
                    borderRadius: isMobileWidth? "8px" : "35px",
                  }}
                >
                  Contact us
                </Button>
              </Link>



              {!isMobileWidth && (

                <Button
                  type="submit"
                  style={{
                    border: "1px solid #4AEAB1",
                    padding: "10px 30px",
                    borderRadius: "25px",
                    backgroundColor: "#4AEAB1",
                    color: "#000",
                  }}
                >
                  Submit
                </Button>
              )}

            </div>

            {isMobileWidth && (
              <div
                style={{
                  fontWeight: "400",
                  width: "100%",
                  height: "1px",
                  background: "#000000",
                  opacity: 0.3,
                  zIndex: 10,
                  marginBottom: "3vh",
                  marginTop: "3vh",
                }}
              ></div>
            )}

            {isMobileWidth && (

              <Button
                type="submit"
                style={{
                  border: "1px solid #4AEAB1",
                  padding: "10px 30px",
                  borderRadius: "25px",
                  backgroundColor: "#4AEAB1",
                  color: "#000",
                }}
              >
                Submit
              </Button>
            )}

          </Form>
        </Card>
      </div>
    </>
  );
};

export default Feedback;


// import { useEffect, useState } from "react";
// import { Form, Button, Card } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { KEYS } from "../config/Constant";
// import { useDispatch } from "react-redux";
// import { setUserType } from "../store/slices/userSlice";
// import useAddDetails from "../hooks/host/useAddDetails";
// import { toast } from "react-toastify";

// const Feedback = () => {
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userId = userData?.user_id;

//   const dispatch = useDispatch();
//   const { setFeedBack } = useAddDetails();

//   const [useTypes, setUserTypes] = useState(localStorage.getItem(KEYS.USER_TYPE) || "guest");
//   const [option, setOption] = useState("");
//   const [detailsText, setDetailText] = useState("");
//   const [error, setError] = useState("");
//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };

//     checkWindowWidth();
//     window.addEventListener('resize', checkWindowWidth);

//     return () => window.removeEventListener('resize', checkWindowWidth);
//   }, [])

//   dispatch(setUserType(useTypes));

//   const handleFeedBack = async (e) => {
//     if (e) e.preventDefault(); // Prevent default if event exists

//     if (!userId) {
//       return;
//     }

//     if (!detailsText) {
//       setError(true);
//       return;
//     }

//     if (!option && !isMobileWidth) {
//       toast.error("Please select the option");
//       return;
//     }

//     try {
//       const res = await setFeedBack({
//         user_id: userId,
//         type: useTypes,
//         details: detailsText,
//       });
//       toast.success(res?.message || "Feedback submitted successfully");

//       setDetailText("");
//     } catch (error) {
//       toast.error("Error in submitting feedback:" || error?.res?.message);
//     }
//     setOption("");
//   };

//   return (
//     <>
//       {/* mobile */}
//       <div className="mob-search-filter border-start-0 border-end-0">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="mob-search-filter-in">
//                 <div className="mob-search-bar-back">
//                   <Link to="/profile">
//                     <i className="fa-regular fa-arrow-left"></i>
//                   </Link>
//                   <h3 className="feedback-title-mob"  >Share Feedback</h3>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div style={{}} className="feedback-main" >
//         <div>
//           <h3 className="feedback-title" >Share Feedback</h3>

//           {!isMobileWidth && (
//             <p style={{ fontSize: "12px", color: "gray" }}>
//               Last Updated 07/04/2024
//             </p>
//           )}

//         </div>

//         {!isMobileWidth && (

//           <div
//             style={{
//               fontWeight: "400",
//               width: "100%",
//               height: "1px",
//               background: "#000000",
//               opacity: 0.3,
//               zIndex: 10,
//               marginBottom: "8vh",
//             }}
//           ></div>
//         )}
//         <div>
//           <div style={{ margin: "auto" }}>
//             <p style={{ lineHeight: "1.6", color: "#555" }}>
//               Lorem Ipsum is simply dummy text of the printing and typesetting
//               industry. Lorem Ipsum has been the industry's standard dummy text
//               ever since the 1500s, when an unknown printer took a galley of
//               type and scrambled it to make a type specimen book.
//             </p>
//           </div>
//           <div style={{ margin: "auto" }}>
//             <p style={{ lineHeight: "1.6", color: "#555" }}>
//               Lorem Ipsum is simply dummy text of the printing and typesetting
//               industry. Lorem Ipsum has been the industry's standard dummy text
//               ever since the 1500s, when an unknown printer took a galley of
//               type and scrambled it to make a type specimen book. Lorem Ipsum is
//               simply dummy text of the printing and typesetting industry. Lorem
//               Ipsum has been the industry's standard dummy text ever since the
//               1500s, when an unknown printer took a galley of type and scrambled
//               it to make a type specimen book. Lorem Ipsum is simply dummy text
//               of the printing and typesetting industry. Lorem Ipsum has been the
//               industry's standard dummy text ever since the 1500s, when an
//               unknown printer took a galley of type and scrambled it to make a
//               type specimen book. Lorem Ipsum is simply dummy text of the
//               printing and typesetting industry. Lorem Ipsum has been the
//               industry's standard dummy text ever since the 1500s, when an
//               unknown printer took a galley of type and scrambled it to make a
//               type specimen book. Lorem Ipsum is simply dummy text of the
//               printing and typesetting industry. Lorem Ipsum has been the
//               industry's standard dummy text ever since the 1500s, when an
//               unknown printer took a galley of type and scrambled it to make a
//               type specimen book. Lorem Ipsum is simply dummy text of the
//               printing and typestting industry.
//             </p>
//           </div>
//         </div>
//         <div style={{ margin: "auto" }}>
//           <p style={{ lineHeight: "1.6", color: "#555" }}>
//             Lorem Ipsum is simply dummy text of the printing and typesetting
//             industry. Lorem Ipsum has been the industry's standard dummy text
//             ever since the 1500s, when an unknown printer took a galley of type
//             and scrambled it to make a type specimen book.
//           </p>
//         </div>
//         <Card style={{ marginTop: "20px", border: "none" }} className="form-select-chutiya">
//           <Form onSubmit={handleFeedBack}      >
//             <Form.Group controlId="feedbackCategory">
//               <Form.Label style={{ fontWeight: "500" }}>
//                 What's your feedback about?
//               </Form.Label>
//               <Form.Select

//                 // style={{ height: "50px", borderRadius: "10px", width: "65%" }}
//                 value={useTypes}
//                 onChange={(e) => setUserTypes(e.target.value)}
//               >
//                 <option
//                   value={useTypes === "guest"}
//                   disabled={useTypes === "host"}
//                 >
//                   Guest
//                 </option>
//                 <option
//                   value={useTypes === "host"}
//                   disabled={useTypes === "guest"}
//                 >
//                   Host
//                 </option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group controlId="feedbackDetails" className="mt-3">
//               <Form.Control
//                 value={detailsText}
//                 onChange={(e) => {
//                   setDetailText(e.target.value);
//                   setError(false);
//                 }}
//                 as="textarea"
//                 rows={4}
//                 placeholder="Add details"
//                 style={{color:'#8E8E8E'}}
//               // className="form-select-chutiya"
//               // style={{ borderRadius: "5px", width: "65%" }}
//               />
//               {error && (
//                 <Form.Text style={{ color: "red" }}>
//                   {" "}
//                   Detail is Required{" "}
//                 </Form.Text>
//               )}
//             </Form.Group>
//             <div style={{ marginTop:!isMobileWidth && "40px" }}>
//               <h5 style={{ fontWeight: "500" ,fontSize:'18px'}}>Need to get in touch?</h5>
//               <p style={{ fontSize: "14px", color: "#080707" }}>
//                 We'll start with some questions and guide you to the right
//                 place.
//               </p>
//               {
//                 !isMobileWidth && (
//                   <>
//                     <Form.Select   style={{color:'#8E8E8E'}}
//                       //  className="form-select-chutiya"
//                       // style={{ height: "50px", borderRadius: "5px", width: "65%" }}
//                       value={option}
//                       onChange={(e) => setOption(e.target.value)}
//                     >
//                       <option value="">Please select</option>
//                       <option value="Contact Support">Contact Support</option>
//                       <option value="Report a Bug">Report a Bug</option>
//                     </Form.Select>
//                   </>
//                 )
//               }

//             </div>
//             <div className="d-flex mt-4">
//               <Link
//                 to="/contactUs"
//                 style={{ textDecoration: "none", color: "#080707" }}
//               >
//                 <Button
//                   variant="light"
//                   style={{
//                     border: "1px solid #4AEAB1",
//                     marginRight: "10px",
//                     padding: "10px 20px",
//                     borderRadius: isMobileWidth? "2px" : "35px",
//                   }}
//                 >
//                   Contact us
//                 </Button>
//               </Link>



//               {!isMobileWidth && (

//                 <Button
//                   type="submit"
//                   style={{
//                     border: "1px solid #4AEAB1",
//                     padding: "10px 30px",
//                     borderRadius: "25px",
//                     backgroundColor: "#4AEAB1",
//                     color: "#000",
//                   }}
//                 >
//                   Submit
//                 </Button>
//               )}

//             </div>

//             {isMobileWidth && (
//               <div
//                 style={{
//                   fontWeight: "400",
//                   width: "100%",
//                   height: "1px",
//                   background: "#000000",
//                   opacity: 0.3,
//                   zIndex: 10,
//                   marginBottom: "3vh",
//                   marginTop: "3vh",
//                 }}
//               ></div>
//             )}

//             {isMobileWidth && (

//               <Button
//                 type="submit"
//                 style={{
//                   border: "1px solid #4AEAB1",
//                   padding: "10px 30px",
//                   borderRadius: "25px",
//                   backgroundColor: "#4AEAB1",
//                   color: "#000",
//                 }}
//               >
//                 Submit
//               </Button>
//             )}

//           </Form>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default Feedback;