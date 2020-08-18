import React from "react";
import "./productDescription.style.css";
import Slider from "../../../Components/Slider/Slider";
import { motion } from "framer-motion";
import Lottie from "lottie-react-web";
import loading from "../../../../assets/loading.json";
import { ToastContainer, toast } from "react-toastify";
import empty from "../629-empty-box.json";

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 0,
  },
};

const pageTransition = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

export default class ProductDesc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderTitle: "You may also like",
      viewAll: false,
      data: [
        {
          images: {
            0: "https://rukminim1.flixcart.com/image/495/594/jyeq64w0/hand-messenger-bag/x/y/p/black-messenger-bag-ket-new-23-messenger-bag-ketsaal-original-imafgng68xynkbnv.jpeg?q=50",
          },
          rent: 400,
          deposit: 600,
          title: "Men Black Mesenger Bag",
        },
        {
          images: {
            0: "https://rukminim1.flixcart.com/image/495/594/jsge4cw0/backpack/j/p/3/classic-anti-theft-faux-leather-lbpclslth1901-laptop-backpack-original-imafeypjt5reuyyf.jpeg?q=50",
          },
          rent: 700,
          deposit: 1200,
          title: "Classic Anti-Theft Bag",
        },
        {
          images: {
            0: "https://rukminim1.flixcart.com/image/495/594/joixj0w0/backpack/y/r/n/luxur-uber061-backpack-f-gear-original-imaf94g5jyfxdqsv.jpeg?q=50",
          },
          rent: 500,
          deposit: 800,
          title: "Luxur 25 L Backpack",
        },
        {
          images: {
            0: "https://rukminim1.flixcart.com/image/495/594/jrtj2q80/wallet-card-wallet/y/b/g/beige-slider-casuel-wallet-samtroh-original-imafdg9yahygu9hh.jpeg?q=50",
          },
          rent: 1300,
          deposit: 2000,
          title: "Men Casual Beige Wallet",
        },
        {
          images: {
            0: "https://rukminim1.flixcart.com/image/495/594/jx502vk0/shoe/t/t/z/415-7-dls-brown-original-imafhnu49m4fzzyz.jpeg?q=50",
          },
          rent: 1700,
          deposit: 2400,
          title: "Lace up for Men Party Shoes",
        },
        {
          images: {
            0: "https://rukminim1.flixcart.com/image/495/594/jbgtnrk0/shoe/u/e/z/mrj558-44-aadi-black-original-imafysmvagxcwxk9.jpeg?q=50",
          },
          rent: 348,
          deposit: 500,
          title: "AADI Men Shoes",
        },
      ],
      activeImage: 0,
    };
  }

  render() {
    return (
      <>
        <ToastContainer />
        {this.state.loading ? (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lottie
              options={{ animationData: loading }}
              width={150}
              height={150}
            />
          </div>
        ) : (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="product-desc-container"
          >
            <div className="categorylist-breadcrumb">
              <div className="breadcrumb-menu">
                <div className="bd-menu-list">
                  <a href="/" style={{ cursor: "pointer" }}>
                    Home
                  </a>
                  <a>
                    <i className="fas fa-chevron-right"></i>
                  </a>
                  <a
                    href={"/Category/" + this.props.match.params.id1}
                    style={{ cursor: "pointer" }}
                  >
                    {this.props.match.params.id1}
                  </a>
                  <a>
                    <i class="fas fa-chevron-right"></i>
                  </a>
                  <a
                    href={
                      "/Category/" +
                      this.props.match.params.id1 +
                      "/" +
                      this.props.match.params.id2
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {this.props.match.params.id2}
                  </a>
                  <a>
                    <i class="fas fa-chevron-right"></i>
                  </a>
                  <a
                    href={
                      "/Category/" +
                      this.props.match.params.id1 +
                      "/" +
                      this.props.match.params.id2 +
                      "/" +
                      this.props.match.params.id3
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {this.props.match.params.id3}
                  </a>
                </div>
              </div>
            </div>
            <div className="product-desc">
              <div className="carousal-section">
                <div className="product-images">
                  {this.state.data.map((item, index) => (
                    <>
                      {this.state.activeImage === index ? (
                        <div className="preview-image activeImage" key={index}>
                          <img src={item.images[0]} alt="slider Images" />
                        </div>
                      ) : (
                        <div className="preview-image" key={index}>
                          <img
                            src={item.images[0]}
                            alt="slider Images"
                            onClick={() => {
                              this.setState({ activeImage: index });
                            }}
                          />
                        </div>
                      )}
                    </>
                  ))}
                </div>
                <div className="product-image">
                  <img
                    src={this.state.data[this.state.activeImage].images[0]}
                    alt="bag-image"
                  />
                </div>
              </div>
              <div className="description-section">
                <p className="product-title">Men's Sling Bag</p>
                <div className="price">
                  <div className="product-price">&#8377;799</div>
                  <div className="product-price-linethrough">&#8377;1300</div>
                  <div className="product-discount">74% off</div>
                </div>
                <div className="product-details">
                  <h3>Product Details</h3>
                  <p className="product-summary">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Veniam doloremque quia quo sit nulla soluta nemo rerum
                    aliquam maiores dolor odit animi eligendi ipsam qui officiis
                    consectetur aliquid, quae repellat dolores enim. Fugiat
                    minima accusamus quis vitae quibusdam adipisci laborum eum
                    corrupti dolores ab porro qui, voluptatem asperiores
                    distinctio voluptatum!
                  </p>
                  <ul>
                    <li>
                      <p className="darkgrey">Number of Contents</p>
                      <p className="text">1 backpack</p>
                    </li>
                    <li>
                      <p className="darkgrey">Number of Contents</p>
                      <p className="text">1 backpack</p>
                    </li>
                    <li>
                      <p className="darkgrey">Number of Contents</p>
                      <p className="text">1 backpack</p>
                    </li>
                    <li>
                      <p className="darkgrey">Number of Contents</p>
                      <p className="text">1 backpack</p>
                    </li>
                    <li>
                      <p className="darkgrey">Number of Contents</p>
                      <p className="text">1 backpack</p>
                    </li>
                    <li>
                      <p className="darkgrey">Number of Contents</p>
                      <p className="text">1 backpack</p>
                    </li>
                    <li>
                      <p className="darkgrey">Number of Contents</p>
                      <p className="text">1 backpack</p>
                    </li>
                    <li>
                      <p className="darkgrey">Number of Contents</p>
                      <p className="text">1 backpack</p>
                    </li>
                  </ul>
                </div>
                <div className="rating">
                  <div className="rating-header">
                    <h3>Ratings & Review</h3>
                    <div className="stars">
                      <p>5</p>
                      <i className="fas fa-star"></i>
                    </div>
                    <p className="rating-size">38 ratings & 9 reviews</p>
                  </div>
                  <div className="review-list">
                    <div className="reviews">
                      <div className="upper">
                        <div className="stars-mini">
                          <p>3</p>
                          <i className="fas fa-star"></i>
                        </div>
                        <p className="review-text">
                          This is an amazing and wonderful product.
                        </p>
                      </div>
                      <div className="lower">
                        <p className="user-name">Anas Alam</p>
                        <p className="date">6 months ago</p>
                      </div>
                    </div>
                    <div className="reviews">
                      <div className="upper">
                        <div className="stars-mini">
                          <p>3</p>
                          <i className="fas fa-star"></i>
                        </div>
                        <p className="review-text">
                          This is an amazing and wonderful product.
                        </p>
                      </div>
                      <div className="lower">
                        <p className="user-name">Anas Alam</p>
                        <p className="date">6 months ago</p>
                      </div>
                    </div>
                    <div className="reviews">
                      <div className="upper">
                        <div className="stars-mini">
                          <p>3</p>
                          <i className="fas fa-star"></i>
                        </div>
                        <p className="review-text">
                          This is an amazing and wonderful product.
                        </p>
                      </div>
                      <div className="lower">
                        <p className="user-name">Anas Alam</p>
                        <p className="date">6 months ago</p>
                      </div>
                    </div>
                    <div className="reviews">
                      <div className="upper">
                        <div className="stars-mini">
                          <p>3</p>
                          <i className="fas fa-star"></i>
                        </div>
                        <p className="review-text">
                          This is an amazing and wonderful product.
                        </p>
                      </div>
                      <div className="lower">
                        <p className="user-name">Anas Alam</p>
                        <p className="date">6 months ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-like">
              <Slider
                data={this.state.data}
                title={this.state.sliderTitle}
                view={this.state.viewAll}
              />
            </div>
          </motion.div>
        )}
      </>
    );
  }
}
