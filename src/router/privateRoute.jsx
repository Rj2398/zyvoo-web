import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Constant, { KEYS } from "../config/Constant";
import { setLoginModal, setUserType } from "../store/slices/userSlice";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo } = useSelector(({ user }) => user);

  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const isLoggedIn = !!userData?.user_id || userInfo?.user_id;

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(setLoginModal(true));
    } else {
      const path = location.pathname.toLowerCase();
      const hostRoutes = ["/host-listing", "/payment-host", "/myplaces", "/my-place-history"];
      if (hostRoutes.includes(path)) {
        localStorage.setItem(KEYS.USER_TYPE, "host");
        dispatch(setUserType("host"));
        Constant.selectedFlow = "host";
      }
    }
  }, [isLoggedIn, location.pathname, dispatch]);

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
