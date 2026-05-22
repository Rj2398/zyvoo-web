import React from "react";
import Header from "../../../components/guest/Header";
import Footer from "../../../components/guest/Footer";
import { Link } from "react-router-dom";
import AuthModal from "../../../components/guest/authModal";

const BlogArtical = () => {
  return (
    <div>
      {/* <Header /> */}

      <main>
        {/* MOBILE */}
        <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <Link to="/help-center">
                      <i className="fa-regular fa-arrow-left"></i>
                    </Link>
                    <form action="">
                      <label>
                        <input type="text" placeholder="Search..." />
                        <button type="submit">
                          <i className="fa-regular fa-magnifying-glass"></i>
                        </button>
                      </label>
                    </form>
                  </div>
                  <div className="mob-filter-in">
                    <Link to="/mob-filter">
                      <img
                        src="/images/mobile/filters/filter.svg"
                        loading="lazy" alt="Filter"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXPLORE-GUIDES-ARTICLES-PAGE */}
        <div className="explore-guides-articles-wrap">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="explore-guides-articles-in">
                  <h1>Explore Articles</h1>
                  <hr />
                  <h2>Our new articles</h2>
                </div>
              </div>
            </div>

            <div className="row explore-guides-articles-inner">
              {[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4].map((num, index) => (
                <div className="col-lg-3 col-md-6" key={index}>
                  <div className="explore-guides-articles-in">
                    <Link to="/articles-detail">
                      <div className="explore-guides-articles-image">
                        <img
                          src={`/images/help-center/guides/${num}.png`}
                          loading="lazy" alt="Article Thumbnail"
                        />
                      </div>
                      <h3>Articles Topic Title</h3>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum is simply dummy text
                        of the printing and typesetting industry.
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="explore-guides-articles-wrap-btn">
              <Link to="/contactUs">Contact Us</Link>
            </div>
          </div>
        </div>
      </main>
      <AuthModal />
      {/* <Footer /> */}
    </div>
  );
};

export default BlogArtical;
