import { useEffect, useState } from "react";
import { KEYS } from "../config/Constant";
import Home from "./guestPage/Home";
import HomeHost from "./hostPage/HomeHost";

function RootHome() {
  const [userType, setUserType] = useState("guest");

  useEffect(() => {
    const storedUserType = localStorage.getItem(KEYS.USER_TYPE);
    if (!storedUserType) {
      localStorage.setItem(KEYS.USER_TYPE, "guest");
      setUserType("guest");
    } else {
      setUserType(storedUserType);
    }
  }, []);

  return <>{userType === "guest" ? <Home /> : <HomeHost />}</>;
}

export default RootHome;