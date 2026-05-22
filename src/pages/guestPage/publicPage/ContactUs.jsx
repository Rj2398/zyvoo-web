import React, { useEffect, useState } from 'react'
import AuthModal from '../../../components/guest/authModal'
import Map from '../../../components/guest/Map'
import useContent from '../../../hooks/useContent';
import { useForm } from 'react-hook-form';
import { KEYS } from '../../../config/Constant';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';

const ContactUs = () => {

      const {userInfo} = useSelector(({user})=>user)
    const { contact_us } = useContent();
    const navigate=useNavigate()
    const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
    const userId =userInfo?.user_id ? String(userInfo?.user_id) : null|| userData?.user_id ? String(userData?.user_id) : null;

    const [isRobotChecked, setIsRobotChecked] = useState(false);
    const [isRobotError, setIsRobotError] = useState(false);

     const [isMobileWidth, setIsMobileWidth] = useState(false);
    
      useEffect(() => {
        const checkWindowWidth = () => {
          setIsMobileWidth(window.innerWidth <= 768);
        };
    
        checkWindowWidth(); // run on mount
        window.addEventListener("resize", checkWindowWidth);
    
        return () => window.removeEventListener("resize", checkWindowWidth);
      }, []);

    const { register, handleSubmit, formState: { errors }, reset, } = useForm();
    const user = useSelector((state) => state.user);

    const onSubmit = async (data) => {
      if (!isRobotChecked && !isMobileWidth) {
        setIsRobotError(true);
        return;
      }
      
      try {
        const response = await contact_us({
          user_id: userId, // Default user_id as fallback
          name: data.name,
          email: data.email,
          message: data.message,
        });
        
        if (response) {
          setIsRobotChecked(false);
          toast.success("Form submitted successfully!")
          reset();
        }
      } catch (error) {
        alert("Failed to send message. Please try again.");
      }
    };

  return (
    <>
      <main>
        {/* <div className="mob-search-filter border-start-0 border-end-0">
              <div className="container-fluid">
                  <div className="row">
                      <div className="col-lg-12">
                          <div className="mob-search-filter-in">
                              <div className="mob-search-in">
                                  <ul>
                                      <li><a href="mob-src-filter.html">Where</a></li>
                                      <li><a className="mob-search-in-time" href="mob-src-filter.html">Time</a></li>
                                      <li><a href="mob-src-filter.html">Activity</a></li>
                                  </ul>
                                  <a href="mob-src-filter.html" className="mob-search-button"><i
                                          className="fa-regular fa-magnifying-glass"></i></a>
                              </div>
                              <div className="mob-filter-in">
                                  <a href="mob-filter.html"><img src="/images/contact-page/filter.svg"
                                          loading="lazy" alt="" /></a>
                              </div>
                          </div>

                      </div>
                  </div>
              </div>
          </div> */}


              <div className="mob-search-filter border-start-0 border-end-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mob-search-filter-in">
                <div className="mob-search-bar-back">
                  <Link onClick={() => navigate(-1)}>
                    <i className="fa-regular fa-arrow-left"></i>
                  </Link>
                  <h3 className="feedback-title-mob"  >Contact Us</h3>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
          {/* MOBILE */}

          {/* CONTACT-PAGE */}
          <div className="faq-wrap">
              <div className="container-fluid">
                  <div className="row justify-content-center">
                      <div className="col-lg-12">
                        {!isMobileWidth && (
                         <div className="faq-heading">
                              <h1>Contact Us</h1>
                          </div>)}
                          <div className="faq-in">
                              <div className="faq-top mb-4">
                                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                      Ipsum
                                      has been the <br /> industry's standard dummy text ever since the 1500s, when an
                                      unknown printer took a galley.</p>
                              </div>
                          </div>
                      </div>
                      <div className={isMobileWidth?"col-lg-6 col-md-6":"col-5"}>
                          <div className="contact-help">
                              <h2>Help & Contact</h2>
                              <div className="contact-help-in">
                                  <h3>Contact Us</h3>
                                  
                                  <Form onSubmit={handleSubmit(onSubmit)}>
                                  <input type="text" placeholder="Your Name" className="input-placeholder"
                                    style={{
                                      borderRadius : "0px",
                                      border: "none",
                                      borderBottom: "1px solid #808080",
                                      outline: "none",
                                      boxShadow: "none",
                                      fontSize:'13px',
                                      color:'#6B7879',
                                      
                                    }} {...register("name", { required: "Name is required" })} />
                                  {errors.name && (
                                    <p className="text-danger w-100">{errors.name.message}</p>
                                  )}

                                  <input type="text"  placeholder="Your Email" className="input-placeholder mb-4"
                                    style={{
                                      // borderRadius : "0px",
                                      // border: "none",
                                      // borderBottom: "1px solid #000",
                                      // outline: "none",
                                      // boxShadow: "none",
                                      // fontSize:'13px',
                                      
                                    }} {...register("email", {
                                      required: "Email is required",
                                      pattern: {
                                        value:
                                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address",
                                      },
                                    })} />

                                  {errors.email && (
                                    <p className="text-danger w-100">{errors.email.message}</p>
                                  )}

                                  <Form.Label  style={{marginBottom:'-8px'}}>Message</Form.Label>

                                  <textarea as="textarea" rows={3} className="mb-4"
                                    style={{
                                      // border: "1px solid #000",
                                      // outline: "none",
                                      // boxShadow: "none",
                                      // background: "transparent",
                                    }}
                                    {...register("message", { required: "Message is required", })}
                                  />
                                  {errors.message && (
                                    <p className="text-danger w-100">{errors.message.message}</p>
                                  )}

                              { !isMobileWidth &&   <Card className=" p-3 justify-content-between ps-0"
                                    style={{ border: "0", padding: "10px 15px", width: "100%" }} >
                                    <div className="d-flex justify-content-around align-items-center" 
                                      style={{
                                        border: "1px solid #c1c1c1",
                                        borderRadius: "4px",
                                        padding: "10px",
                                        width: "60%",
                                        background: "#fff",
                                        boxShadow: "0px 1px 2px rgba(0,0,0,0.1)",
                                        marginTop:'-37px'
                                      }} >
                                      <div className="d-flex align-items-center" style={{ gap: "12px" }} >
                                        <div onClick={() => {setIsRobotChecked(!isRobotChecked); setIsRobotError(false);}} 
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "3px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                           
                                            border: !isRobotChecked &&"1px solid #c1c1c1", // ✅ Border for the checkbox
                                          }} >
                                          {isRobotChecked && (
                                            <span style={{ 
                                                fontSize: "20px",
                                                color: "#008000", 
                                                fontWeight: "400",
                                                marginBottom: "3px",
                                              }} >
                                              ✔
                                            </span>
                                          )}
                                        </div>
                                        <span style={{ fontSize: "16px", color: "#333", fontWeight: "400" }} >
                                          I'm not a robot
                                        </span>
                                      </div>

                                      <div className="d-flex flex-column align-items-center" style={{ minWidth: "55px" }} >
                                        <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" loading="lazy" alt="captcha" 
                                          style={{ width: "40px", height: "40px" }} />
                                        <span style={{ fontSize: "10px", color: "#999" }}>
                                          reCAPTCHA
                                        </span>
                                      </div>
                                    </div>
                                    {isRobotError && (
                                      <p className="text-danger w-100"> {"Please complete the CAPTCHA to submit the form"} </p>
                                    )}
                                  </Card>}
                                  
                                  <Button type="submit" className=""
                                    // disabled={!isRobotChecked}
                                    style={{
                                      backgroundColor: "#4AEAB1",
                                      color: "#000000",
                                      fontSize: "18px",
                                      fontWeight: "500",
                                      padding: "10px 20px",
                                      borderRadius: "25px",
                                      border: "none",
                                      width:'90%',
                                      
                                    }} >
                                    Submit
                                  </Button>
                                </Form>
                              </div>
                          </div>
                      </div>

                          <div className={isMobileWidth?"col-lg-6 col-md-6":"col-3"}>
                          {/* <div className="contact-help">
                              <h2>Help & Contact</h2>
                              <div className="contact-help-in">
                                  <h3>Contact Us</h3>
                                  
                                  <Form onSubmit={handleSubmit(onSubmit)}>
                                  <Form.Control type="text" placeholder="Your Name" className="mb-4"
                                    style={{
                                      borderRadius : "0px",
                                      border: "none",
                                      borderBottom: "1px solid #000",
                                      outline: "none",
                                      boxShadow: "none",
                                    }} {...register("name", { required: "Name is required" })} />
                                  {errors.name && (
                                    <p className="text-danger w-100">{errors.name.message}</p>
                                  )}

                                  <Form.Control type="email" placeholder="Your Email" className="mb-4"
                                    style={{
                                      borderRadius : "0px",
                                      border: "none",
                                      borderBottom: "1px solid #000",
                                      outline: "none",
                                      boxShadow: "none",
                                    }} {...register("email", {
                                      required: "Email is required",
                                      pattern: {
                                        value:
                                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address",
                                      },
                                    })} />

                                  {errors.email && (
                                    <p className="text-danger w-100">{errors.email.message}</p>
                                  )}

                                  <Form.Label>Message</Form.Label>

                                  <Form.Control as="textarea" rows={3} className="mb-4"
                                    style={{
                                      border: "1px solid #000",
                                      outline: "none",
                                      boxShadow: "none",
                                      background: "transparent",
                                    }}
                                    {...register("message", { required: "Message is required", })}
                                  />
                                  {errors.message && (
                                    <p className="text-danger w-100">{errors.message.message}</p>
                                  )}

                                  <Card className="mb-3 p-3 justify-content-between ps-0"
                                    style={{ border: "0", padding: "10px 15px", width: "100%" }} >
                                    <div className="d-flex justify-content-around align-items-center" 
                                      style={{
                                        border: "1px solid #c1c1c1",
                                        borderRadius: "4px",
                                        padding: "10px",
                                        width: "60%",
                                        background: "#fff",
                                        boxShadow: "0px 1px 2px rgba(0,0,0,0.1)",
                                      }} >
                                      <div className="d-flex align-items-center" style={{ gap: "12px" }} >
                                        <div onClick={() => {setIsRobotChecked(!isRobotChecked); setIsRobotError(false);}} 
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "3px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            border: "1px solid #c1c1c1", // ✅ Border for the checkbox
                                          }} >
                                          {isRobotChecked && (
                                            <span style={{ 
                                                fontSize: "34px",
                                                color: "#98f794", 
                                                fontWeight: "400",
                                                marginBottom: "10px",
                                              }} >
                                              ✔
                                            </span>
                                          )}
                                        </div>
                                        <span style={{ fontSize: "16px", color: "#333", fontWeight: "400" }} >
                                          I'm not a robot
                                        </span>
                                      </div>

                                      <div className="d-flex flex-column align-items-center" style={{ minWidth: "55px" }} >
                                        <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" loading="lazy" alt="captcha" 
                                          style={{ width: "40px", height: "40px" }} />
                                        <span style={{ fontSize: "10px", color: "#999" }}>
                                          reCAPTCHA
                                        </span>
                                      </div>
                                    </div>
                                    {isRobotError && (
                                      <p className="text-danger w-100"> {"Please complete the CAPTCHA to submit the form"} </p>
                                    )}
                                  </Card>
                                  
                                  <Button type="submit" className="w-100"
                                    // disabled={!isRobotChecked}
                                    style={{
                                      backgroundColor: "#4AEAB1",
                                      color: "#000000",
                                      fontSize: "18px",
                                      fontWeight: "400",
                                      padding: "10px 20px",
                                      borderRadius: "25px",
                                      border: "none",
                                    }} >
                                    Submit
                                  </Button>
                                </Form>
                              </div>
                          </div> */}
                      </div>
                      <div className={isMobileWidth?"col-lg-6 col-md-6":"col-4"}>
                          <div className="contact-support">
                              <h2>Customer Support</h2>
                              <p>Our Customer Service Team are also available On.</p>
                              <div className="contact-support-in">
                                  <div className="icon">
                                      <img src="/images/contact-page/call.svg" loading="lazy" alt="" />
                                  </div>
                                  <h3>Contact Number <br /> <span><a href="">+1(000) 000-0000</a></span></h3>
                              </div>
                              <div className="contact-support-in">
                                  <div className="icon">
                                      <img src="/images/contact-page/mail.svg" loading="lazy" alt="" />
                                  </div>
                                  <h3>Email Address <br />
                                      <span><a href="">info@yourdomain.com</a></span> <br />
                                      <span><a href="">info@yourdomain.com</a></span>
                                  </h3>
                              </div>
                              <div className="contact-support-in">
                                  <div className="icon">
                                      <img src="/images/contact-page/location.svg" loading="lazy" alt="" />
                                  </div>
                                  <h3>Location <br />
                                      <span>Atlanta, GA, USA'</span>
                                  </h3>
                              </div>
                          </div>
                      </div>
                      <div className="col-lg-12">
                          <div className="contact-map">
                              <Map lat="22.572645" lng="88.363892" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </main>
      <AuthModal />
    </>
  )
}

export default ContactUs


// import React, { useEffect, useState } from 'react'
// import AuthModal from '../../../components/guest/authModal'
// import Map from '../../../components/guest/Map'
// import useContent from '../../../hooks/useContent';
// import { useForm } from 'react-hook-form';
// import { KEYS } from '../../../config/Constant';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
// import { Link, useNavigate } from 'react-router-dom';

// const ContactUs = () => {
//     const { contact_us } = useContent();
//     const navigate=useNavigate()
//     const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//     const userId = userData?.user_id ? String(userData?.user_id) : null;

//     const [isRobotChecked, setIsRobotChecked] = useState(false);
//     const [isRobotError, setIsRobotError] = useState(false);

//      const [isMobileWidth, setIsMobileWidth] = useState(false);
    
//       useEffect(() => {
//         const checkWindowWidth = () => {
//           setIsMobileWidth(window.innerWidth <= 768);
//         };
    
//         checkWindowWidth(); // run on mount
//         window.addEventListener("resize", checkWindowWidth);
    
//         return () => window.removeEventListener("resize", checkWindowWidth);
//       }, []);

//     const { register, handleSubmit, formState: { errors }, reset, } = useForm();
//     const user = useSelector((state) => state.user);

//     const onSubmit = async (data) => {
//       if (!isRobotChecked && !isMobileWidth) {
//         setIsRobotError(true);
//         return;
//       }
      
//       try {
//         const response = await contact_us({
//           user_id: userId, // Default user_id as fallback
//           name: data.name,
//           email: data.email,
//           message: data.message,
//         });
        
//         if (response) {
//           setIsRobotChecked(false);
//           toast.success("Form submitted successfully!")
//           reset();
//         }
//       } catch (error) {
//         alert("Failed to send message. Please try again.");
//       }
//     };

//   return (
//     <>
//       <main>
//         {/* <div className="mob-search-filter border-start-0 border-end-0">
//               <div className="container-fluid">
//                   <div className="row">
//                       <div className="col-lg-12">
//                           <div className="mob-search-filter-in">
//                               <div className="mob-search-in">
//                                   <ul>
//                                       <li><a href="mob-src-filter.html">Where</a></li>
//                                       <li><a className="mob-search-in-time" href="mob-src-filter.html">Time</a></li>
//                                       <li><a href="mob-src-filter.html">Activity</a></li>
//                                   </ul>
//                                   <a href="mob-src-filter.html" className="mob-search-button"><i
//                                           className="fa-regular fa-magnifying-glass"></i></a>
//                               </div>
//                               <div className="mob-filter-in">
//                                   <a href="mob-filter.html"><img src="/images/contact-page/filter.svg"
//                                           loading="lazy" alt="" /></a>
//                               </div>
//                           </div>

//                       </div>
//                   </div>
//               </div>
//           </div> */}


//               <div className="mob-search-filter border-start-0 border-end-0">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="mob-search-filter-in">
//                 <div className="mob-search-bar-back">
//                   <Link onClick={() => navigate(-1)}>
//                     <i className="fa-regular fa-arrow-left"></i>
//                   </Link>
//                   <h3 className="feedback-title-mob"  >Contact Us</h3>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//           {/* MOBILE */}

//           {/* CONTACT-PAGE */}
//           <div className="faq-wrap">
//               <div className="container-fluid">
//                   <div className="row justify-content-center">
//                       <div className="col-lg-12">
//                         {!isMobileWidth && (
//                          <div className="faq-heading">
//                               <h1>Contact Us</h1>
//                           </div>)}
//                           <div className="faq-in">
//                               <div className="faq-top mb-4">
//                                   <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
//                                       Ipsum
//                                       has been the <br /> industry's standard dummy text ever since the 1500s, when an
//                                       unknown printer took a galley.</p>
//                               </div>
//                           </div>
//                       </div>
//                       <div className={isMobileWidth?"col-lg-6 col-md-6":"col-5"}>
//                           <div className="contact-help">
//                               <h2>Help & Contact</h2>
//                               <div className="contact-help-in">
//                                   <h3>Contact Us</h3>
                                  
//                                   <Form onSubmit={handleSubmit(onSubmit)}>
//                                   <input type="text" placeholder="Your Name" className="input-placeholder mb-4"
//                                     style={{
//                                       // borderRadius : "0px",
//                                       // border: "none",
//                                       // borderBottom: "1px solid #000",
//                                       // outline: "none",
//                                       // boxShadow: "none",
//                                       // fontSize:'13px',
//                                       //  color:'#6B7879'
//                                     }} {...register("name", { required: "Name is required" })} />
//                                   {errors.name && (
//                                     <p className="text-danger w-100">{errors.name.message}</p>
//                                   )}

//                                   <input type="text" placeholder="Your Email" className="input-placeholder mb-4"
//                                     style={{
//                                       // borderRadius : "0px",
//                                       // border: "none",
//                                       // borderBottom: "1px solid #000",
//                                       // outline: "none",
//                                       // boxShadow: "none",
//                                       // fontSize:'13px',
                                      
//                                     }} {...register("email", {
//                                       required: "Email is required",
//                                       pattern: {
//                                         value:
//                                           /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                                         message: "Invalid email address",
//                                       },
//                                     })} />

//                                   {errors.email && (
//                                     <p className="text-danger w-100">{errors.email.message}</p>
//                                   )}

//                                   <Form.Label>Message</Form.Label>

//                                   <textarea as="textarea" rows={3} className="mb-4"
//                                     style={{
//                                       // border: "1px solid #000",
//                                       // outline: "none",
//                                       // boxShadow: "none",
//                                       // background: "transparent",
//                                     }}
//                                     {...register("message", { required: "Message is required", })}
//                                   />
//                                   {errors.message && (
//                                     <p className="text-danger w-100">{errors.message.message}</p>
//                                   )}

//                               { !isMobileWidth &&   <Card className="mb-3 p-3 justify-content-between ps-0"
//                                     style={{ border: "0", padding: "10px 15px", width: "100%" }} >
//                                     <div className="d-flex justify-content-around align-items-center" 
//                                       style={{
//                                         border: "1px solid #c1c1c1",
//                                         borderRadius: "4px",
//                                         padding: "10px",
//                                         width: "60%",
//                                         background: "#fff",
//                                         boxShadow: "0px 1px 2px rgba(0,0,0,0.1)",
//                                       }} >
//                                       <div className="d-flex align-items-center" style={{ gap: "12px" }} >
//                                         <div onClick={() => {setIsRobotChecked(!isRobotChecked); setIsRobotError(false);}} 
//                                           style={{
//                                             width: "20px",
//                                             height: "20px",
//                                             borderRadius: "3px",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             cursor: "pointer",
//                                             // border: "1px solid #c1c1c1", // ✅ Border for the checkbox
//                                           }} >
//                                           {isRobotChecked && (
//                                             <span style={{ 
//                                                 fontSize: "20px",
//                                                 color: "#008000", 
//                                                 fontWeight: "400",
//                                                 marginBottom: "3px",
//                                               }} >
//                                               ✔
//                                             </span>
//                                           )}
//                                         </div>
//                                         <span style={{ fontSize: "16px", color: "#333", fontWeight: "400" }} >
//                                           I'm not a robot
//                                         </span>
//                                       </div>

//                                       <div className="d-flex flex-column align-items-center" style={{ minWidth: "55px" }} >
//                                         <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" loading="lazy" alt="captcha" 
//                                           style={{ width: "40px", height: "40px" }} />
//                                         <span style={{ fontSize: "10px", color: "#999" }}>
//                                           reCAPTCHA
//                                         </span>
//                                       </div>
//                                     </div>
//                                     {isRobotError && (
//                                       <p className="text-danger w-100"> {"Please complete the CAPTCHA to submit the form"} </p>
//                                     )}
//                                   </Card>}
                                  
//                                   <Button type="submit" className="w-100"
//                                     // disabled={!isRobotChecked}
//                                     style={{
//                                       backgroundColor: "#4AEAB1",
//                                       color: "#000000",
//                                       fontSize: "18px",
//                                       fontWeight: "500",
//                                       padding: "10px 20px",
//                                       borderRadius: "25px",
//                                       border: "none",
//                                     }} >
//                                     Submit
//                                   </Button>
//                                 </Form>
//                               </div>
//                           </div>
//                       </div>

//                           <div className={isMobileWidth?"col-lg-6 col-md-6":"col-3"}>
//                           {/* <div className="contact-help">
//                               <h2>Help & Contact</h2>
//                               <div className="contact-help-in">
//                                   <h3>Contact Us</h3>
                                  
//                                   <Form onSubmit={handleSubmit(onSubmit)}>
//                                   <Form.Control type="text" placeholder="Your Name" className="mb-4"
//                                     style={{
//                                       borderRadius : "0px",
//                                       border: "none",
//                                       borderBottom: "1px solid #000",
//                                       outline: "none",
//                                       boxShadow: "none",
//                                     }} {...register("name", { required: "Name is required" })} />
//                                   {errors.name && (
//                                     <p className="text-danger w-100">{errors.name.message}</p>
//                                   )}

//                                   <Form.Control type="email" placeholder="Your Email" className="mb-4"
//                                     style={{
//                                       borderRadius : "0px",
//                                       border: "none",
//                                       borderBottom: "1px solid #000",
//                                       outline: "none",
//                                       boxShadow: "none",
//                                     }} {...register("email", {
//                                       required: "Email is required",
//                                       pattern: {
//                                         value:
//                                           /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                                         message: "Invalid email address",
//                                       },
//                                     })} />

//                                   {errors.email && (
//                                     <p className="text-danger w-100">{errors.email.message}</p>
//                                   )}

//                                   <Form.Label>Message</Form.Label>

//                                   <Form.Control as="textarea" rows={3} className="mb-4"
//                                     style={{
//                                       border: "1px solid #000",
//                                       outline: "none",
//                                       boxShadow: "none",
//                                       background: "transparent",
//                                     }}
//                                     {...register("message", { required: "Message is required", })}
//                                   />
//                                   {errors.message && (
//                                     <p className="text-danger w-100">{errors.message.message}</p>
//                                   )}

//                                   <Card className="mb-3 p-3 justify-content-between ps-0"
//                                     style={{ border: "0", padding: "10px 15px", width: "100%" }} >
//                                     <div className="d-flex justify-content-around align-items-center" 
//                                       style={{
//                                         border: "1px solid #c1c1c1",
//                                         borderRadius: "4px",
//                                         padding: "10px",
//                                         width: "60%",
//                                         background: "#fff",
//                                         boxShadow: "0px 1px 2px rgba(0,0,0,0.1)",
//                                       }} >
//                                       <div className="d-flex align-items-center" style={{ gap: "12px" }} >
//                                         <div onClick={() => {setIsRobotChecked(!isRobotChecked); setIsRobotError(false);}} 
//                                           style={{
//                                             width: "20px",
//                                             height: "20px",
//                                             borderRadius: "3px",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             cursor: "pointer",
//                                             border: "1px solid #c1c1c1", // ✅ Border for the checkbox
//                                           }} >
//                                           {isRobotChecked && (
//                                             <span style={{ 
//                                                 fontSize: "34px",
//                                                 color: "#98f794", 
//                                                 fontWeight: "400",
//                                                 marginBottom: "10px",
//                                               }} >
//                                               ✔
//                                             </span>
//                                           )}
//                                         </div>
//                                         <span style={{ fontSize: "16px", color: "#333", fontWeight: "400" }} >
//                                           I'm not a robot
//                                         </span>
//                                       </div>

//                                       <div className="d-flex flex-column align-items-center" style={{ minWidth: "55px" }} >
//                                         <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" loading="lazy" alt="captcha" 
//                                           style={{ width: "40px", height: "40px" }} />
//                                         <span style={{ fontSize: "10px", color: "#999" }}>
//                                           reCAPTCHA
//                                         </span>
//                                       </div>
//                                     </div>
//                                     {isRobotError && (
//                                       <p className="text-danger w-100"> {"Please complete the CAPTCHA to submit the form"} </p>
//                                     )}
//                                   </Card>
                                  
//                                   <Button type="submit" className="w-100"
//                                     // disabled={!isRobotChecked}
//                                     style={{
//                                       backgroundColor: "#4AEAB1",
//                                       color: "#000000",
//                                       fontSize: "18px",
//                                       fontWeight: "400",
//                                       padding: "10px 20px",
//                                       borderRadius: "25px",
//                                       border: "none",
//                                     }} >
//                                     Submit
//                                   </Button>
//                                 </Form>
//                               </div>
//                           </div> */}
//                       </div>
//                       <div className={isMobileWidth?"col-lg-6 col-md-6":"col-4"}>
//                           <div className="contact-support">
//                               <h2>Customer Support</h2>
//                               <p>Our Customer Service Team are also available On.</p>
//                               <div className="contact-support-in">
//                                   <div className="icon">
//                                       <img src="/images/contact-page/call.svg" loading="lazy" alt="" />
//                                   </div>
//                                   <h3>Contact Number <br /> <span><a href="">+1(000) 000-0000</a></span></h3>
//                               </div>
//                               <div className="contact-support-in">
//                                   <div className="icon">
//                                       <img src="/images/contact-page/mail.svg" loading="lazy" alt="" />
//                                   </div>
//                                   <h3>Email Address <br />
//                                       <span><a href="">info@yourdomain.com</a></span> <br />
//                                       <span><a href="">info@yourdomain.com</a></span>
//                                   </h3>
//                               </div>
//                               <div className="contact-support-in">
//                                   <div className="icon">
//                                       <img src="/images/contact-page/location.svg" loading="lazy" alt="" />
//                                   </div>
//                                   <h3>Location <br />
//                                       <span>Atlanta, GA, USA'</span>
//                                   </h3>
//                               </div>
//                           </div>
//                       </div>
//                       <div className="col-lg-12">
//                           <div className="contact-map">
//                               <Map lat="22.572645" lng="88.363892" />
//                           </div>
//                       </div>
//                   </div>
//               </div>
//           </div>
//       </main>
//       <AuthModal />
//     </>
//   )
// }

// export default ContactUs

