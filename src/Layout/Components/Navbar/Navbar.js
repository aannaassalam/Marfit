import React from "react";
import "./Navbar.css";
import logo from "../../../assets/image_1.png";
import logo2 from "../../../assets/image_2.png";
import title from "../../../assets/marfit-label.png";
import title2 from "../../../assets/marfit-label2.png";
import Cart from "../../pages/cart/Cart";
import Login from "../login/Login";
import firebase from "../../../config/firebaseConfig";
import loading from "../../../assets/loading.json";
import Lottie from "lottie-react-web";
import { firestore } from "firebase";
import { toast } from "react-toastify";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCart: false,
      login: false,
      loginStatus: false,
      loading: true,
      profile: false,
      currentUser: [],
      hamburgerActive: false,
      showMenu: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loading: false,
          loginStatus: true,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
      firestore()
        .collection("users")
        .where("email", "==", user.email)
        .onSnapshot((snap) => {
          snap.docs.forEach((doc) => {
            this.setState({
              currentUser: doc.data(),
            });
          });
        });
    });
  }

  handleClick = () => {};

  handleReverseClick = () => {};

  handleShop = () => {
    if (document.getElementById("caret").classList.contains("open")) {
      document.getElementById("caret").classList.remove("open");
      document
        .getElementsByClassName("shop-menu")[0]
        .classList.remove("active");
      document.getElementsByClassName("shopmenu-list")[0].style.display =
        "none";
    } else {
      document.getElementById("caret").classList.add("open");
      document.getElementsByClassName("shop-menu")[0].classList.add("active");
      document.getElementsByClassName("shopmenu-list")[0].style.display =
        "block";
    }
  };

  handleCart = () => {
    this.setState({
      showCart: true,
    });
  };

  handleCartClose = () => {
    this.setState({
      showCart: false,
    });
  };

  handleLoginStatus = (toggle) => {
    this.setState({
      loginStatus: toggle,
    });
  };

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({
          loginStatus: !this.state.loginStatus,
        });
      });
  };

  render() {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <div className="first-container">
            <i
              className="fa fa-bars fa-2x"
              onClick={() => this.setState({showMenu : true})}
              aria-hidden="true"
            ></i>
            <a href="/" className="logo">
              <img src={logo} alt="Marfit Logo" className="logo-img" />
              <img src={title} alt="Marfit Title" className="logo-title" />
            </a>
          </div>
          <div className="second-container">
            <div className="input-container">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="What are you looking for ?"
              />
            </div>
            <button>
              <i className="fa fa-search"></i>
            </button>
          </div>
          <div className="third-container">
            <a href="#" className="search-icon">
              <i className="fa fa-search"></i>
            </a>

            {this.state.loading ? (
              <Lottie
                options={{ animationData: loading }}
                width={50}
                height={50}
              />
            ) : (
              <>
                {this.state.loginStatus ? (
                  <>
                    <div
                      className="profile"
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      <a className="username">
                        <p>Hello, {this.state.currentUser.name}</p>
                        <i className="fas fa-chevron-down"></i>
                      </a>
                      {/* <div className="arrow-up"></div> */}
                      <div className="options">
                        <a
                          href="/Dashboard/Profile"
                          className="option-links"
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          <i className="fas fa-user"></i>
                          <p>Profile</p>
                        </a>
                        <a
                          href="/Dashboard/Orders"
                          className="option-links"
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          <i className="fas fa-shopping-bag"></i>
                          <p>Orders</p>
                        </a>
                        <a
                          className="option-links"
                          onClick={this.handleLogout}
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          <i className="fas fa-sign-out-alt"></i>
                          <p>Logout</p>
                        </a>
                      </div>
                    </div>
                    <a href="/Dashboard/Wishlist" className="links">
                      <i className="fa fa-heart"></i>
                      <p>WISHLIST</p>
                    </a>
                    <a
                      style={{ cursor: "pointer", userSelect: "none" }}
                      className="links"
                      onClick={this.handleCart}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      <p>CART</p>
                    </a>
                  </>
                ) : (
                  <a
                    style={{ cursor: "pointer", userSelect: "none" }}
                    className="login-signup"
                    onClick={() => {
                      this.setState({ login: true });
                    }}
                  >
                    <i className="fas fa-user"></i>
                    <p>LOGIN/SIGN UP</p>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
        <div
          className={this.state.showMenu ? "active-menu" : "menu"}
        >
          :
          <div className={this.state.showMenu ? 'hamburger-menu' : 'hamburger-menu-none'}>
            <div className="head">
              <div className="logo">
                <img src={logo} alt="Marfit Logo" className="logo-img" />
                <img src={title} alt="Marfit Title" className="logo-title" />
              </div>
              <i
                className="fa fa-times fa-1x"
                onClick={() => this.setState({showMenu: false})}
              ></i>
            </div>
            <div className="ham-list">
              <a href="/" className="box">
                <p href="/">Home</p>
              </a>
              <a href="#" className="box">
                <p href="#">Contact us</p>
              </a>
              <a href="#" className="box" id="cart" onClick={this.handleCart}>
                <p href="#">Cart</p>
                <i className="fa fa-caret-right fa-1x"></i>
              </a>
              <a href="#" className="box" id="shop" onClick={this.handleShop}>
                <p href="#">Shop</p>
                <i className="fa fa-caret-right fa-1x" id="caret"></i>
              </a>
              <div className="shop-menu">
                <ul className="shopmenu-list">
                  <li>
                    <a href="#" className="men">
                      Mens
                    </a>
                  </li>
                  <li>
                    <a href="#" className="men">
                      Womens
                    </a>
                  </li>
                  <li>
                    <a href="#" className="men">
                      Child
                    </a>
                  </li>
                  <li>
                    <a href="#" className="men">
                      Sale
                    </a>
                  </li>
                </ul>
              </div>
              <a href="#" className="box" id="wishlist">
                <p href="#">Wishlist</p>
                <i className="fa fa-caret-right fa-1x"></i>
              </a>
              {!this.state.loginStatus ? (
                <a
                  href="#"
                  className="box orange"
                  onClick={() => {
                    this.setState({ login: true });
                  }}
                >
                  <p style={{ cursor: "pointer", userSelect: "none" }}>Login</p>
                  <i className="fa fa-caret-right fa-1x"></i>
                </a>
              ) : null}
            </div>
          </div>
          <div className="blank" onClick={() => this.setState({showMenu: false})}></div>
          {this.state.showCart ? (
            <Cart
              close={this.handleCartClose}
              email={this.state.currentUser.email}
            />
          ) : null}
          {this.state.login ? (
            <Login
              close={(toggle) => this.setState({ login: toggle })}
              login={(toggle) => {
                this.handleLoginStatus(toggle);
              }}
            />
          ) : null}
        </div>
      </nav>
    );
  }
}
