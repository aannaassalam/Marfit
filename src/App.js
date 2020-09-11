import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Switch, Route, useLocation } from "react-router-dom";
import "./App.css";
import Couponbar from "./Layout/Components/Couponbar/Couponbar";
import Navbar from "./Layout/Components/Navbar/Navbar";
import MiniNav from "./Layout/Components/MiniNav/MiniNav";
import Home from "./Layout/Pages/Home/Home";
import Footer from "./Layout/Components/Footer/Footer";
import Dashboard from "./Layout/Pages/dashboard/dashboard";
import CategoryList from "./Layout/Pages/categories/categoryList.page";
import ProductList from "./Layout/Pages/products/productList/productList.page";
import ProductDesc from "./Layout/Pages/products/productDescription/productDescription.page";
import ComingSoon from "./Layout/Components/comingSoon/comingSoon.component";
import NotFound from "./Layout/Pages/notFound/notFound.page";
import Checkout from "./Layout/Pages/Checkout/Checkout";

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
          <Route exact path="/Cart/Checkout" component={Checkout} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
