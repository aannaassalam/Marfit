import React, { Component } from "react";
import Card from "../../Components/Card/Card";
import firebase from "firebase";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import "./NewArrival.css";

export default class NewArrival extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: "",
      loading: true,
    };
  }

  componentDidMount() {
    var products = [];
    firebase
      .firestore()
      .collection("products")
      .orderBy("date", "desc")
      .limit(10)
      .onSnapshot((snap) => {
        snap.docChanges().forEach((changes) => {
          var product = {};
          product.id = changes.doc.id;
          product.date = changes.doc.data().date;
          products.push(product);
        });
        if (snap.size === products.length) {
          this.setState({
            products: products,
            loading: false,
          });
        }
    });
  }

  render() {
    return (
      <div className="NewArrival">
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
            <p>New Arrivals</p>
            <div className="lines">
              <div className="horizontal"></div>
              <div className="rotated-line">
                <div className="line-through"></div>
                <div className="line-through"></div>
              </div>
              <div className="horizontal"></div>
            </div>
            <div className="NewArrivalProducts">
              {this.state.products.map((item, index) => {
                return <Card item={item} key={index} />;
              })}
            </div>
          </>
        )}
      </div>
    );
  }
}
