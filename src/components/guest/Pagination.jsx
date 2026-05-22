import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronLeft, ChevronRight } from "react-feather";
import { Button } from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; 

  const pageNumbers = [...Array(totalPages)].map((_, index) => index + 1);
  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber); 
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPageChange(pageNumber)
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Button
          variant="outline-success"
          className="mx-1 rounded-circle"
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            border: "1px solid #3A4B4C",
            color: "#3A4B4C",
            background: "#fff",
            padding: "0"
          }}
    
          onMouseOut={(e) => (e.target.style.background = "white")}
        >
          <ChevronLeft size={22} />
        </Button>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((number) => (
        <Button
          key={number}
          variant={currentPage === number ? "success" : "outline-success"}
          className="mx-2 rounded-circle"
          onClick={() => handlePageChange(number)}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 400,
            fontSize: "16px",
            background: currentPage === number ? "#3A4B4C" : "white",
            color: currentPage === number ? "white" : "#3A4B4C",
            border: "1px solid #3A4B4C",
            gap:'10px'
          }}
          onMouseOver={(e) =>
            (e.target.style.background = "linear-gradient(135deg, #3A4B4C, #3A4B4C)", e.target.style.color = "white")
          }
          onMouseOut={(e) =>
          (e.target.style.background = currentPage === number ? "linear-gradient(135deg, #3A4B4C, #3A4B4C)" : "white",
            e.target.style.color = currentPage === number ? "white" : "#16A085")
          }
        >
          {number}
        </Button>
      ))}

      {/* Next Button */}
      {currentPage < totalPages && (
        <Button
          variant="outline-success"
          className="mx-1 rounded-circle"
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            border: "1px solid #3A4B4C",
            color: "#3A4B4C",
            background: "#fff",
            padding: "0"
          }}
       
          onMouseOut={(e) => (e.target.style.background = "white")}
        >
          <ChevronRight size={22} />
        </Button>
      )}
    </div>
  );
};

export default React.memo(Pagination);
