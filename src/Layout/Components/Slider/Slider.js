import React from "react";
import "./Slider.css";
import Card from "../Card/Card";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Swiper from "swiper";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import firebase from "firebase";

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
    };
  }

  componentDidMount() {
    var swiper = new Swiper(".swiper-container", {
      observer: true,
      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: "auto",
          spaceBetween: 20,
        },
      },
      //   navigation: {
      //     nextEl: ".swiper-button-next",
      //     prevEl: ".swiper-button-prev",
      //   },
    });

    // this.props.data.forEach(item => {
    //   firebase.firestore().collection('products').doc(item).get().then(snap => {
    //     if (snap) {
    //       this.setState({
    //         products: [...this.state.products, item]
    //       })
    //     }
    //   })
    // })
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
            <a href={"/Products/" + this.props.title} className="view">
              View All
            </a>
          ) : null}
        </div>
        <div className="slider">
          {!this.state.products.length > 0 ? (
            <div className="swiper-container">
              <div className="swiper-wrapper">
                {this.state.products.map((item, index) => (
                  <div className="swiper-slide" key={index}>
                    <Card item={item} />
                  </div>
                ))}
              </div>
              {/* <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div> */}
            </div>
          ) : (
            <Lottie
              options={{ animationData: loading }}
              width={100}
              height={100}
            />
          )}
        </div>
      </div>
    );
  }
}
