import React, { Component } from "react";
import "./OrdersComp.css";
import firebase from "firebase";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import moment from "moment";

class OrdersComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      orderimg: null,
      ordertitle: null,
      orderdate: null,
      ordertotal: null,
      orderstatus: null,
      totalproducts: null,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("orders")
      .doc(this.props.item)
      .onSnapshot((order) => {
        firebase
          .firestore()
          .collection("products")
          .doc(order.data().products[0].id)
          .get()
          .then((product) => {
            console.log(product.data().images[0]);
            this.setState({
              orderimg: product.data().images[0],
              ordertitle: product.data().title,
              orderdate: order.data().date,
              ordertotal: order.data().total,
              orderstatus: order.data().status,
              totalproducts: order.data().products.length - 1,
              loading: false
            });
          });
      });
  }

  render() {
    console.log(this.state.totalproducts);
    return (
      <>
        {this.state.loading ? (
          <Lottie
            options={{ animationData: loading }}
            width={100}
            height={100}
          />
        ) : (
          <a href={"/Orders/" + this.props.item} className="orderList">
            <div className="part1">
              <img src={this.state.orderimg} alt="img" />
              <div className="part1-detail">
                <h5>
                  {this.state.ordertitle}
                  <p>
                    {this.state.totalproducts > 0
                      ? " & " + this.state.totalproducts + " more item"
                      : null}
                  </p>
                </h5>
                {/* <p>Quantity : {data.quantity}</p> */}
                <p>Order date : {moment(this.state.orderdate.toDate()).format("ll")}</p>
              </div>
            </div>
            <div className="part2">
              <p>&#8377;{this.state.ordertotal}</p>
            </div>
            <div className="part3">
              <div className="one">
                <div className="indictionCircle"></div>
                <p className="deliveryState">{this.state.orderstatus}</p>
              </div>
              <p className="deliveryDate">
                Delivered on : {moment(this.state.orderdate.toDate()).format("ll")}
              </p>
            </div>
          </a>
        )}
      </>
    );
  }
}

export default OrdersComp;
