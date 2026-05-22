import { Modal } from "react-bootstrap";
import { 
    FacebookShareButton, FacebookIcon, 
    WhatsappShareButton, WhatsappIcon, 
    LinkedinShareButton, LinkedinIcon, 
    EmailShareButton, EmailIcon,
    TwitterShareButton, TwitterIcon,
    InstapaperShareButton, InstapaperIcon 
} from "react-share";

const LocationShareModal = ({ show, handleClose, url }) => {
    const shareOptions = [
        { component: WhatsappShareButton, icon: WhatsappIcon, label: "WhatsApp", color: "#25D366" },
        { component: FacebookShareButton, icon: FacebookIcon, label: "Facebook", color: "#1877F2" },
        { component: EmailShareButton, icon: EmailIcon, label: "Email", color: "#D44638" },
        { component: TwitterShareButton, icon: TwitterIcon, label: "X", color: "#000000" },
        { component: InstapaperShareButton, icon: InstapaperIcon, label: "Instagram", color: "#E4405F" },
        { component: LinkedinShareButton, icon: LinkedinIcon, label: "LinkedIn", color: "#0077B5" }
    ];

    return (
        <Modal show={show} onHide={handleClose} centered>
            <div 
                style={{
                    background: "white",
                    padding: "40px",
                    borderRadius: "20px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                    width: "100%",
                    maxWidth: "100%",
                    textAlign: "center",
                    position: "relative"
                }}
            >
                {/* Close Button */}
                <button 
                    onClick={handleClose} 
                    style={{
                        position: "absolute",
                        top: "12px",
                        right: "15px",
                        background: "none",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                        color: "#7d5bbe",
                        fontWeight: "bold"
                    }}
                >
                    ✖
                </button>

                {/* Title */}
                <h5 style={{ marginBottom: "50px", fontWeight: "bold" }}>Share with friends</h5>

                {/* Share Buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", justifyItems: "center" }}>
                    {shareOptions.map(({ component: ShareComponent, icon: Icon, label, color }, index) => (
                        <div key={index} style={{ textAlign: "center" }}>
                            <ShareComponent url={url}>
                                <div 
                                    style={{ 
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        boxShadow: `0px 0px 10px ${color}80`, // Soft glow effect
                                        transition: "transform 0.3s, box-shadow 0.3s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0px 0px 25px ${color}`}
                                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0px 0px 20px ${color}80`}
                                >
                                    <Icon size={50} round />
                                </div>
                            </ShareComponent>
                            <p style={{ fontSize: "14px", marginTop: "5px" }}>{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default LocationShareModal;
