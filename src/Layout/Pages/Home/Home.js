import React from "react";
import Banner from "./Sections/Banner/Banner";
import { motion } from "framer-motion";
import FeatureItems from "./Sections/FeatureItems/FeatureItems";
import Slider from "../../Components/Slider/Slider";
import Add from "./Sections/Add/Add";
import About from "./Sections/About/About";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import Loader from "../../Components/Loader/Loader";
import "./Home.css";
import firebase from "firebase";
import MobileMiniNav from "../../Components/MobileMiniNav/MobileMiniNav";
import axios from "axios";
import { Thumbs } from "swiper";

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
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAll: true,
      data1: "",
      data2: "",
      sliders: "",
      loading: true,
      add1: {},
      add2: {},
      add3: {},
      overflow: false,
    };
  }

  async componentDidMount() {
    firebase
      .firestore()
      .collection("settings")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((changes) => {
          this.setState({
            data1: changes.doc.data().slider1,
            data2: changes.doc.data().slider2,
            sliders: changes.doc.data().sliders,
            add1: changes.doc.data().bottomBanner1,
            add2: changes.doc.data().bottomBanner2,
            add3: changes.doc.data().bottomBanner3,
            loading: false,
          });
        });
      });
  }

  handleOverflow = (toggle) => {
    this.setState({
      overflow: toggle,
    });
  };

  render() {
    return (
      <div className={this.state.overflow ? "main overflow" : "main"}>
        {this.state.loading ? (
          <Loader />
        ) : (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <MobileMiniNav />
            <Banner />
            <FeatureItems add={this.state.add1} />
            <Slider
              data={this.state.sliders[0].products}
              title={this.state.sliders[0].title}
              view={this.state.viewAll}
            />
            <Add add={this.state.add2} />
            <Slider
              data={this.state.sliders[1].products}
              title={this.state.sliders[1].title}
              view={this.state.viewAll}
            />
            <About />
            <Slider
              data={this.state.sliders[2].products}
              title={this.state.sliders[2].title}
              view={this.state.viewAll}
            />
            <Add add={this.state.add3} />
            {this.state.sliders &&
              this.state.sliders.map((slider, index) => {
                if (index > 2) {
                  return (
                    <Slider
                      data={slider.products}
                      title={slider.title}
                      view={this.state.viewAll}
                    />
                  );
                }
              })}
          </motion.div>
        )}

        {/* 
        <Slider
          data={this.state.data}
          title={this.state.sliderTitle}
          view={this.state.viewAll}
        />
        <Slider
          data={this.state.data}
          title={this.state.sliderTitle}
          view={this.state.viewAll}
        /> */}
        {/* <Toaster.success text="error"></Toaster.success> */}
      </div>
    );
  }
}
