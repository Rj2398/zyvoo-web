import React from "react";
import Header from "../../components/guest/Header";
import Footer from "../../components/guest/Footer";
import AuthModal from "../../components/guest/authModal";
import { useDispatch } from "react-redux";
import { setUserType } from "../../store/slices/userSlice";
import { imageBase, KEYS } from "../../config/Constant";
import useCommon from "../../hooks/useCommon";
import { Link } from "react-router-dom";

function Notifications() {
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  const userId = userData?.user_id;

  const dispatch = useDispatch();
  const { guestNotifications } = useCommon();

  const [useTypes, setUserTypes] = useState(
    localStorage.getItem(KEYS.USER_TYPE) || "guest"
  );
  const [notificationlist, setNotificationlist] = useState([]);

  dispatch(setUserType(useTypes));

  const sendNotification = async (e) => {
    if (e) e.preventDefault(); // Prevent default if event exists

    if (!userId) {
      // console.error("User ID not found");
      return;
    }

    try {
      const res = await guestNotifications({
        user_id: userId,
      });

      setNotificationlist(res);
      // console.log("notication sent:", res);
    } catch (error) {
      // console.error("Error submitting feedback:", error);
    }
  };
  return (
    <>
      <Header />

      {/* notification
       */}

      <main>
        {/* MOBILE */}
        {/* <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <Link to="/profile">
                      <i className="fa-regular fa-arrow-left"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* MOBILE */}

        <div className="notifications-wrap">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="notifications-in">
                  <h2>Notifications</h2>
                  {noti.map((notification, index) => (
                    <div className="notificaton-strip" key={index}>
                      <div className="notificaton-in">
                        <div className="notificaton-icon">
                          <img
                            src={imageBase + `/images/notifications.svg`}
                            alt=""
                          />
                        </div>
                        <div className="notificaton-content">
                          <h6>{notification}</h6>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                          </p>
                        </div>
                        <button type="button" className="notification-cross">
                          <i className="fa-regular fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AuthModal />
      <Footer />
    </>
  );
}

export default Notifications;
