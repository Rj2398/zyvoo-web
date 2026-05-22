import AuthModal from "../../../components/guest/authModal";

const WhyUs = () => {
  return (
    <>
      <main>
        {/* <!-- MOBILE --> */}
        <div className="about-wrap">
          <div className="container-fluid px-5">
            <div className="row">
              <div className="col-lg-12">
                <div className="about-heading">
                  <h1>Meet Zyvo</h1>
                  <p>The Leading Platform for hourly rentals</p>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="about-welcome">
                  <div className="about-welcome-in">
                    <h2>Welcome to Zyvo</h2>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </p>
                  </div>
                  <div className="about-welcome-image">
                    <img src="/images/about-page/welcome.svg" loading="lazy" alt="welcome" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="bg-light">
                <div className="col-lg-12">
                  <div className="about-mission-wrap">
                    <div className="about-mission-in">
                      <h2>Our Mission</h2>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                        It was popularised in the 1960s with the release of
                        Letraset sheets containing Lorem Ipsum passages, and
                        more recently with desktop publishing software like
                        Aldus PageMaker including versions of Lorem Ipsum.
                      </p>
                    </div>
                    <div className="about-mission-image">
                      <img src="/images/about-page/mission.svg" loading="lazy" alt="about-mission-image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid px-5">
            <div className="row">
              <div className="bg-white pt-3 pb-3 px-5">
                <div className="col-lg-12">
                  <div className="about-vision">
                    <h2>Vision</h2>
                    <hr />
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 mb-4">
                <div className="about-bottom">
                  <div className="about-bottom-in px-4">
                    <h3>A World of Possibilities</h3>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </p>
                  </div>
                  <div className="about-bottom-image">
                    <img src="/images/about-page/possibilities.svg" loading="lazy" alt="about-bottom-image" />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 mt-4">
                <div className="about-bottom">
                  <div className="about-bottom-image about-flexibility p-0">
                    <img src="/images/about-page/flexibility.svg" loading="lazy" alt="about-flexibility" />
                  </div>
                  <div className="about-bottom-in px-5">
                    <h3>Flexibility Your Way</h3>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AuthModal />
    </>
  );
};

export default WhyUs;