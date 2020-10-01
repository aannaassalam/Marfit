import React from "react";
import bag from "../../../assets/bag.png";
import "./Cart-card.css";
import firebase from "firebase";

export default class CartCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: "",
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("products")
      .doc(this.props.item.id)
      .onSnapshot((doc) => {
        this.setState({
          product: doc.data(),
        });
      });
  }

  render() {
    console.log(this.state.product);
    return (
      <div className="items">
        <a
          style={{ textDecoration: "none", color: "black" }}
          href={
            "/Category/" +
            this.state.product.category +
            "/" +
            this.state.product.subCategory +
            "/" +
            this.state.product.title
          }
        >
          <img src={this.state.product && this.state.product.images[0]} />
        </a>
        <div className="description">
          <p className="title">{this.state.product.title}</p>
          <p className="price">&#8377;{this.state.product.sp}</p>
          <div className="counter">
            <span
              className="symbol"
              onClick={() => this.props.handleminus()}
            >
              -
            </span>
            <span>{this.props.item.quantity}</span>
            <span
              className="symbol"
              onClick={() => this.props.handleplus()}
            >
              +
            </span>
          </div>
          <div
            onClick={() => {
              this.props.removeFromCart(this.props.item.id);
            }}
            className="remove-link"
          >
            REMOVE
          </div>
        </div>
      </div>
    );
  }
}
