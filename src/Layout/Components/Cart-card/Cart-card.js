import React from "react";
import bag from "../../../assets/bag.png";
import "./Cart-card.css";
import firebase from "firebase";

export default class CartCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 1,
    };
  }

  handleminus = () => {
    var count = this.state.counter;
    if (count > 0) {
      this.setState({
        counter: count - 1,
      });
    }
  };

  handleplus = () => {
    var count = this.state.counter;
    this.setState({
      counter: count + 1,
    });
  };

  render() {
      console.log(this.props.item)
    return (
      <div className="items">
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
            <span className="symbol" onClick={this.handleminus}>
              -
            </span>
            <span>{this.state.counter}</span>
            <span className="symbol" onClick={this.handleplus}>
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
