import React, { Component } from "react";
import Card from "../../Components/Card/Card";
import firebase from "firebase";
import Lottie from "lottie-react-web";
import empty from "./629-empty-box.json";
import loading from "../../../assets/loading.json";
import Loader from "../../Components/Loader/Loader";
import "./Sale.css";

export default class Sale extends Component {
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
      .onSnapshot((snap) => {
        snap.docChanges().forEach((changes) => {
          if (changes.doc.data().sale) {
            products.push(changes.doc.id);
          }
        });
        this.setState({
          products: products,
          loading: false,
        });
      });
  }

  render() {
    return (
      <div className="Sale">
        {this.state.loading ? (
          <Loader />
        ) : (
          <>
            {this.state.products.length > 0 ? (
              <>
                <p>Sales</p>
                <div className="lines">
                  <div className="horizontal"></div>
                  <div className="rotated-line">
                    <div className="line-through"></div>
                    <div className="line-through"></div>
                  </div>
                  <div className="horizontal"></div>
                </div>
                <div className="SaleProducts">
                  {this.state.products.map((item, index) => {
                    return <Card item={item} key={index} />;
                  })}
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "85vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Lottie
                  options={{ animationData: empty }}
                  width={200}
                  height={200}
                />
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#313131",
                  }}
                >
                  Sorry! there are no items for sale at the time
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}
