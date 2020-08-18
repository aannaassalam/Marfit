import React from "react";
import Banner from "./Sections/Banner/Banner";
import FeatureItems from "./Sections/FeatureItems/FeatureItems";
import Slider from "../../Components/Slider/Slider";
import Add from "./Sections/Add/Add";
import About from "./Sections/About/About";
import "./Home.css";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderTitle: "Top Trending Products",
      viewAll: true,
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
    };
  }

  render() {
    return (
      <div className="main">
        <Banner />
        <FeatureItems />
        <Slider
          data={this.state.data}
          title={this.state.sliderTitle}
          view={this.state.viewAll}
        />
        <Add />
        <Slider
          data={this.state.data}
          title={"Shop By Bags"}
          view={this.state.viewAll}
        />
        <About />
        <Slider
          data={this.state.data}
          title={this.state.sliderTitle}
          view={this.state.viewAll}
        />
        <Add />
        <Slider
          data={this.state.data}
          title={this.state.sliderTitle}
          view={this.state.viewAll}
        />
        <Slider
          data={this.state.data}
          title={this.state.sliderTitle}
          view={this.state.viewAll}
        />
        <Slider
          data={this.state.data}
          title={this.state.sliderTitle}
          view={this.state.viewAll}
        />
      </div>
    );
  }
}
