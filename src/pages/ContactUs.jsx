import Footer from "../components/guest/Footer";
import Header from "../components/guest/Header";

const ContactUs = () => {
  return (
    <>
      <Header />
      <div className="faq-wrap">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="faq-heading">
                <h1>Contact Us</h1>
              </div>
              <div className="faq-in">
                <div className="faq-top mb-4">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the <br />{" "}
                    industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="contact-help">
                <h2>Help & Contact</h2>
                <div className="contact-help-in">
                  <h3>Contact Us</h3>
                  <form action="">
                    <input type="text" placeholder="Your Name" />
                    <input type="text" placeholder="Your Email" />
                    <label>Message</label>
                    <textarea></textarea>
                    <div className="captha">
                      <img src="/images/captcha.svg" loading="lazy" alt="" />
                    </div>
                    <input type="submit" value="Submit" />
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6" style={{ width: "20%" }}>
              <div className="contact-support">
                <h2>Customer Support</h2>
                <p>Our Customer Service Team are also available On.</p>
                <div className="contact-support-in">
                  <div className="icon">
                    <img src="/images/contact-page/call.svg" loading="lazy" alt="" />
                  </div>
                  <h3>
                    Contact Number <br />{" "}
                    <span>
                      <a href="">+1(000) 000-0000</a>
                    </span>
                  </h3>
                </div>
                <div className="contact-support-in">
                  <div className="icon">
                    <img src="/images/contact-page/mail.svg" loading="lazy" alt="" />
                  </div>
                  <h3>
                    Email Address <br />
                    <span>
                      <a href="">info@yourdomain.com</a>
                    </span>{" "}
                    <br />
                    <span>
                      <a href="">info@yourdomain.com</a>
                    </span>
                  </h3>
                </div>
                <div className="contact-support-in">
                  <div className="icon">
                    <img src="/images/contact-page/location.svg" loading="lazy" alt="" />
                  </div>
                  <h3>
                    Location <br />
                    <span>Atlanta, GA, USA'</span>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="contact-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2261.139268703457!2d-133.14340392403935!3d55.4776704131501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x540e467f9dd315f3%3A0xf4eae0d4d7764524!2s245%20Cold%20Storage%20Rd%2C%20Craig%2C%20AK%2099921%2C%20USA!5e0!3m2!1sen!2sin!4v1723457458145!5m2!1sen!2sin"
                  width="600"
                  height="450"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default ContactUs;
