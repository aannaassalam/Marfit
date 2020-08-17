import React from "react";
import bag from "../../../assets/bag.png";
import "./Cart-card.css";
import firebase from "firebase";

export default class CartCard extends React.Component {
  render() {
    return (
      <div className="items" >
        <a
          style={{ textDecoration: "none", color: "black" }}
          href={
            "/Category/" +
            this.props.item.category +
            "/" +
            this.props.item.subCategory +
            "/" +
            this.props.item.title
          }
        >
          <img src={this.props.item.images[0]} alt="Bag Image" />
        </a>
        <div className="description">
          <p className="title">{this.props.item.title}</p>
          <p className="price">&#8377;{this.props.item.price}</p>
          <div className="counter">
            <span className="symbol" onClick={this.props.handleminus}>
              -
            </span>
            <span>{this.props.item.quantity}</span>
            <span className="symbol" onClick={this.props.handleplus}>
              +
            </span>
          </div>
          <div
            onClick={() => {
              this.props.removeFromCart(this.props.item);
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
