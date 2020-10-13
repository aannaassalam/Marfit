import React, { Component } from "react";
import Card from "../../Components/Card/Card";
import firebase from "firebase";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import "./ViewAll.css";

export default class Viewall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      loading: true,
      once: false,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("settings")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((changes) => {
          changes.doc.data().sliders.forEach((item) => {
            console.log(item.title);
            if (this.props.match.params.id === item.title) {
              this.setState({
                data: item,
                loading: false,
                once: true,
              });
            }
          });
        });
      });
    if (!this.state.once) {
      firebase
        .firestore()
        .collection("settings")
        .onSnapshot((snap) => {
          snap.docChanges().forEach((changes) => {
            if (
              this.props.match.params.id === changes.doc.data().slider1.title
            ) {
              this.setState({
                data: changes.doc.data().slider1,
                loading: false,
              });
            } else {
              if (
                this.props.match.params.id === changes.doc.data().slider2.title
              ) {
                this.setState({
                  data: changes.doc.data().slider2,
                  loading: false,
                });
              }
            }
          });
        });
    }
  }

  render() {
    return (
      <div className="Viewall">
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
            <p>{this.state.data.title}</p>
            <div className="lines">
              <div className="horizontal"></div>
              <div className="rotated-line">
                <div className="line-through"></div>
                <div className="line-through"></div>
              </div>
              <div className="horizontal"></div>
            </div>
            <div className="ViewallProducts">
              {this.state.data.products.map((item) => {
                return <Card item={item} />;
              })}
            </div>
          </>
        )}
      </div>
    );
  }
}
