import React from "react";
import Swiper from "swiper";

import "./MostRated.style.css";

import one from "./assets/1.jpeg";

class MostRated extends React.Component {
  componentDidMount() {
    var swiper = new Swiper(".swiper-container", {
      slidesPerView: 3,
      spaceBetween: 30,
    });
  }
  render() {
    var itemCount = 0;
    return (
      <div className="most-rated-container">
        <div className="most-rated-header">
          <p>Latest Products In {this.props.parentCategory}</p>
          <div className="underline"></div>
        </div>
        <div className="most-rated-body">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              {this.props.productList.map((item) => {
                if (itemCount < 10) {
                  itemCount++;
                  return (
                    <div class="swiper-slide">
                      <img src={item.images[0]} alt="one" />
                      <div className="details">
                        <p>{item.title}</p>
                        <div className="price-review">
                          <p>&#8377;{item.sp}</p>
                          <a
                            href={
                              "/Category/" +
                              item.category +
                              "/" +
                              item.subCategory +
                              "/" +
                              item.id
                            }
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MostRated;
