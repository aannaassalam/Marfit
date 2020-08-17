import React from "react";
import Swiper from "swiper";

import "./prodDesc.style.css";

class ProdDesc extends React.Component {
  componentDidMount() {
    var swiper = new Swiper(".swiper-container", {
      pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  render() {
    return (
      <div className="description">
        <div className="header">
          <p>Product Details</p>
          <div className="line"></div>
        </div>
        <div className="body">
          <div className="gallery">
            <div className="swiper-container">
              <div className="swiper-wrapper">
                {this.props.product.images &&
                  this.props.product.images.map((item, index) => {
                    return (
                      <div className="swiper-slide" key={index}>
                        <img src={item} alt="item" />
                      </div>
                    );
                  })}
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>

          <div className="details">
            <div className="item-title">
              <p>{this.props.product.title}</p>
              <div className="line"></div>
            </div>

            <div className="item-desc">
              <p>{this.props.product.description}</p>
            </div>

            <div className="item-price">
              <div className="line"></div>
              <div>
                <p>
                  Retail Price: <span>&#8377;{this.props.product.rent}</span>
                </p>
                <p>
                  Actual Price:{" "}
                  <span>&#8377;{this.props.product.deposit}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProdDesc;
