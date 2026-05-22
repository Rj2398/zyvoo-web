import Header from "../../components/host/Header";
import Footer from "../../components/guest/Footer";
import MyPlaces from "./MyPlacesHost";

const HomeHost = () => {
  return (
    <div>
      <Header />
      <MyPlaces />
      <Footer />
    </div>
  );
};

export default HomeHost;
