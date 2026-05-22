import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";

import store from "./store";
import Routers from "./router/Routers";
import Loader2 from "./components/Loader2";
import InlineInquiry from "./components/guest/personaIdentityVerification";
import RouteChangeHandler from "./components/RouteChangeHandler"; // step 2

const queryClient = new QueryClient();

const ScrollToTop = React.memo(() => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
});

const AppComponent = () => {
  const isLoading = useSelector((state) => state.loading.showLoader);

  return (
    <Router>
      <ScrollToTop />
      <RouteChangeHandler />
      <Loader2 visible={isLoading} />
      <Routers />
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppComponent />
        <InlineInquiry />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;