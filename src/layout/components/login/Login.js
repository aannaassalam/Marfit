import React from "react";
import "./Login.css";
import logo from "../../../assets/image_1.png";
import marfit from "../../../assets/marfit-label.png";
import google from "../../../assets/google.png";
import loginBag from "../../../assets/login bag.jpg";
import firebase from "firebase";
import { signInWithGoogle } from "../../../config/firebaseConfig";
import loading from "../../../assets/loading.json";
import Lottie from "lottie-react-web";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: "login",
      checked: false,
      username: "",
      email: "",
      password: "",
      loading: false,
    };
  }

  handleCheck = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRegister = (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    if (this.state.email === "" || !this.state.email.includes("@")) {
      toast.info("Enter email correctly !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.password === "") {
      toast.info("Enter password !");
      this.setState({
        loading: false,
      });
    } else if (this.state.username === "") {
      toast.info("Enter Username !");
      this.setState({
        loading: false,
      });
    } else if (!this.state.checked) {
      toast.info("Please agree to the Terms & Condition");
      this.setState({
        loading: false,
      });
    } else {
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", this.state.email)
        .get()
        .then((snap) => {
          if (snap.size === 0) {
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                this.state.email,
                this.state.password
              )
              .then(() => {
                firebase
                  .firestore()
                  .collection("users")
                  .add({
                    email: this.state.email,
                    name: this.state.username,
                    orders: [],
                    addresses: [],
                    phone: "",
                    dob: "",
                    gender: "",
                    alt: "",
                    cart: [],
                    wishlist: [],
                  })
                  .then(() => {
                    toast.success("Registered");
                    this.setState({
                      loading: false,
                    });
                    this.props.login(true);
                    setTimeout(() => {
                      this.props.close(false);
                    }, 2000);
                  })
                  .catch((err) => {
                    toast.error(err.message);
                    this.setState({
                      loading: false,
                    });
                  });
              })
              .catch((err) => {
                toast.error(err.message);
                this.setState({
                  loading: false,
                });
              });
          } else {
            toast.error("You are already a user");
            this.setState({
              loading: false,
            });
          }
        });
    }
  };

  handleLogin = () => {
    this.setState({
      loading: true,
    });

    if (this.state.email === "" || !this.state.email.includes("@")) {
      toast.info("Enter email correctly", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.password === "") {
      toast.info("Enter password");
      this.setState({
        loading: false,
      });
    } else {
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", this.state.email)
        .get()
        .then((snap) => {
          if (snap.size > 0) {
            firebase
              .auth()
              .signInWithEmailAndPassword(this.state.email, this.state.password)
              .then(() => {
                toast.success("Logged In");
                this.setState({
                  loading: false,
                });
                this.props.login(true);
                setTimeout(() => {
                  this.props.close(false);
                }, 2000);
              })
              .catch((err) => {
                toast.error(err.message);
                this.setState({
                  loading: false,
                });
              });
          } else {
            toast.error("Please register!");
            this.setState({
              loading: false,
            });
          }
        });
    }
  };

  render() {
    return (
      <div className="login-container">
        <ToastContainer />
        <div className="login">
          <i
            className="fa fa-times fa-1x"
            onClick={() => this.props.close(false)}
          ></i>
          <div className="section-1">
            <img src={loginBag} alt="" />
          </div>
          {this.state.toggle === "register" ? (
            <div className="register-form">
              <div className="marfit-img">
                <img src={logo} alt="Marfit logo" />
                <img src={marfit} alt="Marfit title" />
              </div>
              <div className="input-fields">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={this.handleChange}
                  maxLength={10}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Passsword"
                  onChange={this.handleChange}
                />
              </div>
              <div className="agree">
                <input
                  type="checkbox"
                  name="checkbox"
                  id="check"
                  checked={this.state.checked}
                  onChange={this.handleCheck}
                />
                <p className="conditions">
                  I agree to the{" "}
                  <a href="#" className="terms">
                    TERMS & CONDITION
                  </a>{" "}
                  &{" "}
                  <a href="#" className="policy">
                    PRIVACY POLICY
                  </a>
                </p>
              </div>
              {this.state.loading ? (
                <Lottie
                  options={{ animationData: loading }}
                  width={50}
                  height={50}
                />
              ) : (
                <button type="button" id="btn" onClick={this.handleRegister}>
                  Register
                </button>
              )}
              <div className="lines">
                <div className="horizontal"></div>
                <div className="or">OR</div>
                <div className="horizontal"></div>
              </div>
              <div className="google">
                <img src={google} alt="Google Image" />
                <p>Sign Up with Google</p>
              </div>
              <div className="already-customer">
                <p>
                  Already a Customer?{" "}
                  <a onClick={() => this.setState({ toggle: "login" })}>
                    Log in
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="login-form">
              <div className="marfit-img">
                <img src={logo} alt="Marfit logo" />
                <img src={marfit} alt="Marfit title" />
              </div>
              <div className="input-fields">
                <input
                  type="email"
                  name="email"
                  id="user-email"
                  placeholder="Enter Email"
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  id="user-password"
                  placeholder="Enter Password"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.loading ? (
                <Lottie
                  options={{ animationData: loading }}
                  width={80}
                  height={80}
                />
              ) : (
                <button type="button" onClick={this.handleLogin}>
                  Log In
                </button>
              )}
              <div className="lines">
                <div className="horizontal"></div>
                <div className="or">OR</div>
                <div className="horizontal"></div>
              </div>
              <div className="google" onClick={signInWithGoogle}>
                <img src={google} alt="Google Image" />
                <p>Sign In with Google</p>
              </div>
              <div className="already-customer">
                <p>
                  Not a Customer.{" "}
                  <a onClick={() => this.setState({ toggle: "register" })}>
                    Register
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
