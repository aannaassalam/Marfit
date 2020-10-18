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
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("settings")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((changes) => {
          this.setState({
            data1: changes.doc.data().slider1,
            data2: changes.doc.data().slider2,
            sliders: changes.doc.data().sliders,
            loading: false,
          });
        });
      });
  }

  render() {
    return (
      <div className="main">
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
            <Banner />
            <FeatureItems />
            <Slider
              data={this.state.data1.products}
              title={this.state.data1.title}
              view={this.state.viewAll}
            />
            <Add />
            <Slider
              data={this.state.data2.products}
              title={this.state.data2.title}
              view={this.state.viewAll}
            />
            <About />
            <Slider
              data={this.state.data1.products}
              title={this.state.data1.title}
              view={this.state.viewAll}
            />
            <Add />
            {this.state.sliders &&
              this.state.sliders.map((slider) => (
                <Slider
                  data={slider.products}
                  title={slider.title}
                  view={this.state.viewAll}
                />
              ))}
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
