import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Switch, Route, useLocation } from "react-router-dom";
import "./App.css";
import Couponbar from "./Layout/Components/Couponbar/Couponbar";
import Navbar from "./Layout/Components/Navbar/Navbar";
import MiniNav from "./Layout/Components/MiniNav/MiniNav";
import Home from "./Layout/Pages/Home/Home";
import Footer from "./Layout/Components/Footer/Footer";
import Dashboard from "./Layout/Pages/Dashboard/Dashboard";
import CategoryList from "./Layout/Pages/Categories/CategoryList.page";
import ProductList from "./Layout/Pages/Products/ProductList/ProductList.page";
import ProductDesc from "./Layout/Pages/Products/ProductDescription/ProductDescription.page";
import ComingSoon from "./Layout/Components/ComingSoon/ComingSoon.component";
import NotFound from "./Layout/Pages/NotFound/NotFound.page";
import Checkout from "./Layout/Pages/Checkout/Checkout";
import Order from "./Layout/Pages/Order/order";
import Viewall from "./Layout/Pages/ViewAll/Viewall";
import NewArrival from "./Layout/Pages/NewArrival/NewArrival";
import Loader from "./Layout/Components/Loader/Loader";

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <Couponbar />
      <Navbar />
      <MiniNav />
      <AnimatePresence>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/" component={Home} />
          <Route exact path="/Category/:id" component={CategoryList} />
          <Route exact path="/Category/:id1/:id2" component={ProductList} />
          <Route
            exact
            path="/Category/:id1/:id2/:id3"
            component={ProductDesc}
          />
          <Route exact path="/Dashboard/:id" component={Dashboard} />
          <Route exact path="/ComingSoon" component={ComingSoon} />
          <Route exact path="/NewArrivals" component={NewArrival} />
          <Route
            exact
            path="/Cart/Checkout/coupon::coupon"
            component={Checkout}
          />
          <Route exact path="/Orders/:id" component={Order} />
          <Route exact path="/Products/:id" component={Viewall} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
