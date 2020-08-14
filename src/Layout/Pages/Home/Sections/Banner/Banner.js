import React from "react";
import banner from "../../../../../assets/Banner.jpg";
import "./Banner.css";
import IndicatorDots from "./Carousel-indicators/indicator-dots";
import Carousel from "re-carousel";

export default class Banner extends React.Component {
  render() {
    return (
      <div className="panel-container">
        <div className="panel">
          <Carousel auto loop interval={5000} widgets={[IndicatorDots]}>
            <div className="cont">
              <img src={banner} style={{ width: "100%", height: "100%" }} />
            </div>
            <div className="cont">
              <img src={banner} style={{ width: "100%", height: "100%" }} />
            </div>
            <div className="cont">
              <img src={banner} style={{ width: "100%", height: "100%" }} />
            </div>
          </Carousel>
        </div>
      </div>
    );
  }
}
