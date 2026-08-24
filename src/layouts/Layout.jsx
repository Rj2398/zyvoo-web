import React, { memo, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Constant, { KEYS } from "../config/Constant";
import HeaderGuest from "../components/guest/Header";
import HeaderHost from "../components/host/Header";
import Footer from "../components/guest/Footer";
import Header from "../components/guest/Header";
import { useDispatch, useSelector } from "react-redux";
import { setUserType } from "../store/slices/userSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo, userType: reduxUserType } = useSelector(({ user }) => user);

  // const localSaved = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  const localSaved =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));

  const login_id = userInfo?.user_id
    ? String(userInfo?.user_id)
    : null || localSaved?.user_id
    ? String(localSaved?.user_id)
    : null;

  const userType = useMemo(() => {
    const path = location.pathname.toLowerCase();
    const hostRoutes = ["/host-listing", "/payment-host", "/myplaces", "/my-place-history"];
    if (login_id && hostRoutes.includes(path)) {
      localStorage.setItem(KEYS.USER_TYPE, "host");
      Constant.selectedFlow = "host";
      return "host";
    }
    return localStorage.getItem(KEYS.USER_TYPE) || reduxUserType || "guest";
  }, [login_id, location.pathname, reduxUserType]);

  useEffect(() => {
    if (userType === "host") {
      dispatch(setUserType("host"));
    }
  }, [userType, dispatch]);

  // ✅ Choose header based on user type
  const HeaderComponent = userType === "host" ? HeaderHost : HeaderGuest;

  return (
    <>
      {!login_id ? <Header /> : <HeaderComponent />}
      <main>{children}</main>
      <div style={{ marginBottom: "80px" }} />
      <Footer />
    </>
  );
};

// ✅ Memoize to prevent unnecessary re-renders
export default memo(Layout);

// import { KEYS } from "../config/Constant";
// import HeaderGuest from "../components/guest/Header";
// import HeaderHost from "../components/host/Header";
// import Footer from "../components/guest/Footer";

// const Layout = ({ children }) => {
//   const useTypes = localStorage.getItem(KEYS.USER_TYPE)
//   return (
//     <>
//       {useTypes === "guest" ? <HeaderGuest /> : <HeaderHost />}
//       {children}
//       <div style={{marginBottom:"80px"}}></div>
//       <Footer />
//     </>
//   );
// };

// export default Layout;
