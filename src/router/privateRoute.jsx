import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { KEYS } from "../config/Constant";

const PrivateRoute = ({ children }) => {
  const {userInfo} = useSelector(({user})=>user)
  

  // const userData = JSON.parse(localStorage.getItem("USER_INFO"));
  const userData= JSON.parse(localStorage.getItem(KEYS.USER_INFO))  || JSON.parse(sessionStorage.getItem(KEYS.USER_INFO))
  const isLoggedIn = !!userData?.user_id|| userInfo?.user_id;

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && !hasShownToast.current) {
      toast.error("Please Login...");
      hasShownToast.current = true;
    }
  }, [isLoggedIn]);

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
