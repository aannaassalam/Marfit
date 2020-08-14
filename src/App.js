import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Switch, Route, useLocation } from "react-router-dom";
import "./App.css";
import CouponBar from './layout/components/couponbar/Couponbar';
import Navbar from "./layout/components/navbar/Navbar";
import MiniNav from "./layout/components/miniNav/MiniNav";
import Home from "./layout/pages/home/Home";
import Footer from "./layout/components/footer/Footer";
import Dashboard from "./layout/pages/dashboard/dashboard";
import CategoryList from "./layout/pages/categories/categoryList.page";
import ProductList from "./layout/pages/products/productList/productList.page";
import ProductDesc from "./layout/pages/products/productDescription/productDescription.page";
import ComingSoon from "./layout/components/comingSoon/comingSoon.component";
import NotFound from "./layout/pages/notFound/notFound.page";

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <CouponBar />
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
          <Route exact path="*" component={NotFound} />
        </Switch>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
