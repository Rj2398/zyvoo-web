import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaChevronDown, FaRegClock } from "react-icons/fa";
import moment from "moment";
import { TimePicker } from "rsuite";

const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(moment({ hour: h, minute: m }).format("hh:mm A"));
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const TimeDropdown = ({ time, onSelect, disable }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        className="d-flex align-items-center justify-content-between "
        style={{
          borderRadius: "50px",
          cursor: "pointer",
          backgroundColor: "#fff",
          border: "1px solid rgb(221, 221, 221)",
          padding: "6px 8px",
          height: "40px",
        }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaRegClock size={22} style={{ fontWeight: "lighter" }} />
        <span style={{ fontSize: "16px", fontWeight: "400", color: "#000" }}>
          {time}
        </span>
        <FaChevronDown size={14} />
      </div>

      {showDropdown && !disable && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: "105%",
            left: 0,
            width: "100%",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {timeOptions.map((t, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelect(t);
                setShowDropdown(false);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f5f5f5")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TimeRangePicker = ({ timeSelected = 2, onChange }) => {
  const [fromTime, setFromTime] = useState("00:00 AM");
  const [toTime, setToTime] = useState("00:00 AM");
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/rsuite.min.css";
    link.id = "rsuite-local-css";
    document.head.appendChild(link);

    return () => {
      const existing = document.getElementById("rsuite-local-css");
      if (existing) existing.remove();
    };
  }, []);

  const handleFromTimeChange = (date) => {
    if (!date) {
      setFromTime("00:00 AM");
      setToTime("00:00 AM");
      if (onChange) onChange({ from: "00:00 AM", to: "00:00 AM" });
      return;
    }

    const formattedFromTime = moment(date).format("hh:mm A");
    const formattedToTime = moment(date)
      .add(timeSelected, "hours")
      .format("hh:mm A");

    setFromTime(formattedFromTime);
    setToTime(formattedToTime);

    if (onChange) onChange({ from: formattedFromTime, to: formattedToTime });
  };

  return (
    <Card className="p-0 border-0 w-auto">
      <Row className="g-3 align-items-center flex-wrap nw-tmpk-wrp">
        <Col className="rsuite-wrapper" style={{ position: "relative" }}>
          <FaRegClock
            size={22}
            style={{
              fontWeight: "lighter",
              position: "absolute",
              left: "18",
              top: "10",
              zIndex: "99999",
            }}
          />
          <TimePicker
            format="hh:mm aa"
            showMeridiem
            value={moment(fromTime, "hh:mm A").toDate()}
            onChange={handleFromTimeChange}
            className="custom-input start-time"
            // cleanable={false}
            //  ElementType={CaretAscaretAs}
            locale="en-US"
            minutesstep={60}
            style={{ zIndex: "100001" }}
          />
          <svg
            size={22}
            style={{
              position: "absolute",
              right: "18",
              top: "15",
              zIndex: "99999",
            }}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="14"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
          </svg>
        </Col>

        <Col>
          <TimeDropdown
            time={toTime == "Invalid date" ? "00:00 AM" : toTime}
            onSelect={setToTime}
            disable={true}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default React.memo(TimeRangePicker);
