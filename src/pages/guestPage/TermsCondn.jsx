import useContent from "../../hooks/useContent";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const TermsCondn = () => {
  const { TermConditionData, isLoading } = useContent();

    const [isMobileWidth,setIsMobileWidth]=useState(false)
    
    useEffect(() => {
      const checkWindowWidth = () => {
        setIsMobileWidth(window.innerWidth <= 768);
      };
   
      checkWindowWidth(); // run on mount
      window.addEventListener('resize', checkWindowWidth);
   
      return () => window.removeEventListener('resize', checkWindowWidth);
    }, []);

    
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  formatDate(TermConditionData?.last_update_at);

  return (
    <>
      {/* <!-- MOBILE --> */}
      <div className="mob-search-filter border-start-0 border-end-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mob-search-filter-in">
                <div className="mob-search-bar-back">
                  <Link to="/profile" style={{ padding:"0"}}>
                    <i className="fa-regular fa-arrow-left"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main style={{ display: "flex" }} >
        <Loader visible={isLoading} />
        <div className="privacy-terms-wrap" style={{ }}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="privacy-terms-heading" style={{marginTop:'10px !important'}}>
                  <h1> {isMobileWidth ?"Terms and Condition": "Terms of Services"}</h1>
                  <p>
                    Last Updated {formatDate(TermConditionData?.last_update_at)}
                  </p>
                </div>
              </div>
              <div className="col-lg-8 col-md-6">
                <div className="privacy-terms-in">
                  <div className="privacy-terms-top" style={{marginBottom:'10px !important'}}>
                    
               
                    <h2 className="intro">1.Introduction</h2>
               
                      <div className="dangerous para" 
                        dangerouslySetInnerHTML={{ __html: TermConditionData?.text, }}
                      />

                      <style>
                        {`.dangerous p{
                             color:grey !important;
                          }
                        `}
                      </style>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TermsCondn;