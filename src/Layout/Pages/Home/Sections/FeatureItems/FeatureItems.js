import React from "react";
import poster from "../../../../../assets/poster.png";
import title from "../../../../../assets/title.png";
import "./FeatureItems.css";

export default class FeatureItems extends React.Component {
  render() {
    return (
      <div className="poster">
        <div className="image">
          <img src={poster} alt="poster" />
          <div className="title">
            <img src={title} alt="title" />
            <p>New Summer Collection is Here Now!</p>
          </div>
          <a href="#">
            <i className="fas fa-arrow-right"></i>
            <p>
              <i className="italics">CLICK TO EXPLORE</i>
            </p>
          </a>
        </div>
      </div>
    );
  }
}
