// import React from 'react'

// function PaymentGuest() {
//   return (
//     <div>PaymentGuest</div>
//   )
// }

// export default PaymentGuest





import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Form,
  InputGroup,
  Modal,
  Table,
} from "react-bootstrap";
import { FaSearch, FaCreditCard, FaRegBuilding } from "react-icons/fa";
import { ChevronLeft, ChevronRight, X } from "react-feather";

function PaymentGuest() {

//   const [showPaymentModal, setShowPaymentModal] = useState(false);           //now remove make a payment button and their modal
//   const [showDetailsModal, setShowDetailsModal] = useState(false);           //now remove details button and their modal
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Sample payment data (guest perspective)
//   const paymentData = [
//     {
//       id: "#PAY-001",
//       amount: "$150.00",
//       host: "John's Beach House",
//       date: "May 15, 2023",
//       status: "Completed",
//       type: "Booking payment",
//     },
//     {
//       id: "#PAY-002",
//       amount: "$85.50",
//       host: "Mountain Retreat",
//       date: "June 2, 2023",
//       status: "Pending",
//       type: "Security deposit",
//     },
//     {
//       id: "#PAY-003",
//       amount: "$200.00",
//       host: "City Center Apartment",
//       date: "July 10, 2023",
//       status: "Completed",
//       type: "Booking payment",
//     },
//     {
//       id: "#PAY-004",
//       amount: "$65.00",
//       host: "Lakeside Cabin",
//       date: "August 5, 2023",
//       status: "Refunded",
//       type: "Service fee",
//     },
//     {
//       id: "#PAY-005",
//       amount: "$120.00",
//       host: "Desert Villa",
//       date: "September 18, 2023",
//       status: "Failed",
//       type: "Booking payment",
//     },
//   ];


const paymentData = [
    // January
    {
      id: "#PAY-101",
      amount: "$180.00",
      host: "Snowy Mountain Lodge",
      date: "January 5, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "January"
    },
    {
      id: "#PAY-102",
      amount: "$95.00",
      host: "Winter Cabin",
      date: "January 12, 2023",
      status: "Refunded",
      type: "Service fee",
      month: "January"
    },
  
    // February
    {
      id: "#PAY-201",
      amount: "$210.00",
      host: "Romantic Getaway",
      date: "February 14, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "February"
    },
    {
      id: "#PAY-202",
      amount: "$75.00",
      host: "Ski Resort",
      date: "February 22, 2023",
      status: "Pending",
      type: "Security deposit",
      month: "February"
    },
  
    // March
    {
      id: "#PAY-301",
      amount: "$160.00",
      host: "Spring Break Villa",
      date: "March 3, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "March"
    },
    {
      id: "#PAY-302",
      amount: "$45.00",
      host: "Garden Retreat",
      date: "March 18, 2023",
      status: "Failed",
      type: "Service fee",
      month: "March"
    },
  
    // April
    {
      id: "#PAY-401",
      amount: "$190.00",
      host: "Beachfront Condo",
      date: "April 7, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "April"
    },
    {
      id: "#PAY-402",
      amount: "$65.00",
      host: "Countryside Cottage",
      date: "April 15, 2023",
      status: "Pending",
      type: "Security deposit",
      month: "April"
    },
  
    // May (existing)
    {
      id: "#PAY-001",
      amount: "$150.00",
      host: "John's Beach House",
      date: "May 15, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "May"
    },
    {
      id: "#PAY-002",
      amount: "$85.50",
      host: "Mountain Retreat",
      date: "June 2, 2023",
      status: "Pending",
      type: "Security deposit",
      month: "May"
    },
  
    // June
    {
      id: "#PAY-601",
      amount: "$220.00",
      host: "Lakeview Cabin",
      date: "June 10, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "June"
    },
    {
      id: "#PAY-602",
      amount: "$55.00",
      host: "Fishing Cottage",
      date: "June 25, 2023",
      status: "Refunded",
      type: "Service fee",
      month: "June"
    },
  
    // July (existing)
    {
      id: "#PAY-003",
      amount: "$200.00",
      host: "City Center Apartment",
      date: "July 10, 2023",
      status: "Completed",
      type: "Booking payment",
       month: "July"
    },
    {
      id: "#PAY-004",
      amount: "$65.00",
      host: "Lakeside Cabin",
      date: "August 5, 2023",
      status: "Refunded",
      type: "Service fee",
      month: "July"
    },
  
    // August
    {
      id: "#PAY-801",
      amount: "$175.00",
      host: "Summer Villa",
      date: "August 12, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "August"
    },
    {
      id: "#PAY-802",
      amount: "$90.00",
      host: "Poolside House",
      date: "August 20, 2023",
      status: "Pending",
      type: "Security deposit",
      month: "August"
    },
  
    // September (existing)
    {
      id: "#PAY-005",
      amount: "$120.00",
      host: "Desert Villa",
      date: "September 18, 2023",
      status: "Failed",
      type: "Booking payment",
      month: "September"
    },
    {
      id: "#PAY-902",
      amount: "$135.00",
      host: "Vineyard Cottage",
      date: "September 5, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "September"
    },
  
    // October
    {
      id: "#PAY-1001",
      amount: "$155.00",
      host: "Halloween Cabin",
      date: "October 12, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "October"
    },
    {
      id: "#PAY-1002",
      amount: "$70.00",
      host: "Forest Retreat",
      date: "October 30, 2023",
      status: "Pending",
      type: "Security deposit",
      month: "October"
    },
  
    // November
    {
      id: "#PAY-1101",
      amount: "$195.00",
      host: "Thanksgiving House",
      date: "November 15, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "November"
    },
    {
      id: "#PAY-1102",
      amount: "$85.00",
      host: "Autumn Lodge",
      date: "November 22, 2023",
      status: "Refunded",
      type: "Service fee",
      month: "November"
    },
  
    // December
    {
      id: "#PAY-1201",
      amount: "$250.00",
      host: "Christmas Chalet",
      date: "December 10, 2023",
      status: "Completed",
      type: "Booking payment",
      month: "December"
    },
    {
      id: "#PAY-1202",
      amount: "$100.00",
      host: "New Year's Cabin",
      date: "December 28, 2023",
      status: "Pending",
      type: "Security deposit",
      month: "December"    }
  ];


  // Filter data based on status
//   const filteredData = paymentStatus === "All" 
//     ? paymentData 
//     : paymentData.filter(item => item.status === paymentStatus);

    // Filter data based on Month
  const filteredData = selectedMonth === "All" 
    ? paymentData 
    : paymentData.filter(item => item.month === selectedMonth);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container-fluid py-4">
      {/* Payment Summary Card */}
      <Card className="mb-4 shadow-sm">
        {/* <Card.Body className="d-flex justify-content-between align-items-center"> */}
        <Card.Body className="ps-4">
          <div>
            <h5 className="mb-1">Your Payment Summary</h5>
            <p className="text-muted mb-0">Track and manage your payments</p>
          </div>
          {/* <Button 
            variant="primary" 
            onClick={() => setShowPaymentModal(true)}
            style={{ borderRadius: "20px" }}
          >
            Make a Payment
          </Button> */}
        </Card.Body>
      </Card>

      {/* Payment History Section */}
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Payment History</h5>
            {/* <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-status">
                Status: {paymentStatus}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setPaymentStatus("All")}>All</Dropdown.Item>
                <Dropdown.Item onClick={() => setPaymentStatus("Completed")}>Completed</Dropdown.Item>
                <Dropdown.Item onClick={() => setPaymentStatus("Pending")}>Pending</Dropdown.Item>
                <Dropdown.Item onClick={() => setPaymentStatus("Refunded")}>Refunded</Dropdown.Item>
                <Dropdown.Item onClick={() => setPaymentStatus("Failed")}>Failed</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}

<Dropdown>
  <Dropdown.Toggle variant="light">
    {selectedMonth === 'All' ? 'All Months' : selectedMonth}
  </Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item onClick={() => setSelectedMonth('All')}>All Months</Dropdown.Item>
    {['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
      <Dropdown.Item key={month} onClick={() => setSelectedMonth(month)}>
        {month}
      </Dropdown.Item>
    ))}
  </Dropdown.Menu>
</Dropdown>

          </div>

          <div className="table-responsive" style={{padding: "0 20px"}}>
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Host</th>
                  <th>Date</th>
                  <th>Status</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.id}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.host}</td>
                    <td>{payment.date}</td>
                    <td>
                      <Badge 
                        bg={
                          payment.status === "Completed" ? "success" :
                          payment.status === "Pending" ? "warning" :
                          payment.status === "Refunded" ? "info" : "danger"
                        }
                        className="text-capitalize"
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    {/* <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setShowDetailsModal(true)}
                      >
                        Details
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <span className="me-2">Items per page:</span>
              <Dropdown className="d-inline-block">
                <Dropdown.Toggle variant="light" size="sm">
                  {itemsPerPage}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {[5, 10, 20].map(num => (
                    <Dropdown.Item key={num} onClick={() => setItemsPerPage(num)}>
                      {num}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            
            <div className="d-flex align-items-center">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                className="me-2"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline-secondary" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Make Payment Modal */}
      {/* <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Make a Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Payment Amount</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control type="number" placeholder="Enter amount" />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select>
                <option>Select payment method</option>
                <option>Credit/Debit Card</option>
                <option>PayPal</option>
                <option>Bank Transfer</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Host</Form.Label>
              <Form.Select>
                <option>Select host</option>
                <option>John's Beach House</option>
                <option>Mountain Retreat</option>
                <option>City Center Apartment</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Description</Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="Optional" />
            </Form.Group>

            <div className="d-grid gap-2 mt-4">
              <Button variant="primary">Confirm Payment</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal> */}

      {/* Payment Details Modal */}
      {/* <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6>Transaction Information</h6>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Payment ID:</span>
              <span>#PAY-001</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Amount:</span>
              <span>$150.00</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Date:</span>
              <span>May 15, 2023</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Status:</span>
              <Badge bg="success">Completed</Badge>
            </div>
          </div>

          <div className="mb-3">
            <h6>Host Information</h6>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Host Name:</span>
              <span>John's Beach House</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Property:</span>
              <span>Beachfront Villa</span>
            </div>
          </div>

          <div className="mb-3">
            <h6>Payment Method</h6>
            <div className="d-flex align-items-center">
              <FaCreditCard className="me-2" size={20} />
              <span>VISA ending in 4242</span>
            </div>
          </div>

          <div className="d-grid gap-2 mt-4">
            <Button variant="outline-primary">Download Receipt</Button>
            {paymentStatus === "Pending" && (
              <Button variant="danger">Cancel Payment</Button>
            )}
          </div>
        </Modal.Body>
      </Modal> */}
    </div>
  );
}

export default PaymentGuest;