const Sorry = () => {
  return (
    <div>
      <div className="nav-wrap">
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img
                src="/assets/images/logo.svg"
                loading="lazy" alt="logo"
              />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <div className="nav-inner">
                <div className="nav-inner-right ms-auto">
                  <div className="nav-chat-time-wish">
                    <div className="nav-chat-time-wish-in">
                      <span>2</span>
                      <a href="bookings.html">
                        <img
                          src="/assets/images/nav-section/bookings.svg"
                          loading="lazy" alt="booking"
                        />
                      </a>
                    </div>
                    <div className="nav-chat-time-wish-in">
                      <span>2</span>
                      <a href="">
                        <img
                          src="/assets/images/nav-section/chat.svg"
                          loading="lazy" alt="chat"
                        />
                      </a>
                    </div>
                    <div className="nav-chat-time-wish-in">
                      <a href="wishlist.html">
                        <img
                          src="/assets/images/nav-section/wishlist.svg"
                          loading="lazy" alt="wishlist"
                        />
                      </a>
                    </div>
                    <div className="nav-account-in">
                      <div className="nav-account-in-profile">
                        <img
                          src="/assets/images/nav-section/user-profile1.png"
                          loading="lazy" alt="user-profile"
                        />
                      </div>
                      <div className="nav-account-in-list">
                        <form action="">
                          <button type="submit">Switch to Host</button>
                        </form>
                        <a href="">Payment History</a>
                        <a
                          href="#"
                          data-bs-target="#language-popup"
                          data-bs-toggle="modal"
                        >
                          Language
                        </a>
                        <a href="notifications.html">Notifications</a>
                        <a href="help-center.html">Help Center</a>
                        <a href="/">Settings</a>
                        <a href="about-us.html">About Us</a>
                        <a
                          href="#"
                          data-bs-target="#logout-popup"
                          data-bs-toggle="modal"
                        >
                          Logout
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sorry;
