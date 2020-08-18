import React from "react";
import "./Slider.css";
import Card from "../Card/Card";
import Swiper from "swiper";

export default class Slider extends React.Component {
  componentDidMount() {
    var swiper = new Swiper(".swiper-container", {
      slidesPerView: "auto",
      spaceBetween: 20,
      //   navigation: {
      //     nextEl: ".swiper-button-next",
      //     prevEl: ".swiper-button-prev",
      //   },
    });
  }

  render() {
    return (
      <div className="card">
        <div className="card-title">
          <div className="card-title-mini">
            <p>{this.props.title}</p>
            <div className="lines">
              <div className="horizontal"></div>
              <div className="rotated-line">
                <div className="line-through"></div>
                <div className="line-through"></div>
              </div>
              <div className="horizontal"></div>
            </div>
          </div>
          {this.props.view ? (
            <a href="#" className="view">
              View All
            </a>
          ) : null}
        </div>
        <div className="slider">
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {this.props.data.map((item, index) => (
                <div className="swiper-slide" key={index}>
                  <Card item={item} />
                </div>
              ))}
            </div>
            {/* <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div> */}
          </div>
        </div>
      </div>
    );
  }
}
