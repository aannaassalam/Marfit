import React from "react";
import "./Card.css";
import bagicon from "../../../assets/bag-icon.png";

const Card = (props) => {
  console.log(props.item);
  var percent = Math.round((props.item.rent / props.item.deposit) * 100);
  return (
    <div className="card-cont">
      <div className="img-container">
        <a
          style={{ width: "100%", height: "100%" }}
          href={"/Category/Furniture/Bedroom/" + props.item.title}
        >
          <img src={props.item.cover} alt="Bag-Icon" />
        </a>
      </div>
      {props.item.isWished ? (
        <div
          className="circle"
          onClick={() => props.removeFromWishlist(props.item)}
        >
          <i className="red fa fa-heart"></i>
        </div>
      ) : (
        <div className="circle" onClick={() => props.addToWishlist(props.item)}>
          <i className="fa fa-heart"></i>
        </div>
      )}
      <a
        href={"/Category/Furniture/Bedroom/" + props.item.title}
        className="short-description"
      >
        <p className="item-title">{props.item.title}</p>
        <p className="item-price">&#8377;{props.item.rent}</p>
        <div className="price-flex">
          <p className="price-line-through">&#8377;{props.item.deposit}</p>
          <p className="discount">{100 - percent}%</p>
        </div>
      </a>
    </div>
  );
};
export default Card;
