import React from "react";
import Banner from "./Sections/Banner/Banner";
import FeatureItems from "./Sections/FeatureItems/FeatureItems";
import Slider from "../../Components/Slider/Slider";
import Add from "./Sections/Add/Add";
import About from "./Sections/About/About";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import "./Home.css";
import firebase from "firebase";

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
    console.log(this.state.sliders);
    return (
      <div className="main">
        {this.state.loading ? (
          <div className="load">
          <Lottie
            options={{ animationData: loading }}
            width={100}
            height={100}
          />
          </div>
        ) : (
          <>
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
          </>
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
