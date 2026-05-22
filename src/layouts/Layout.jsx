import React, { memo, useMemo } from "react";
import { KEYS } from "../config/Constant";
import HeaderGuest from "../components/guest/Header";
import HeaderHost from "../components/host/Header";
import Footer from "../components/guest/Footer";
import HomeHeader from "../components/guest/HomeHeader";
import Header from "../components/guest/Header";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
      const {userInfo} = useSelector(({user})=>user)

  // const localSaved = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  const localSaved = JSON.parse(localStorage.getItem(KEYS.USER_INFO))  || JSON.parse(sessionStorage.getItem(KEYS.USER_INFO))
  
  const login_id = userInfo?.user_id ? String(userInfo?.user_id) : null||localSaved?.user_id ? String(localSaved?.user_id) : null;
  // ✅ Read once and memoize for performance (avoids repeated localStorage access)
  const userType = useMemo(() => localStorage.getItem(KEYS.USER_TYPE), []);

  // ✅ Choose header based on user type
  const HeaderComponent = userType === "guest" ? HeaderGuest : HeaderHost;

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
