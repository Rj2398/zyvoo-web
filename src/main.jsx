import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { ToastContainer } from "react-toastify";

const App = lazy(() => import("./App"));

const root = ReactDOM.createRoot(document.getElementById("root"));

const LoadingFallback = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#ffffff",}} >
    <img src="/images/logo.svg" alt="Logo" loading="lazy" width="120" height="120" style={{ opacity: 0.8 }} />
  </div>
);

root.render(
  <>
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>

    <ToastContainer
      position="top-right"
      autoClose={2000}
      style={{ zIndex: 999999 }}
    />
  </>
);


// import ReactDOM from "react-dom/client";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./index.css";
// import App from "./App";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { ToastContainer } from "react-toastify";
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <>
//     <App />
//     <ToastContainer
//       position="top-right"
//       autoClose={2000}
//       style={{ zIndex: 999999 }}
//       // limit={1}
//     />
//   </>
// );
