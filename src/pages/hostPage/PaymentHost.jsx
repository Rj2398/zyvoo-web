import { useState, useRef, useEffect } from "react";
import AuthModal from "../../components/guest/authModal";
import { Badge, Button, Card, Dropdown, Form, InputGroup, Modal, Table, } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FaRedo, FaSearch } from "react-icons/fa";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "react-feather";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { KEYS, imageBase } from "../../config/Constant";
import { SlidersHorizontal } from "lucide-react";
import useFilter from "../../hooks/host/useFilter";
import "bootstrap/dist/css/bootstrap.min.css";
import mastercard from "../../assets/gallery/mastercard.svg";
import visaCard from "../../assets/gallery/visa.svg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { VscKebabVertical } from "react-icons/vsc";
import moment from "moment";
import useCardDetails from "../../hooks/host/useCardDetails";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CardBankPayment from "../../components/host/cardBankPayment";
import { CheckLg } from "react-bootstrap-icons";
import { useSelector } from "react-redux";


function PaymentHost({ getStripId, getcard_id }) {
   const {userInfo} = useSelector(({user})=>user)
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId = userInfo?.user_id ||userData?.user_id;
  const { withdrawalList, payoutBalance, availableBalance, requestWithdrawal } = useFilter();
  const { getCardorBankList, setPrimaryCardorBank, deletePayoutMethod, isLoading, } = useCardDetails();

  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [data, setData] = useState([]);
  const [nextPayData, setNexPayData] = useState({});
  const [leftBalence, setLeftBalence] = useState({});
  const [isHovered1, setIsHovered1] = useState(false);

  const currentDate = moment().toDate();
  const last7thDay = moment().subtract(7, "days").toDate();

  const [startDate, setStartDate] = useState(last7thDay); // ✅ Date object
  const [endDate, setEndDate] = useState(currentDate);
  //

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
  const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  const [withdrawalType, setWithdrawalType] = useState("");
  const [amount, setAmount] = useState("");
  const [showWithdrowModal, setShowWithdrowModal] = useState(false);
  const [showPayOutModal1, setShowPayOutModal1] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempPaymentStatus, setTempPaymentStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const perPageOptions = [20,30,40];

  for (let i = 1; i < totalPages; i++) {
    perPageOptions.push(i * 10);
  }

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const statusMap = {
    Completed: "completed", // assuming 'completed' is the correct backend value
    Pending: "pending",
    Cancelled: "cancelled",
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const fetchWidrollAmnt = async () => {
    const response = await withdrawalList({
      user_id: userId,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      filter_status: statusMap[paymentStatus],
    });
    if (response) {
      setData(response?.data);
    }
  };
  useEffect(() => {
    fetchWidrollAmnt();
  }, [showCalendar, paymentStatus]);

  useEffect(() => {
    fetchnextPayment();
    fetchAmnt();
  }, []);

  const fetchnextPayment = async () => {
    const response = await payoutBalance({
      user_id: userId,
    });
    if (response) {
      setNexPayData(response?.data);
    }
  };
  const fetchAmnt = async () => {
    const response = await availableBalance({
      user_id: userId,
    });
    if (response) {
      setLeftBalence(response?.data);
    }
  };

  const widhrollAmnt = async () => {
    if (!amount || amount === "") {
      toast.error("Please enter an amount");
      setShowWithdrowModal(true); // Keep modal open
      return;
    }

    const response = await requestWithdrawal({
      user_id: userId,
      amount: amount,
      withdrawal_type:
        withdrawalType == "Instant (Fee 2%)" ? "instant" : "standard",
    });

    if (response?.data?.amount == "") {
      toast.error("Withdrawal failed"); // Or show actual error from response
      setShowWithdrowModal(true); // Keep it open for user to fix
    } else {
      setShowWithdrowModal(false); // Close modal only on valid response
    }

    if (response?.success) {
      toast.success(response?.message);
      setAmount("");
    } else {
      toast.error(response);
      setAmount("");
    }
  };

  const [cardDataArray, setCardDataArray] = useState([]);
  const [bankDataArray, setBankDataArray] = useState([]);
  const [currentIndex2, setCurrentIndex2] = useState(0);

   const [cardCurrency, setCardCurrency] = useState();
  const [bankCurrency, setBankCurrency] = useState();


  const [allBankCard, setAllBankCard] = useState([])



  const [toggleState, setToggleState] = useState(false);

  const fetchAndSetData = async () => {
    try {
      const response = await getCardorBankList({ user_id: userId });
      const bankAccounts = response?.data?.bank_accounts || [];
      const cards = response?.data?.cards || [];

      setBankDataArray(bankAccounts);
      setCardDataArray(cards);

      setAllBankCard([...bankAccounts, ...cards])

    } catch (error) {
      console.error("Error fetching bank data:", error);
    }
  };


  useEffect(() => {
    fetchAndSetData();
  }, [toggleState]);

  const nextCard2 = () => {
    setCurrentIndex2((prev) => (prev + 1) % bankDataArray.length);
  };

  const prevCard2 = () => {
    setCurrentIndex2(
      (prev) => (prev - 1 + bankDataArray.length) % bankDataArray.length
    );
  };

  const prevCard1 = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? cardDataArray.length - 1 : prev - 1
    );
  };

  const nextCard1 = () => {
    setCurrentIndex((prev) =>
      prev === cardDataArray.length - 1 ? 0 : prev + 1
    );
  };

  const formatBookingDate = (date) => {
  const d = new Date(date);
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();

  return `${month} ${day}, ${year}`;
};

  const [cardId, setCardId] = useState();
  


  const handlePrimary = async (id) => {
    try {
      const res = await setPrimaryCardorBank({
        user_id: userId,
        payout_method_id: id,
      });
      if (res.success) {
        fetchAndSetData();
        setToggleState((prev) => !prev);
        setCardId(id);
      }
    } catch (err) {
      console.error("Error setting primary:", err);
    }
  };

  const deleteMethod = async (id) => {
    try {
      const res = await deletePayoutMethod({
        user_id: userId,
        payout_method_id: id,
      });

      if (res.success) {
        fetchAndSetData();
        setToggleState((prev) => !prev);
        setCurrentIndex2(1);
      }
    } catch (err) {
      console.error("Error setting primary:", err);
    }
  };

  return (
    <>
      <main
        style={{
          backgroundColor: "white",
          backgroundSize: "20px 20px",
          backgroundImage:
            " radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
        }}
      >
        <>
          {/* <div className="container-fluid p-5 row"> */}
          <div className={`container-fluid ${isMobileWidth ? "mob-payment-host m-0 p-0" : "px-5"} row`}>
            {/* Left Section - Payment History */}
            <div className="col-lg-8 col-md-6"
              style={{
                backgroundColor: "transparent",
                padding: "30px",
                borderRadius: "10px",
                marginRight: "20px",
                width: "70%",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                {isMobileWidth && (
                  <div className="col-lg-12">
                    <div className="mob-search-filter-in">
                      <div className="mob-search-bar-back">
                        <Link to="/profile">
                          <i className="fa-regular fa-arrow-left" style={{ textAlign: "center" }}></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  style={{ position: "relative", display: "inline-block",marginLeft:isMobileWidth && "2%" }}
                  ref={calendarRef}
                >
                  <InputGroup
                    onClick={() => setShowCalendar(!showCalendar)}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "30px",
                      padding: "2px 15px",
                      background: "#fff",
                      cursor: "pointer",
                      minWidth: "250px",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <img
                      src="/images/Host/date-range-host.svg"
                      loading="lazy"
                      alt="Calendar"
                      width={20}
                      style={{ marginRight: "10px" }}
                    />

                    <Form.Control
                      type="text"
                      readOnly
                      value={
                        startDate && endDate
                          ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d yyyy")} (EST)`
                          : "Select date range"
                      }
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "#000000",
                        background: "none",
                        border: "none",
                        boxShadow: "none",
                        cursor: "pointer",
                      }}
                    />

                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "14px",
                        color: "#252849",
                      }}
                    >
                      <img
                        src="/images/Host/date-down-icon.svg"
                        loading="lazy"
                        alt="down arrow"
                        width={15}
                      />
                    </span>
                  </InputGroup>

                  {showCalendar && (
                    <div
                      className="my-place-date-range"
                      style={{
                        position:"absolute",        // Center floating calendar
                        top:  "560%",
                        left: isMobileWidth ? "51%" : "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: "1000",
                        background: "#fff",
                        padding: "15px",
                        borderRadius: "10px",
                        border: "3px solid #3A4B4C",
                        width: "90vw",
                        maxWidth: "365px",
                        maxHeight: "80vh",
                        overflow: "auto",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      <DatePicker
                        selected={startDate}
                        onChange={(dates) => {
                          const [start, end] = dates;
                          setStartDate(start);
                          setEndDate(end);
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        calendarClassName="responsive-calendar"
                      />
                    </div>
                  )}
                </div>

                <div
                  style={
                    !isMobileWidth
                      ? {
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "30px",
                        cursor: "pointer",
                      }
                      : {
                        border: "1px solid #ddd",
                        borderRadius: "50px",
                        padding: "10px 12px",
                        marginLeft: "10px",
                      }
                  }
                  onClick={() => setShowModal(true)}
                >
                  <SlidersHorizontal
                    size={20}
                    color="black"
                    fontWeight={"500"}
                  />

                  {!isMobileWidth && (
                    <Button
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        color: "black",
                        fontWeight: "400",
                      }}
                    >
                      Filter
                    </Button>
                  )}
                </div>


              </div>

              <div className="table-responsive" style={{
                height: totalPages === 10 ? "100%" : "auto",
                maxHeight: "500px",
                // borderRadius: "20px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "0",
                margin: "0",
                backgroundColor: "transparent",
                borderCollapse: "separate",
                borderSpacing: "10px 20px"  
                // minWidth: "400px",
      
              }} >
                <Table  style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  borderRadius: "5px",
                  width: "100%",
                  marginBottom: "0",
                  // backgroundColor: "#E2E2E2",
                  borderCollapse: "separate",
                  borderSpacing: "0px 10px",  
             
                 
           
                }} 
                
                >
                  { <thead style={{
                    // backgroundColor: "black !important",
                    borderTop: "2px solid #ddd",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                  }} >
                    <tr style={{ fontSize: "16px", textAlign:"start" }}>
                      <th className="payment-host-th" style={{borderLeft:'1px solid #E2E2E2',width:'25%',textAlign:'left',paddingLeft:"33px"}}> Amount </th>
                      <th className="payment-host-th" style={{width:'25%',textAlign:'left'}}> Status </th>
                      <th className="payment-host-th" style={{width:'25%',textAlign:'left'}}> Guest Name </th>
                      <th className="payment-host-th" style={{borderRight:'1px solid #E2E2E2',width:'25%',textAlign:'left',paddingLeft:'15px'}}> Date </th>
                    </tr>
                  </thead>}
                    {currentData.length > 0 ? (
                      currentData.map((item, index) => (
                        <tbody style={{marginTop:'10px'}} >
                        <tr key={index} style={{
                          border: "1px solid #E2E2E2 !important" ,
                            // borderTop: "1px solid #E2E2E2",
                            textAlign: "center",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "5px",
                            boxShadow: "0 -1px 0 #ccc, 0 1px 0 #ccc"
                          // marginTop: "100px",
                          // marginBottom:'10px',
                          // boxShadow: '0 10px 10px rgba(88, 27, 27, 0.15)'

                          // display: "table-row",
                          // border: "1px solid red"
                        }}
                        >
                          <td style={{ padding: "15px 14px 0px 33px", fontWeight: "400", color: "black",fontSize:'15px',borderLeft:'1px solid #E2E2E2',width:'25%',textAlign:'left'}} >
                            ${item.booking_amount}
                          </td>
                          <td style={{ padding: "15px 0",width:'25%',textAlign:'left' }}>
                            {/* <span
                              className={`badge ${item.status == "pending"
                                  ? "#FFF178 text-dark"
                                  : item.status == "completed"
                                    ? "#4AEAB1"
                                    : "bg-danger"
                                }`}
                              style={{
                                fontSize: "15px",
                                padding: "5px 15px",
                                borderRadius: "20px",
                                minWidth: "90px",
                                display: "inline-block",
                                textAlign: "center",
                                fontWeight:'400',
                                color:'black'
                              }}
                            >
                              {item.status}
                            </span> */}

                        <span
            className="badge"
          style={{
               fontSize: "15px",
               padding: "5px 15px",
               borderRadius: "20px",
               minWidth: "90px",
               display: "inline-block",
               textAlign: "center",
               fontWeight: "400",
               color: "black",
               backgroundColor:
               item.status === "pending"
                 ? "#FFF178"
                 : item.status === "completed"
                 ? "#4AEAB1"
                 : "#dc3545", // danger red
              }}
           >
               {item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1)}
         </span>

                          </td>
                          <td style={{
                            padding: "15px 0", textAlign: "center",width:'25%',textAlign:'left'
                            // display: "flex", alignItems: "center", justifyContent: "center",
                          }} >
                            <div style={{
                              display: "flex",
                              // justifyContent: "center",
                              alignItems: "center",
                              minWidth: "200px",
                              margin: "0 auto",
                              width: "fit-content",
                            }}
                            >
                              <img src={imageBase + item.guest_profile_image} loading="lazy" alt="Profile"
                                className="me-2 rounded-circle" width="30" height="30"
                                style={{padding: "2px" }} />
                              <span style={{ fontWeight: "400", marginLeft: "8px",fontSize:'15px',color:'black' }}
                              >
                                {item.guest_name}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "15px",
                              fontWeight: "400",
                              color: "black",
                              fontSize: "15px",
                              width: "max-content",
                              borderRight: "1px solid #E2E2E2",width:'25%',textAlign:'left'
                            }}
                          >
                            {formatBookingDate(item.booking_date)}
                          </td>
                        </tr>

                         </tbody> 
                      ))
                      
                    ) : (

                <td
  colSpan="100%"
  style={{
    textAlign: 'center',
    verticalAlign: 'middle',
    height: '100px'
  }}
>
  No data available
</td>

                      )}
                </Table>
              </div>
              <div>

                {
                  //  currentData.length > 0 ?   (
                  <div
                    className="d-flex justify-content-end align-items-center mb-3"
                    style={{
                      padding: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <Dropdown>
                      {/* <Dropdown.Toggle
                        variant="light"
                        id="dropdown-basic"
                        style={{
                          padding: "8px 15px",
                          fontSize: "14px",
                          fontWeight: "500",
                          border: "1px solid #ccc",
                          borderRadius: "15px",
                          backgroundColor: "#fff",
                          color: "#3A4B4C",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {itemsPerPage} <span> per Page </span>
                      </Dropdown.Toggle> */}

                      <Dropdown.Toggle
  variant="light"
  id="dropdown-basic"
  className="d-flex align-items-center gap-2"
  style={{
    padding: "8px 15px",
    fontSize: "14px",
    fontWeight: "500",
    border: "1px solid #ccc",
    borderRadius: "15px",
    backgroundColor: "#fff",
    color: "#3A4B4C",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  }}
>


  {itemsPerPage} <span>per Page</span>
  <ChevronDown size={18} />

  <style>
    {
     ` .dropdown-toggle::after {
        display: none;
        } `
    }
  </style>
</Dropdown.Toggle>

                      <Dropdown.Menu
                        style={{
                          padding: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "10px",
                          backgroundColor: "#fff",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                          minWidth: "150px",
                        }}
                      >
                        {perPageOptions.map((option) => (
                          <Dropdown.Item
                            key={option}
                            onClick={() => handleItemsPerPageChange(option)}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              color: "#333",
                              fontSize: "14px",
                              backgroundColor: "#f8f9fa",
                              border: "1px solid #e1e3e6",
                              borderRadius: "5px",
                              marginBottom: "4px",
                              transition: "background-color 0.2s ease-in-out",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#e9ecef")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#f8f9fa")
                            }
                          >
                            {option} per Page
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  //   ):(
                  //     <>
                  //     <hr/>
                  //         <div
                  //   className="d-flex justify-content-center align-items-center "
                  //   style={{
                  //     padding: "10px",
                  //     marginTop: "40px",
                  //     marginBottom:'100px',
                  //     fontSize:'23px'

                  //   }}
                  // >
                  // No Data Found
                  // </div>
                  //     </>


                  //   )
                }


                {perPageOptions?.length > 1 && (
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <Button
                      variant="outline-success"
                      className="mx-1 rounded-circle"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "18px",
                        border: "2px solid rgb(208, 230, 225)", // Teal border
                        color: "#16A085",
                        background: "white",
                        transition: "all 0.3s ease",
                        boxShadow: "0px 3px 6px rgba(22, 160, 133, 0.3)", // Soft shadow
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "white";
                        e.target.style.color = "#16A085";
                      }}
                    >
                      <ChevronLeft size={22} />
                    </Button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => (
                      <Button
                        key={index}
                        variant={
                          currentPage === index + 1
                            ? "success"
                            : "outline-success"
                        }
                        className="mx-1 rounded-circle"
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                          width: "45px",
                          height: "45px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight:
                            currentPage === index + 1 ? "bold" : "normal",
                          fontSize: "16px",
                          borderWidth:
                            currentPage === index + 1 ? "2px" : "1px",
                          background:
                            currentPage === index + 1
                              ? "linear-gradient(135deg, #3A4B4C, #3A4B4C)"
                              : "white",
                          color:
                            currentPage === index + 1 ? "white" : "#16A085",
                          border: "2px solid rgb(196, 243, 234)",
                          transition: "all 0.3s ease",
                          boxShadow:
                            currentPage === index + 1
                              ? "0px 3px 6px rgba(22, 160, 133, 0.6)"
                              : "none",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background =
                            "linear-gradient(135deg, #3A4B4C, #3A4B4C)";
                          e.target.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background =
                            currentPage === index + 1
                              ? "linear-gradient(135deg, #3A4B4C, #3A4B4C)"
                              : "white";
                          e.target.style.color =
                            currentPage === index + 1 ? "white" : "#16A085";
                        }}
                      >
                        {index + 1}
                      </Button>
                    ))}

                    {/* Next Button */}
                    <Button
                      variant="outline-success"
                      className="mx-1 rounded-circle"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "18px",
                        border: "2px solid rgb(208, 230, 225)", // Teal border
                        color: "#16A085",
                        background: "white",
                        transition: "all 0.3s ease",
                        boxShadow: "0px 3px 6px rgba(66, 94, 88, 0.3)", // Soft shadow
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "white";
                        e.target.style.color = "#16A085";
                      }}
                    >
                      <ChevronRight size={22} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div
              className="col-lg-3 col-md-6"
              style={{
                backgroundColor: "transparent",
                padding: "10px",
                borderRadius: "10px",
                marginTop: "30px",
                width: "28%",
              }}
            >
              <div
                style={
                  isMobileWidth
                    ? {
                      // border: '3px solid red',
                      display: "flex",
                      alignItems: "center",
                      gap: isMobileWidth ? "62px" : "7px",
                      justifyContent: isMobileWidth && "space-around",
                      padding: isMobileWidth && "0px 13px",

                    }
                    : {}
                }
              >
                {/* 1st Card Details  */}
                <Card
                  className="mb-4 shadow-sm border rounded-3"
                  style={{ maxWidth: "350px", }}
                >
                  <Card.Body className="text-center">
                    <div className="d-flex" style={{marginTop: "-7px"}}>
                      <div
                        className="d-flex align-items-center justify-content-between"
                        style={{ marginRight: "10px",}}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center rounded"
                          style={{
                            backgroundColor: "#5ED7A5",
                            width: "60px",
                            height: "57px",
                          }}
                        >
                          <img
                            src="images/Host/next-payment-icon.svg"
                            loading="lazy" alt="Payment Icon"
                            // width="50"
                            // height="50"
                            style={{
                              width:'50px',
                              height:'50px'
                            }}
                          />
                        </div>
                        <span className="info-wrap nw-info-wrp">
                          <span
                            onMouseEnter={() => setIsHovered1(true)}
                            onMouseLeave={() => setIsHovered1(false)}
                            style={{
                              display: "inline-block",
                              position: "relative",
                            }}
                          >
                            <img
                              src="/images/create-profile/info.svg"
                              loading="lazy" alt=""
                              style={{ cursor: "pointer", marginLeft: 0 }}
                            />
                            {isHovered1 && (
                              <span
                                style={{
                                  display: "block",
                                  position: "absolute",
                                  top: "100%",
                                  // left: isMobileWidth ? "-50px" : "0",
                                  backgroundColor: "#fff",
                                  color: "#000",
                                  padding: "8px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                  width: isMobileWidth ? "300px" : "400px",
                                  // maxWidth: isMobileWidth ? "90vw" : "400px",
                                  fontSize: isMobileWidth ? "12px" : "14px",
                                  right: isMobileWidth ? "-150px" : "0",
                                  wordWrap: "break-word",
                                  zIndex: 10,
                                  whiteSpace: "normal",
                                }}
                              >
                                For 'Standard' - 'Your Withdrawal has been
                                initiated successfully and will be deposited
                                into your account in 3-5 business days.'For
                                'Instant' - 'Your Withdrawal has been initiated
                                successfully and will be deposited into your
                                account in 30 minutes.'
                              </span>
                            )}
                          </span>
                        </span>
                      </div>
                      <div className="text-center" style={{ margin: "0px" }}>
                        <p
                          className="mt-3 mb-1"
                          style={{
                            fontSize: isMobileWidth ? "12px" : "15px",
                            fontWeight: "400",
                            color: "black",
                          }}
                        >
                          Next Payment
                        </p>
                        <h4
                          className="fw-bold text-start"
                          style={{
                            color: "#000",
                            fontSize: isMobileWidth ? "14px" : "18px",
                          }}
                        >
                          ${nextPayData?.next_payout}
                        </h4>
                      </div>
                    </div>
                    <div
                      className="justify-items-start"
                      style={{
                        margin: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        margin: "10px",
                      }}
                    >
                      <p
                        className="small "
                        style={{
                          fontSize: isMobileWidth ? "12px" : "16px",
                          color: "black",
                          // margin: "0px -7px 0px 10px",
                         
                          padding: "0px",
                          fontWeight: "400",
                          marginBottom: "10px",
                          marginLeft: "-10px",
                        }}
                      >
                        {nextPayData.next_payout_date ?? "No payment yet."}
                      </p>
                      <Button
                        variant="outline-none"
                        className="w-500"
                        style={{
                          borderRadius: "20px",
                          padding: "10px 12px",
                          fontSize: isMobileWidth ? "12px" : "13px",
                          fontWeight: "400",
                          color:'#252849',
                          borderColor:'#252849',
                          marginLeft:'-15px',
                          width:!isMobileWidth && '54%',
                          marginTop:!isMobileWidth && '8px'
                        }}
                        onClick={() => setShowWithdrowModal(true)}
                      >
                        Withdraw Funds
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                {/* <Link to="#">
                <div
                  className="d-flex justify-content-center"
                  style={{ margin: "10px", maxWidth: "350px" }}
                > */}
                <Button
                  variant="outline-dark"
                  className="mb-3"
                  style={{
                    backgroundColor: "#3A4B4C",
                    color: "#fff",
                    padding: "10px 0",
                    width: isMobileWidth ? "55%" : "100%",
                    fontSize: isMobileWidth ? "10px" : "15px",
                    // border: "1px solid yellow"
                  }}
                  // onClick={() => setShowPayOutModal(true)}
                  onClick={() => setShowPayOutModal1(true)}
                >
                  Add payout Method
                </Button>
                {/* </div>
              </Link> */}
              </div>

              {/* 2nd Card Details  */}
              <div className="added-cards-detail-main">
                {
                  !isMobileWidth ? (
                    <>

                      <div className="debit-card-wrap"
                      // style={{ width: "100%", display: "flex",justifyContent: "center", }}
                      >
                        <div
                          style={{
                            width: "100%",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          {cardId?.includes("card_") && !cardId?.includes("ba_") && (
                            <Loader visible={isLoading} />
                          )}

                          <div
                            style={{
                              display: "flex",
                              transition: "transform 0.5s ease-in-out",
                              transform: `translateX(-${currentIndex * 100}%)`,
                              alignItems: "center",
                            }}
                          >
                            {cardDataArray.map((card, index) => (

                              <div
                                key={card.id || index}
                                style={{
                                  width: "100%",
                                  flexShrink: 0,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Card
                                  className="p-3 mb-3 shadow-sm border-0 rounded-3"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #3A4B4C, #3A4B4C)",
                                    color: "#FFF",
                                    width: "100%",
                                    height: "190px",
                                    position: "relative",
                                    overflow: "hidden",
                                  }}
                                >
                                  <Card.Body
                                    style={{
                                      position: "relative",
                                      borderRadius: "15px",
                                    }}
                                  >
                                    {/* Background Image */}
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "15px",
                                        backgroundImage: `url(${imageBase}+images/Host/card-bank-account.svg)`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        opacity: 0.5,
                                        zIndex: 0,
                                      }}
                                    />

                                    {/* Header */}
                                    <div
                                      className="d-flex align-items-center justify-content-end w-100"
                                      style={{ position: "relative", zIndex: 2 }}

                                      
                                    >

                                      {/* {setCardCurrency(card?.default_for_currency)} */}
                                      {card?.default_for_currency && (
                                        <Badge
                                          bg="danger"
                                          style={{
                                            top: "10px",
                                            left: "10px",
                                            zIndex: 10,
                                            fontSize: "10px",
                                            padding: "5px 10px",
                                            borderRadius: "8px",
                                            marginTop:'-25px'
                                          }}
                                        >
                                          Primary
                                        </Badge>
                                      )}

                                      <div
                                        className="d-flex align-items-center justify-content-end w-100"
                                        style={{
                                          position: "relative",
                                          zIndex: 1,
                                          top: "-10px",
                                          right: "-10px",
                                        }}
                                      >
                                        <div className="d-flex align-items-center">
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: "500",
                                              marginRight: "8px",
                                            }}
                                          >
                                            Debit
                                          </span>

                                          <Dropdown align="end">
                                            <Dropdown.Toggle
                                              variant="link"
                                              className="text-white p-0 border-0 shadow-none d-flex flex-column  dropdown-toggle-no-caret"
                                              style={{
                                                fontSize: "8px",
                                                lineHeight: "5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "-8px",
                                                textDecoration: "none",
                                              }}
                                            >
                                              <BsThreeDotsVertical
                                                size={26}
                                                color="white"
                                                style={{ marginRight: "-9px" }}
                                              />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="shadow-sm">
                                              {!card?.default_for_currency && (
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    handlePrimary(card?.id)
                                                  }
                                                >
                                                  Primary
                                                </Dropdown.Item>
                                              )}

                                              <Dropdown.Item
                                                onClick={() => deleteMethod(card?.id)}
                                              >
                                                Delete
                                              </Dropdown.Item>
                                            </Dropdown.Menu>
                                          </Dropdown>

                                          <style>
                                            {` .dropdown-toggle-no-caret::after { 
                                          display: none !important;
                                        }
                                    `}
                                          </style>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Card Number */}
                                    <div
                                      className="d-flex justify-content-between align-items-center mt-4"
                                      style={{ position: "relative", zIndex: 1 }}
                                    >
                                      <div className="d-flex align-items-center">
                                        <span
                                          style={{
                                            fontSize:isMobileWidth ?"12px":"14px",
                                            fontWeight: "bold",
                                            marginRight: "8px",
                                            letterSpacing: "2px",
                                          }}
                                        >
                                          •••• •••• ••••
                                        </span>
                                        <span
                                          style={{
                                            fontSize:isMobileWidth ?"12px":"14px",
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                          }}
                                        >
                                          {card.last_four_digits}
                                        </span>
                                      </div>

                                      {/* Valid Thru */}
                                      <div
                                        className="d-flex align-items-center ms-2"
                                        style={{
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        <div
                                          className="d-flex flex-column text-end"
                                          style={{
                                            lineHeight: "10px",
                                            marginTop: "3px",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "10px",
                                              opacity: "0.8",
                                              textTransform: "uppercase",
                                            }}
                                          >
                                            VALID
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "10px",
                                              opacity: "0.8",
                                              textTransform: "uppercase",
                                            }}
                                          >
                                            THRU
                                          </span>
                                        </div>
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                          }}
                                        >
                                          {/* {card.exp_month || "--"}/{card.exp_year || "--"} */}
                                          {String(card.exp_month)?.padStart(2, "0") ||
                                            "--"}
                                          /{String(card.exp_year)?.slice(-2) || "--"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Name */}
                                    <p
                                      className="mb-0 mt-2"
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        textTransform: "uppercase",
                                        position: "relative",
                                        zIndex: 1,
                                        color:'white',
                                        top:!isMobileWidth && '23px'
                                      }}
                                    >
                                      {card.card_holder_name}
                                    </p>

                                    {/* Logo */}
                                    <img src={card?.brand == "visa" ? visaCard : mastercard}
                                      loading="lazy" alt="Visa"
                                      width="40"
                                      className="position-absolute"
                                      style={{
                                        bottom: "auto",
                                        right: "0",
                                        zIndex: 1,
                                      }}
                                    />
                                  </Card.Body>
                                </Card>
                              </div>
                            ))}
                          </div>

                          {/* Navigation Buttons */}
                          {cardDataArray.length > 1 && (
                            <>
                              <button
                                onClick={prevCard1}
                                className="payment-card-prev-btn"
                              >
                                {" "}
                                ‹{" "}
                              </button>
                              <button
                                onClick={nextCard1}
                                className="payment-card-next-btn"
                              >
                                {" "}
                                ›{" "}
                              </button>
                            </>
                          )}
                        </div>
                      </div>



                      {/* 3rd Card Details  */}
                      <div className="Bank-account-wrap">
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            overflow: "hidden",
                          }}
                        >
                          {cardId?.includes("card_") && !cardId?.includes("ba_") && (
                            <Loader visible={isLoading} />
                          )}
                          <div
                            style={{
                              display: "flex",
                              transform: `translateX(-${currentIndex2 * 100}%)`,
                              transition: "transform 0.5s ease-in-out",
                              alignItems: "center",
                            }}
                          >
                            {bankDataArray.map((bank, index) => (
                              <div
                                key={bank.id}
                                style={{
                                  flex: "0 0 100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >

                              
                                <Card
                                  className="p-2 mb-2 shadow-sm border-0 rounded-3"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #3A4B4C, #2C3E3E)",
                                    color: "#FFF",
                                    maxWidth: "350px",
                                    width: "100%",
                                    position: "relative",
                                    borderRadius: "15px",
                                    height: "220px",
                                  }}
                                >
                                  <Card.Body>
                                    <img
                                      src="images/Host/card-bank-account.svg"
                                      loading="lazy" alt="card-bank-account"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "15px",
                                        objectFit: "cover",
                                        zIndex: 0,
                                      }}
                                    />

                                    <div className="d-flex justify-content-between align-items-center"
                                      style={{ position: "relative", zIndex: 1 }} >

                                      {bank?.default_for_currency && (
                                        <Badge
                                          bg="danger"
                                          style={{
                                            top: "10px",
                                            left: "10px",
                                            zIndex: 10,
                                            fontSize: "10px",
                                            padding: "5px 10px",
                                            borderRadius: "8px",
                                             marginTop:!isMobileWidth && '-25px'
                                          }}
                                        >
                                          Primary
                                        </Badge>
                                      )}

                                      <div
                                        className="d-flex align-items-center justify-content-end w-100"
                                        style={{
                                          position: "relative",
                                          zIndex: "1",
                                          top: "-10px",
                                          right: "-15px",
                                        }}
                                      >
                                        <div className="d-flex align-items-center">
                                          <Dropdown align="end">
                                            <Dropdown.Toggle
                                              variant="link"
                                              className="text-white p-0 border-0 shadow-none d-flex flex-column dropdown-toggle-no-caret"
                                              style={{
                                                fontSize: "8px",
                                                lineHeight: "5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "4px",
                                                textDecoration: "none",
                                              }}
                                            >
                                              <BsThreeDotsVertical
                                                size={26}
                                                color="white"
                                              />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="shadow-sm">
                                              <Dropdown.Item
                                                onClick={() =>
                                                  handlePrimary(bank?.id)
                                                }
                                              >
                                                Primary
                                              </Dropdown.Item>
                                              <Dropdown.Item
                                                onClick={() => deleteMethod(bank?.id)}
                                              >
                                                Delete
                                              </Dropdown.Item>
                                            </Dropdown.Menu>
                                          </Dropdown>

                                          <style>
                                            {` .dropdown-toggle-no-caret::after {
                                            display: none !important;
                                          }`}
                                          </style>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="mt-1"
                                      style={{ position: "relative" }}
                                    >
                                      <div className="d-flex align-items-center mt-2">
                                        <img
                                          src="images/Host/bank-name-icon.svg"
                                          loading="lazy" alt="bank"
                                          style={{
                                            width: "20px",
                                            marginRight: "10px",
                                          }}
                                        />
                                        <div>
                                          <p
                                            className="mb-0"
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: "bold",
                                              color:'white'
                                            }}
                                          >
                                            {bank.bank_name}
                                          </p>
                                          <p
                                            className="mb-0"
                                            style={{
                                              fontSize: "12px",
                                              opacity: "0.8",
                                               color:'white'
                                            }}
                                          >
                                            Bank of America
                                          </p>
                                        </div>
                                      </div>

                                      <div className="d-flex align-items-center mt-3">
                                        <img
                                          src="images/Host/account-number-icon.svg"
                                          loading="lazy" alt="account"
                                          style={{
                                            width: "20px",
                                            marginRight: "10px",
                                          }}
                                        />
                                        <div>
                                          <p
                                            className="mb-0"
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: "bold",
                                               color:'white'
                                            }}
                                          >
                                            Account Number
                                          </p>
                                          <p
                                            className="mb-0"
                                            style={{
                                              fontSize: "14px",
                                              letterSpacing: "2px",
                                               color:'white'
                                            }}
                                          >
                                            **** **** ****{" "}
                                            <b>{bank.last_four_digits}</b>
                                          </p>
                                        </div>
                                      </div>

                                      <div className="d-flex align-items-center mt-3">
                                        <img
                                          src="images/Host/routing-number-icon.svg"
                                          loading="lazy" alt="routing"
                                          style={{
                                            width: "20px",
                                            marginRight: "10px",
                                          }}
                                        />
                                        <div>
                                          <p
                                            className="mb-0"
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: "bold",
                                               color:'white'
                                            }}
                                          >
                                            Routing Number
                                          </p>
                                          <p
                                            className="mb-0"
                                            style={{
                                              fontSize: "14px",
                                              letterSpacing: "2px",
                                               color:'white'
                                            }}
                                          >
                                            xxxxxxx <b>{bank?.routing_number||6789}</b>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </div>
                            ))}
                          </div>

                          {/* Navigation Buttons */}
                          {bankDataArray.length > 1 && (
                            <>
                              <button
                                onClick={prevCard2}
                                className="payment-card-prev-btn"
                              >
                                {" "}
                                ‹{" "}
                              </button>
                              <button
                                onClick={nextCard2}
                                className="payment-card-next-btn"
                              >
                                {" "}
                                ›{" "}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>

                  ) : (

                    <>
                      <div style={{ display: "flex", overflowX: "scroll" }}>
                        {allBankCard.map((card, index) => (
                          <div
                            key={index}
                            style={{
                              width: "200px",
                              minWidth: "200px",
                              height: "140px",
                              backgroundColor: "#2E3E3E",
                              borderRadius: "14px",
                              padding: "20px",
                              color: "white",
                              fontFamily: "Arial, sans-serif",
                              position: "relative",
                              boxSizing: "border-box",
                              margin: "10px"
                            }}
                          >

                            {/* Primary Badge */}
                             {  card.default_for_currency && (
                              <Badge
                                bg="danger"
                                style={{
                                  top: "10px",
                                  left: "10px",
                                  zIndex: 10,
                                  fontSize: "10px",
                                  padding: "5px 10px",
                                  borderRadius: "8px",
                                }}
                              >
                                Primary
                              </Badge>
                            )}


                            {/* Debit + 3 Dots Menu */}
                            <div
                              style={{
                                position: "absolute",
                                right: "20px",
                                top: "15px",
                                fontSize: "14px",
                                opacity: 0.9,
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                              }}
                            >
                              {card?.id?.includes("card_") && "Debit"}

                              <Dropdown align="end">
                                <Dropdown.Toggle
                                  variant="link"
                                  className="text-white p-0 border-0 shadow-none dropdown-toggle-no-caret"
                                  style={{
                                    fontSize: "8px",
                                    lineHeight: "5px",
                                    marginLeft: "4px",
                                    textDecoration: "none"
                                  }}
                                >
                                  <BsThreeDotsVertical size={20} color="white" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="shadow-sm">
                                 <Dropdown.Item onClick={() => handlePrimary(card?.id)}> Primary </Dropdown.Item>
                                 <Dropdown.Item onClick={() => deleteMethod(card?.id) }> Delete </Dropdown.Item>
                                  {/* <Dropdown.Item onClick={() => deleteMethod(card?.id?.includes("ba_") ? cardId : card?.id)}>
                                    Delete
                                  </Dropdown.Item> */}
                                </Dropdown.Menu>
                              </Dropdown>

                              <style>
                                {`
          .dropdown-toggle-no-caret::after {
            display: none !important;
          }
        `}
                              </style>
                            </div>

                            {/* Bank Name */}
                            <div
                              style={{
                                marginTop: "10px",
                                fontSize: "12px",
                                letterSpacing: "1px",
                                opacity: 0.9
                              }}
                            >
                              {card?.id?.includes("ba_") && card?.bank_name || ""}
                            </div>

                            {/* Masked Card Number */}
                            <div
                              style={{
                                marginTop: "10px",
                                fontSize: "12px",
                                letterSpacing: "2px",
                                opacity: 0.9
                              }}
                            >
                              •••• •••• •••• {card?.last_four_digits}
                            </div>

                            {/* Valid Thru */}
                            {/* <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px"
                                }}
                              >
                                <span style={{ fontSize: "10px", opacity: 0.7 }}>VALID THRU</span>
                                <span style={{ fontSize: "12px" }}>02/39</span>
                              </div> */}

                            {/* Cardholder Name */}
                            <div
                              style={{
                                marginTop: "12px",
                                fontSize: "13px",
                                letterSpacing: "1px"
                              }}
                            >
                              {card?.id?.includes("ba_") ? card?.account_holder_name : card?.card_holder_name}
                            </div>

                            {/* MasterCard Logo */}
                            <div
                              style={{
                                position: "absolute",
                                bottom: "15px",
                                right: "20px",
                                display: "flex",
                                alignItems: "center"
                              }}
                            >
                              {card.brand && (
                                <img src={card?.brand == "visa" ? visaCard : mastercard}
                                  loading="lazy" alt="Visa" width="40"
                                  className="position-absolute"
                                  style={{ bottom: "auto", right: "0", zIndex: 1 }}
                                />
                              )}

                            </div>
                          </div>
                        ))}
                      </div>

                    </>
                  )
                }
              </div>
            </div>
          </div>
        </>

        {/* Paymament Status pop up */}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body
            style={{
              background: "#fff",
              borderRadius: "15px",
              padding: "25px",
              // minWidth: "450px",
              minWidth: "250px",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                borderBottom: "1px solid #E2E2E2",
                paddingBottom: "1rem",
              }}
              className="d-flex justify-content-center align-items-center mb-3 position-relative"
            >
              <h5 className="m-0" style={{ color: "black", fontWeight: "500" }}>
                Filter
              </h5>
              <div
                className="position-absolute"
                style={{
                  right: "-15px",
                  top: "-15px",
                  backgroundColor: "#3A4B4C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "20px",
                  width: "20px",
                  borderRadius: "50%",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(false)}
              >
                <X size={14} />
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <p
                style={{
                  color: "black",
                  fontWeight: "500",
                  marginBottom: "10px",
                }}
              >
                Payment Status
              </p>
              <div
                className="d-flex w-100"
                style={{
                  backgroundColor: "#F2F2F2",
                  borderRadius: "25px",
                  padding: "5px",
                  justifyContent: "space-between",
                }}
              >
                {["Completed", "Pending", "Cancelled"].map((status, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setTempPaymentStatus(status);
                    }}
                    style={{
                      flex: 1,
                      padding: "8px",
                      fontSize: "14px",
                      fontWeight: tempPaymentStatus === status ? "500" : "400",
                      border: "none",
                      borderRadius: "20px",
                      background:
                      tempPaymentStatus === status ? "#fff" : "transparent",
                      color: tempPaymentStatus === status ? "#000" : "#000",
                      boxShadow:
                        tempPaymentStatus === status
                          ? "0px 0px 4px rgba(0,0,0,0.1)"
                          : "none",
                    }}
                  >
                    {status}
                    
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div
              className="d-flex justify-content-between align-items-center mt-4"
              style={{ gap: "10px" }}
            >
              {/* Clean All Button */}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 20px",
                  borderRadius: "25px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  color: "#000",
                  fontWeight: "400",
                  boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
                  minWidth: "140px",
                  gap: "10px", // Ensures space between text and icon
                  fontSize:'14px'
                }}
                onClick={() => {
                  setPaymentStatus("");
                  setShowModal(false);
                }}
              >
                Clean All
                <span
                  style={{
                    backgroundColor: "#3A4B4C",
                    borderRadius: "50%",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "24px",
                    height: "24px",
                    marginRight: "-20px",
                  }}
                >
                  <FaRedo style={{ color: "#fff", fontSize: "12px" }} />
                </span>
              </button>

              {/* Search Button */}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", // Centers text and icon properly
                  padding: "8px 20px",
                  borderRadius: "25px",
                  border: "none",
                  background: "#4AEAB1",
                  color: "black",
                  fontWeight: "400",
                  boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
                  minWidth: "120px", // Increased for better alignment
                  gap: "10px", // Ensures spacing between text and icon
                  fontSize:'14px'
                }}
                onClick={() => {
                  setPaymentStatus(tempPaymentStatus); // Apply selected filter
                  setShowModal(false); // Close modal
                }}
              >
                Search
                <span
                  style={{
                    backgroundColor: "#3A4B4C",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "30px", // Adjusted for better size
                    height: "30px",
                    marginRight: "-8px",
                  }}
                >
                  <FaSearch style={{ color: "#fff", fontSize: "14px" }} />
                </span>
              </button>
            </div>
          </Modal.Body>
        </Modal>
        {/* Payout Method */}
        <CardBankPayment
          showPayOutModal1={showPayOutModal1}
          setShowPayOutModal1={(bool) => setShowPayOutModal1(bool)}
          modalText={true}
        />

        <Modal
          show={showWithdrowModal}
          onHide={() => setShowWithdrowModal(false)}
          centered
          style={{ padding: isMobileWidth ? '' : '',marginLeft:isMobileWidth && '-16px' }}
          dialogClassName="withdrawal"
        >
       <style>
       {`
         .withdrawal .modal-content {
           width: 76%;
           margin-left:63px;
           
         }
       `}
       </style>

          <Modal.Body style={{ padding: "30px", borderRadius: "10px" }}>
            <div className="text-center">
              <div className="d-flex justify-content-center align-items-center position-relative">
                <h5
                  className="m-0 position-relative"
                  style={{ fontWeight: "500", alignItems: "center", fontSize: isMobileWidth ? '16px' : '',color:'black' }}
                >
                  Withdraw Earnings
                </h5>

                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-15px",
                    backgroundColor: "#3A4B4C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "25px",
                    width: "25px",
                    borderRadius: "50%",
                    color: "#fff",
                    padding: "5px",
                  }}
                >
                  <X
                    onClick={() => {
                      setShowWithdrowModal(false);
                      setAmount("");
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              <hr />
              <p
                style={{
                  fontSize: isMobileWidth ? '14px' : "18px",
                  color: "#000000",
                  fontWeight: "400",
                }}
              >
                Available Balance :{" "}
                <span style={{fontWeight:'600'}}>${leftBalence?.available_balance}</span>
              </p>
            </div>

            <Form  style={{padding:isMobileWidth && "-5px"}}>
              <Form.Group className="mb-3">
                <Form.Label
                  style={{
                    fontSize: isMobileWidth ? "14px" : "16px",
                    color: "#000000",
                    fontWeight: "400",
                  }}
                >
                  Amount :
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ borderRadius: "45px", padding: isMobileWidth ? "10px" : "10px", fontSize: isMobileWidth ? "12px" : "14px", }}
                />
              </Form.Group>

              {/* // old dropdown with no borderRadius */}

              {/* <Form.Group className="mb-3">
                <Form.Label
                  style={{
                    fontSize: "18px",
                    color: "#000000",
                    fontWeight: "400",
                  }}
                >
                  Withdrawal Type :
                </Form.Label>
                <Form.Select
                  value={withdrawalType}
                  onChange={(e) => setWithdrawalType(e.target.value)}
                  style={{
                    borderRadius: "40px",
                    padding: "12px",
                    fontSize: "18px",
                    color: "#000000",
                    fontWeight: "400",
                    // border: "2px solid red"
                  }}
                >
                    <option value="Instant (Fee 2%)">⚡ Instant (Fee 2%)</option>
                    <option value="Standard (3 to 5 business days)">
                      Standard (3 to 5 business days)
                    </option>
                </Form.Select>
              </Form.Group> */}

              <Form.Group className="mb-3">
                <Form.Label
                  style={{
                    fontSize: isMobileWidth ? "14px" : "16px",
                    color: "#000000",
                    fontWeight: "400",
                  }}
                >
                  Withdrawal Type :
                </Form.Label>

                <Dropdown className="w-100">
                  <Dropdown.Toggle
  variant="light"
  className="w-100 d-flex justify-content-between align-items-center"
  style={{
    borderRadius: "40px",
    padding: isMobileWidth ? "9px" : "10px",
    fontSize: isMobileWidth ? "12px" : "14px",
    color: "#000000",
    fontWeight: "400",
    backgroundColor: "#fff",
    border: "1px solid #ced4da",
  }}
>
  {withdrawalType === "" ? (
    <>Select withdrawal type</>
  ) : withdrawalType === "Instant (Fee 2%)" ? (
    <> Instant (Fee 2%)</>
  ) : (
    <>Standard (3 to 5 business days)</>
  )}

  {/* Your custom chevron icon */}
  <ChevronDown size={20} />

  <style>
    {`
      .dropdown-toggle::after {
        display: none !important;
      }`}
    
  </style>
</Dropdown.Toggle>


                  <Dropdown.Menu
                    className="w-100"
                    style={{
                      borderRadius: "15px",
                      overflow: "hidden",
                      border: "1px solid #ced4da",
                      // backgroundColor: "#ccc",
                    }}
                  >
                    <Dropdown.Item
                      onClick={() => setWithdrawalType("Instant (Fee 2%)")}
                      style={{
                        borderRadius: "10px",
                        margin: "5px",
                        padding: "10px 15px",
                        color:'black',
                        backgroundColor:
                          withdrawalType === "Instant (Fee 2%)"
                            ? "#f0f0f0"
                            : "transparent",
                            fontSize:'14px'
                      }}
                    >
                     <span><img src="/images/payment-methods/flashImg.png" width={20}/></span>  Instant (Fee 2%)
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        setWithdrawalType("Standard (3 to 5 business days)")
                      }
                      style={{
                        borderRadius: "10px",
                        margin: "5px",
                        padding: "10px 15px",
                        color:'black',
                        backgroundColor:
                          withdrawalType === "Standard (3 to 5 business days)"
                            ? "#f0f0f0"
                            : "transparent",
                              fontSize:'14px'
                      }}
                    >
                      Standard (3 to 5 business days)
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <div className="text-center">
                <Button
                  variant="primary"
                  style={{
                    borderRadius: "30px",
                    padding: "10px 20px",
                    fontSize: isMobileWidth ? "14px" : "16px",
                    fontWeight: "400",
                    background: "transparent",
                    border: "1px solid #252849",
                    color: "#252849",
                  }}
                  onClick={() => {
                    widhrollAmnt();
                  }}
                >
                  Request withdrawal
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </main>

      <AuthModal />
    </>
  );
}

export default PaymentHost;

// const YourCardComponent = ({ card }) => {
//   return (
//     <div
//       key={card.id || index}
//       style={{
//         width: "100%",
//         flexShrink: 0,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Card
//         className="p-3 mb-3 shadow-sm border-0 rounded-3"
//         style={{
//           background: "linear-gradient(135deg, #3A4B4C, #3A4B4C)",
//           color: "#FFF",
//           width: "100%",
//           height: "190px",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         <Card.Body style={{ position: "relative", borderRadius: "15px" }}>
//           {/* Background Image */}
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               borderRadius: "15px",
//               backgroundImage: `url(${imageBase}+images/Host/card-bank-account.svg)`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               opacity: 0.5,
//               zIndex: 0,
//             }}
//           />

//           {/* Header */}
//           <div
//             className="d-flex align-items-center justify-content-end w-100"
//             style={{ position: "relative", zIndex: 2 }}
//           >
//             {card?.default_for_currency && (
//               <Badge
//                 bg="danger"
//                 style={{
//                   top: "10px",
//                   left: "10px",
//                   zIndex: 10,
//                   fontSize: "10px",
//                   padding: "5px 10px",
//                   borderRadius: "8px",
//                 }}
//               >
//                 Primary
//               </Badge>
//             )}

//             <div
//               className="d-flex align-items-center justify-content-end w-100"
//               style={{
//                 position: "relative",
//                 zIndex: 1,
//                 top: "-10px",
//                 right: "-10px",
//               }}
//             >
//               <div className="d-flex align-items-center">
//                 <span
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     marginRight: "8px",
//                   }}
//                 >
//                   Debit
//                 </span>

//                 <Dropdown align="end">
//                   <Dropdown.Toggle
//                     variant="link"
//                     className="text-white p-0 border-0 shadow-none d-flex flex-column  dropdown-toggle-no-caret"
//                     style={{
//                       fontSize: "8px",
//                       lineHeight: "5px",
//                       display: "flex",
//                       alignItems: "center",
//                       marginLeft: "-8px",
//                       textDecoration: "none",
//                     }}
//                   >
//                     <BsThreeDotsVertical
//                       size={26}
//                       color="white"
//                       style={{ marginRight: "-9px" }}
//                     />
//                   </Dropdown.Toggle>

//                   <Dropdown.Menu className="shadow-sm">
//                     {!card?.default_for_currency && (
//                       <Dropdown.Item onClick={() => handlePrimary(card?.id)}>
//                         Primary
//                       </Dropdown.Item>
//                     )}

//                     <Dropdown.Item onClick={() => deleteMethod(card?.id)}>
//                       Delete
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>

//                 <style>
//                   {` .dropdown-toggle-no-caret::after { 
//                                           display: none !important;
//                                         }
//                                     `}
//                 </style>
//               </div>
//             </div>
//           </div>

//           {/* Card Number */}
//           <div
//             className="d-flex justify-content-between align-items-center mt-4"
//             style={{ position: "relative", zIndex: 1 }}
//           >
//             <div className="d-flex align-items-center">
//               <span style={{ fontSize: "8px", letterSpacing: "2px" }}>
//                 •••• •••• ••••
//               </span>
//               <span
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   marginLeft: "5px",
//                 }}
//               >
//                 {card.last_four_digits}
//               </span>
//             </div>

//             {/* Valid Thru */}
//             <div
//               className="d-flex align-items-center ms-2"
//               style={{ fontSize: "14px", fontWeight: "bold" }}
//             >
//               <div
//                 className="d-flex flex-column text-end"
//                 style={{ lineHeight: "10px", marginTop: "3px" }}
//               >
//                 <span
//                   style={{
//                     fontSize: "10px",
//                     opacity: "0.8",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   VALID
//                 </span>
//                 <span
//                   style={{
//                     fontSize: "10px",
//                     opacity: "0.8",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   THRU
//                 </span>
//               </div>
//               <span
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   marginLeft: "5px",
//                 }}
//               >
//                 {/* {card.exp_month || "--"}/{card.exp_year || "--"} */}
//                 {String(card.exp_month)?.padStart(2, "0") || "--"}/
//                 {String(card.exp_year)?.slice(-2) || "--"}
//               </span>
//             </div>
//           </div>

//           {/* Name */}
//           <p
//             className="mb-0 mt-2"
//             style={{
//               fontSize: "14px",
//               fontWeight: "500",
//               textTransform: "uppercase",
//               position: "relative",
//               zIndex: 1,
//             }}
//           >
//             {card.card_holder_name}
//           </p>

//           {/* Logo */}
//           <img src={card?.brand == "visa" ? visaCard : mastercard}
//             loading="lazy" alt="Visa" width="40"
//             className="position-absolute"
//             style={{ bottom: "auto", right: "0", zIndex: 1 }}
//           />
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };


// const YourBankComponent = ({ bank }) => {
//   return (
//     <div
//       key={bank.id}
//       style={{
//         flex: "0 0 100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Card
//         className="p-2 mb-2 shadow-sm border-0 rounded-3"
//         style={{
//           background: "linear-gradient(135deg, #3A4B4C, #2C3E3E)",
//           color: "#FFF",
//           maxWidth: "350px",
//           width: "100%",
//           position: "relative",
//           borderRadius: "15px",
//           height: "220px",
//         }}
//       >
//         <Card.Body>
//           <img
//             src="images/Host/card-bank-account.svg"
//             loading="lazy" alt="card-bank-account"
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               borderRadius: "15px",
//               objectFit: "cover",
//               zIndex: 0,
//             }}
//           />

//           <div
//             className="d-flex justify-content-between align-items-center"
//             style={{ position: "relative", zIndex: 1 }}
//           >
//             {bank?.default_for_currency && (
//               <Badge
//                 bg="danger"
//                 style={{
//                   top: "10px",
//                   left: "10px",
//                   zIndex: 10,
//                   fontSize: "10px",
//                   padding: "5px 10px",
//                   borderRadius: "8px",
//                 }}
//               >
//                 Primary
//               </Badge>
//             )}

//             <div
//               className="d-flex align-items-center justify-content-end w-100"
//               style={{
//                 position: "relative",
//                 zIndex: "1",
//                 top: "-10px",
//                 right: "-15px",
//               }}
//             >
//               <div className="d-flex align-items-center">
//                 <Dropdown align="end">
//                   <Dropdown.Toggle
//                     variant="link"
//                     className="text-white p-0 border-0 shadow-none d-flex flex-column dropdown-toggle-no-caret"
//                     style={{
//                       fontSize: "8px",
//                       lineHeight: "5px",
//                       display: "flex",
//                       alignItems: "center",
//                       marginLeft: "4px",
//                       textDecoration: "none",
//                     }}
//                   >
//                     <BsThreeDotsVertical size={26} color="white" />
//                   </Dropdown.Toggle>

//                   <Dropdown.Menu className="shadow-sm">
//                     <Dropdown.Item onClick={() => handlePrimary(bank?.id)}>
//                       Primary
//                     </Dropdown.Item>
//                     <Dropdown.Item onClick={() => deleteMethod(bank?.id)}>
//                       Delete
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>

//                 <style>
//                   {` .dropdown-toggle-no-caret::after {
//                                             display: none !important;
//                                           }`}
//                 </style>
//               </div>
//             </div>
//           </div>

//           <div className="mt-1" style={{ position: "relative" }}>
//             <div className="d-flex align-items-center mt-2">
//               <img
//                 src="images/Host/bank-name-icon.svg"
//                 loading="lazy" alt="bank"
//                 style={{
//                   width: "20px",
//                   marginRight: "10px",
//                 }}
//               />
//               <div>
//                 <p
//                   className="mb-0"
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {bank.bank_name}
//                 </p>
//                 <p
//                   className="mb-0"
//                   style={{
//                     fontSize: "12px",
//                     opacity: "0.8",
//                   }}
//                 >
//                   Bank of America
//                 </p>
//               </div>
//             </div>

//             <div className="d-flex align-items-center mt-3">
//               <img
//                 src="images/Host/account-number-icon.svg"
//                 loading="lazy" alt="account"
//                 style={{
//                   width: "20px",
//                   marginRight: "10px",
//                 }}
//               />
//               <div>
//                 <p
//                   className="mb-0"
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Account Number
//                 </p>
//                 <p
//                   className="mb-0"
//                   style={{
//                     fontSize: "14px",
//                     letterSpacing: "2px",
//                   }}
//                 >
//                   **** **** **** <b>{bank.last_four_digits}</b>
//                 </p>
//               </div>
//             </div>

//             <div className="d-flex align-items-center mt-3">
//               <img
//                 src="images/Host/routing-number-icon.svg"
//                 loading="lazy" alt="routing"
//                 style={{
//                   width: "20px",
//                   marginRight: "10px",
//                 }}
//               />
//               <div>
//                 <p
//                   className="mb-0"
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Routing Number
//                 </p>
//                 <p
//                   className="mb-0"
//                   style={{
//                     fontSize: "14px",
//                     letterSpacing: "2px",
//                   }}
//                 >
//                   xxxxxxx<b>6789</b>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };
