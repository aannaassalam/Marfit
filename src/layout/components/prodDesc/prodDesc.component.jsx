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
            <div class="swiper-container">
              <div class="swiper-wrapper">
                {this.props.product.images &&
                  this.props.product.images.map((item) => {
                    return (
                      <div class="swiper-slide">
                        <img src={item} alt="item" />
                      </div>
                    );
                  })}
              </div>
              <div class="swiper-pagination"></div>
            </div>
          </div>

          <div className="details">
            <div className="item-title">
              <p>{this.props.product.title}</p>
              <div className="line"></div>
            </div>

            <div className="item-desc">
              <p>{this.props.product.description}</p>
              <p>
                Retail Price <span>&#8377;{this.props.product.price}</span>
              </p>
            </div>

            <div className="item-price">
              <div className="line"></div>
              <div>
                <p>
                  Monthly Rent: <span>&#8377;{this.props.product.rent}</span>
                </p>
                <p>
                  Security Deposit:{" "}
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
