import React from "react";
import bag from "../../../assets/bag.png";
import "./OrderCard.css";
import firebase from "firebase";

export default class OrderCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: "",
    };
  }

  componentDidMount() {
    // firebase
    //   .firestore()
    //   .collection("products")
    //   .doc(this.props.item.id)
    //   .onSnapshot((doc) => {
    //     this.setState({
    //       product: doc.data(),
    //     });
    //   });
  }

  render() {
    console.log(this.props.item);
    return (
      <>
        {this.props.item ? (
          <div className="Orderitems">
            <a
              style={{ textDecoration: "none", color: "black" }}
              href={
                "/Category/" +
                this.props.item.category +
                "/" +
                this.props.item.subCategory +
                "/" +
                this.props.item.id
              }
            >
              <img src={this.props.item && this.props.item.images[0].uri} />
            </a>
            <div className="description">
              <p className="title">{this.props.item.title}</p>
              <div className="price-cont">
                <p className="price">&#8377;{this.props.item.sp}</p>
                <p className="quan">Quantity : {this.props.item.quantity}</p>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
