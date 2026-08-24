import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { KEYS } from "../config/Constant";
import { setLoginModal } from "../store/slices/userSlice";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(({ user }) => user);

  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const isLoggedIn = !!userData?.user_id || userInfo?.user_id;

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(setLoginModal(true));
    }
  }, [isLoggedIn, dispatch]);

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
