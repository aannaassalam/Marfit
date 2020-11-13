import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/image_1.png";
import "./HamburgerMenu.css";
import firebase from 'firebase';

export default class HamburgerMenu extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      categories: [],
      open: null
    }
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("settings")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          this.setState({
            categories: change.doc.data().categories,
            loading: false,
          });
        });
      });
  }

  render() {
    return (
      <div className={this.props.active ? "menu-ham active" : "menu-ham"}>
        <div
          className={
            this.props.active ? "hamburger-menu active" : "hamburger-menu"
          }
        >
          <div className="head">
            <div className="logo">
              <img src={logo} alt="Marfit Logo" className="logo-img" />
            </div>
            <i
              className="fa fa-times fa-1x"
              onClick={() => this.props.close()}
            ></i>
          </div>
          <div className="ham-list">
            <Link to="/" className="box" onClick={() => this.props.close()}>
              <p>Home</p>
            </Link>
            <Link to="/NewArrivals" className="box hide" onClick={() => this.props.close()}>
              <p style={{color: "#fb641b"}}>New Arrivals</p>
            </Link>
            <Link to="/Sale" className="box hide" onClick={() => this.props.close()}>
              <p style={{color: "#fb641b"}}>Sale</p>
            </Link>
            <div className="MiniNav">
            {this.state.categories.map((cat, index) => {
                return (
                  <div className={this.state.open === index ? "MiniNav-category opened box" : "MiniNav-category box"} key={index} onClick={() => this.state.open === index ? this.setState({open: null}) : this.setState({open: index})}>
                    <p>{cat.name} <i className={this.state.open === index ? "fa fa-chevron-down fa-1x open" : "fa fa-chevron-down fa-1x"}></i></p>
                    <div className="subcategory-options">
                      {cat.subcategories.map((sub, index) => {
                        return (
                          <a
                            href={"/Category/" + cat.name + "/" + sub.name}
                            key={index}
                          >
                            {sub.name}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
            })}
              </div>
            {this.props.login ? (
              <>
              <Link to="/Dashboard/Orders" className="box disappear" onClick={() => this.props.close()}>
                <p>Orders</p>
              </Link>
              <Link
                to="/Dashboard/Wishlist"
                className="box disappear"
                id="wishlist"
                onClick={() => this.props.close()}
              >
                <p href="#">Wishlist</p>
              </Link>
              <Link to="/Dashboard/Profile" className="box disappear" onClick={() => this.props.close()}>
                <p>Profile</p>
              </Link>
              <Link to="/Dashboard/Address" className="box disappear" onClick={() => this.props.close()}>
                <p>Address</p>
              </Link>
              <Link to="/Dashboard/Refer" className="box disappear" onClick={() => this.props.close()}>
                <p>Refer & Earn</p>
              </Link>
              </>
            ) : null}
            <Link to="#" className="box" onClick={() => this.props.close()}>
              <p href="#">Contact us</p>
            </Link>
            <p
              className="box"
              id="cart"
              onClick={() => {
                this.props.cart();
                this.props.close();
              }}
            >
              <span>Cart</span>
            </p>
            {this.props.login ? (
              <p
                className="box orange"
                onClick={() => {
                  this.props.logout();
                  this.props.close();
                }}
              >
                <span style={{ cursor: "pointer", userSelect: "none" }}>
                  Logout
                </span>
                <i className="fa fa-sign-out-alt fa-1x"></i>
              </p>
            ) : (
              <p
                className="box orange"
                onClick={() => {
                  this.props.handleLogin();
                  this.props.close();
                }}
              >
                <span style={{ cursor: "pointer", userSelect: "none" }}>
                  Login
                </span>
                <i className="fa fa-caret-right fa-1x"></i>
              </p>
            )}
          </div>
        </div>
        <div className="blank" onClick={() => this.props.close()}></div>
      </div>
    );
  }
}
