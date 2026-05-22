import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoader } from "../store/slices/LoadingSlice";

const RouteChangeHandler = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoader(true));
    const timeout = setTimeout(() => {
      dispatch(setLoader(false));
    }, 600); // simulate loading

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return null;
};

export default RouteChangeHandler;
