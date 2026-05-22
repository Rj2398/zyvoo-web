import { Routes, Route } from "react-router-dom";
import Home from "../pages/guestPage/Home";
import AboutUs from "../pages/guestPage/publicPage/AboutUs";
import ContactUs from "../pages/guestPage/publicPage/ContactUs";
import WhyUs from "../pages/guestPage/publicPage/WhyUs";
import Faq from "../pages/guestPage/publicPage/Faq";
import ArticalDetails from "../pages/guestPage/publicPage/ArticalDetails";
import CreateProfile from "../pages/guestPage/CreateProfile";
import Notifications from "../pages/Notifications";
import HelpCenter from "../pages/HelpCenter";
import Profile from "../pages/guestPage/Profile";
import WishList from "../pages/guestPage/WishList";
import WishListDetails from "../pages/guestPage/WishListDetails";
import HostListing from "../pages/guestPage/HostListing";
import Location from "../pages/guestPage/Location";
import MyPlaces from "../pages/hostPage/MyPlacesHost";
import BookingHost from "../pages/hostPage/BookingHost";
import HostChat from "../pages/hostPage/HostChat";
import PaymentHost from "../pages/hostPage/PaymentHost";
import TermsCondn from "../pages/guestPage/TermsCondn";
import PrivacyPolicy from "../pages/guestPage/PrivacyPolicy";
import RootHome from "../pages/RootHome";
import HomeHost from "../pages/hostPage/HomeHost";
import ExploreGuides from "../pages/ExploreGuides";
import ExploreArticles from "../pages/ExploreArticles";
import CheckoutPage from "../pages/guestPage/CheckoutPage";
import Checkout from "../components/guest/Checkout";
import BookingDetails from "../pages/guestPage/BookingDetails";
import BookingExtendedTime from "../components/guest/BookingExtedndeTime";
import GuideDetails from "../pages/guestPage/publicPage/GuideDetails";
import Sorry from "../components/NoResultsFound";
import Feedback from "../pages/Feedback";
import MyPlaceHistory from "../pages/hostPage/MyPlaceHistory";
import Layout from "../layouts/Layout";
import PrivateRoute from "./privateRoute";
import MobSearch from "../components/MobSearch";
import MultipleMarkerMap from "../components/guest/MultipleMarkerMap";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<RootHome />} />
      <Route path="/homeGuest" element={<Home />} />
      <Route path="/multi-marker" element={<MultipleMarkerMap />} />
      <Route path="/homeHost" element={<HomeHost />} />
      <Route path="/aboutUs" element={ <Layout> <AboutUs /> </Layout> } />
      <Route path="/faq" element={ <Layout> <Faq /> </Layout> } />
      <Route path="/whyus" element={ <Layout> <WhyUs /> </Layout> } />
      <Route path="/contactUs" element={ <Layout> <ContactUs /> </Layout> } />
      <Route path="/exploreArticles" element={ <Layout> <ExploreArticles /> </Layout> } />
      <Route path="/articles-detail/:id" element={ <Layout> <ArticalDetails /> </Layout> } />
      <Route path="/create-profile" element={ <Layout> <CreateProfile /> </Layout> } />
      <Route path="/notifications" element={ <Layout> <Notifications /> </Layout> } />
      <Route path="/helpCenter" element={ <Layout> <HelpCenter /> </Layout> } />
      <Route path="/explore-guides" element={ <Layout> <ExploreGuides /> </Layout> } />
      <Route path="/guide-detail/:id" element={ <Layout> <GuideDetails /> </Layout> } />

      <Route path="/exploreArticles" element={ <PrivateRoute> <Layout> <ExploreArticles /> </Layout> </PrivateRoute> } />
      <Route path="/profile" element={ <PrivateRoute> <Layout> <Profile /> </Layout> </PrivateRoute> } />
      <Route path="/WishList" element={ <PrivateRoute> <Layout> <WishList /> </Layout> </PrivateRoute> } />
      <Route path="/wishlistDetails" element={ <PrivateRoute> <Layout> <WishListDetails /> </Layout> </PrivateRoute> } />

      <Route path="/host-listing" element={ <PrivateRoute> <Layout> <HostListing /> </Layout></PrivateRoute> } />
      <Route path="/location/:id" element={ <Layout> <Location /> </Layout> } />
      <Route path="/myplaces" element={<MyPlaces />} />

      <Route path="/payment-host" element={ <PrivateRoute> <Layout> <PaymentHost /> </Layout> </PrivateRoute> } />
      {/* <Route path="/payment-host" element={  <Layout> <PaymentHost /> </Layout>  } /> */}
      <Route path="/booking" element={ <PrivateRoute> <Layout> <BookingHost /> </Layout> </PrivateRoute> } />
      <Route path="/chat" element={ <PrivateRoute> <Layout> <HostChat /> </Layout> </PrivateRoute> } />
      <Route path="/privacy-policy" element={ <Layout> <PrivacyPolicy /> </Layout> } /> 
      <Route path="/terms-condition" element={ <Layout> <TermsCondn /> </Layout> } /> 
      <Route path="/checkoutPage" element={ <PrivateRoute> <Layout> <CheckoutPage /> </Layout> </PrivateRoute> } />
      <Route path="/checkout" element={ <PrivateRoute> <Layout> <Checkout /> </Layout> </PrivateRoute> } />
      <Route path="/booking-details" element={ <PrivateRoute> <Layout> <BookingDetails /> </Layout> </PrivateRoute> } />
      <Route path="/booking-extended-time" element={ <PrivateRoute> <Layout> <BookingExtendedTime /> </Layout> </PrivateRoute> } />
      <Route path="/feedback" element={ <PrivateRoute> <Layout> <Feedback /> </Layout> </PrivateRoute> } />
      <Route path="/my-place-history" element={ <PrivateRoute> <Layout> <MyPlaceHistory /> </Layout> </PrivateRoute> } />
      {/* <Route path="/my-place-history" element={  <Layout> <MyPlaceHistory /> </Layout>  } /> */}
      <Route path="*" element={ <Layout> <Sorry /> </Layout>  } />
    </Routes>
  );
};

export default Routers;
