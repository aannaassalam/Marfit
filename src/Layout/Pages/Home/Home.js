import React from "react";
import Banner from "./Sections/Banner/Banner";
import FeatureItems from "./Sections/FeatureItems/FeatureItems";
import Slider from "./Sections/Slider/Slider";
import Slider2 from "./Sections/Slider2/Slider2";
import Add from "./Sections/Add/Add";
import About from "./Sections/About/About";
import Testimonials from "./Sections/Testimonials/Testimonials";
import "./Home.css";

export default class Home extends React.Component {
  render() {
    return (
      <div className="main">
        <Banner />
        <FeatureItems />
        <Slider />
        <Add />
        <Slider2 />
        <About />
        <Slider />
        <Add />
        <Slider />
        <Slider />
        <Slider />
      </div>
    );
  }
}
