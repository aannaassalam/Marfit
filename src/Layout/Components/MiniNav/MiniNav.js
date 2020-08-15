import React from "react";
import "./MiniNav.css";

export default class MiniNav extends React.Component {
  render() {
    return (
      <div className="mini-container">
        <div className="tray">
          <div className="mini-content">
            Men <i className="fa fa-chevron-down fa-1x"></i>
            <div className="category-options">
              <a href="/Category/Men/Bags" className="men-bags">
                Bags
              </a>
              <a href="/Category/Men/Belts" className="belts">
                Belts
              </a>
              <a href="/Category/Men/Wallets" className="wallet">
                Wallets
              </a>
              <a href="/Category/Men/Shoes" className="shoes">
                Shoes
              </a>
            </div>
          </div>
          <div className="mini-content">
            Women <i className="fa fa-chevron-down fa-1x"></i>
            <div className="category-options">
              <a href="/Category/Women/Bags" className="women-bags">
                Hand Bags
              </a>
              <a href="/Category/Women/Purse" className="purse">
                Purse
              </a>
              <a href="/Category/Women/Shoes" className="shoes">
                Shoes
              </a>
            </div>
          </div>
          <div className="mini-content">
            Child <i className="fa fa-chevron-down fa-1x"></i>
            <div className="category-options">
              <a href="/Category/Child/Bags" className="child-bag">
                School Bags
              </a>
              <a href="/Category/Child/Shoes" className="shoes">
                Shoes
              </a>
            </div>
          </div>
          <a href="/Category/Sale">Sale</a>
        </div>
      </div>
    );
  }
}
