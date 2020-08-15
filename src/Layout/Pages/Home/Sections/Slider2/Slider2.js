import React from "react";
import "./Slider2.css";
import Card from "../../../../components/card/Card";
import Swiper from "swiper";

export default class Slider2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          data: [
            {
              cover: "https://rukminim1.flixcart.com/image/495/594/jyeq64w0/hand-messenger-bag/x/y/p/black-messenger-bag-ket-new-23-messenger-bag-ketsaal-original-imafgng68xynkbnv.jpeg?q=50",
              rent: 400,
              deposit: 600,
              title: "Men Black Mesenger Bag",
            },
            {
              cover: "https://rukminim1.flixcart.com/image/495/594/jsge4cw0/backpack/j/p/3/classic-anti-theft-faux-leather-lbpclslth1901-laptop-backpack-original-imafeypjt5reuyyf.jpeg?q=50",
              rent: 700,
              deposit: 1200,
              title: "Classic Anti-Theft Bag",
            },
            {
              cover: "https://rukminim1.flixcart.com/image/495/594/joixj0w0/backpack/y/r/n/luxur-uber061-backpack-f-gear-original-imaf94g5jyfxdqsv.jpeg?q=50",
              rent: 500,
              deposit: 800,
              title: "Luxur 25 L Backpack",
            },
            {
              cover: "https://rukminim1.flixcart.com/image/495/594/jrtj2q80/wallet-card-wallet/y/b/g/beige-slider-casuel-wallet-samtroh-original-imafdg9yahygu9hh.jpeg?q=50",
              rent: 1300,
              deposit: 2000,
              title: "Men Casual Beige Wallet",
            },
            {
              cover: "https://rukminim1.flixcart.com/image/495/594/jx502vk0/shoe/t/t/z/415-7-dls-brown-original-imafhnu49m4fzzyz.jpeg?q=50",
              rent: 1700,
              deposit: 2400,
              title: "Lace up for Men Party Shoes",
            },
            {
              cover: "https://rukminim1.flixcart.com/image/495/594/jbgtnrk0/shoe/u/e/z/mrj558-44-aadi-black-original-imafysmvagxcwxk9.jpeg?q=50",
              rent: 348,
              deposit: 500,
              title: "AADI Men Shoes",
            },
          ],
        };
      }

  componentDidMount() {
    var swiper = new Swiper(".swiper-container", {
      slidesPerView: "auto",
      spaceBetween: 20,
    });
  }

  render() {
    return (
      <div className="card2">
        <div className="card-title">
          <div className="card-title-mini">
            <p>SHOP BY BAGS</p>
            <div className="lines">
              <div className="horizontal"></div>
              <div className="rotated-line">
                <div className="line-through"></div>
                <div className="line-through"></div>
              </div>
              <div className="horizontal"></div>
            </div>
          </div>
          <a href="#" className="view">
            View All
          </a>
        </div>
        <div className="slider">
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {this.state.data.map((item) => (
                <div className="swiper-slide">
                  <Card item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
