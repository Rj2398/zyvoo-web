import React from "react";
import { toast } from "react-toastify";

const ShareModal = ({ onClose }) => {
  const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const popupStyle = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "20px 20px",
    width: "400px",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
    position: "relative",
    textAlign: "center",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "15px",
    cursor: "pointer",
    backgroundColor: "black",
    color: "white",
    height: "30px",
    width: "30px",
    borderRadius: "50%",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "25px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    justifyItems: "center",
  };

  const iconStyle = {
    width: "60px",
    height: "60px",
    backgroundColor: "#f3f4f6",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "8px",
  };

  const labelStyle = {
    fontSize: "12px",
    color: "#333",
  };

  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);

  const icons = [
    {
      label: "Copy Link",
      logo: "/images/popups/share/1.svg",
      url: "#",
    },
    {
      label: "WhatsApp",
      logo: "/images/popups/share/2.svg",
      url: `https://wa.me/?text=${encodedUrl}`,
    },
    {
      label: "Facebook",
      logo: "/images/popups/share/3.svg",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Email",
      logo: "/images/popups/share/4.svg",
      // url: `mailto:?subject=Check this out&body=${encodedUrl}`,
      url: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
      "Check this out"
    )}&body=${encodedUrl}`,
    },
    {
      label: "X",
      logo: "/images/popups/share/5.svg",
      url: `https://x.com/intent/tweet?url=${encodedUrl}`,
    },
    {
      label: "Instagram",
      logo: "/images/popups/share/6.svg",
      url: "https://www.instagram.com/",
    },
    {
      label: "LinkedIn",
      logo: "/images/popups/share/7.svg",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Message",
      logo: "/images/popups/share/8.svg",
      url: `sms:?body=${encodedUrl}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={popupStyle}>
        {/* <button style={closeButtonStyle} onClick={onClose}>
          ✕
        </button> */}

        <button
          style={{
            ...closeButtonStyle,
            fontSize: "10px",
            backgroundColor: "#3A4B4C",
            height: "18px",
            width: "18px",
          }}
          onClick={onClose}>
          ✕
        </button>
        <div style={titleStyle}>Share with friends</div>
        <div style={gridStyle}>
          {icons.map((item, idx) => (
            <a key={idx} target="_blank" rel="noopener noreferrer"
              href={item.label === "Copy Link" ? "#" : item.url} onClick={(e) => {
                if (item.label === "Copy Link") {
                  e.preventDefault();
                  handleCopyLink();
                }
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div style={iconStyle}>
                  <img
                    src={item.logo}
                    alt={item.label}
                    style={{ width: "35px", height: "auto" }}
                  />
                </div>
                <div style={labelStyle}>{item.label}</div>
              </div>
            </a>
            
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
