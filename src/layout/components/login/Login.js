import React from "react";
import "./Login.css";
import logo from "../../../assets/image_1.png";
import marfit from "../../../assets/marfit-label.png";
import google from "../../../assets/google.png";
import fb from "../../../assets/fb.png";
import loginBag from "../../../assets/login bag.jpg";
import firebase from "firebase";
import { signInWithGoogle } from "../../../config/firebaseConfig";
import loading from "../../../assets/loading.json";
import Lottie from "lottie-react-web";
import toaster from "toasted-notes";
import "toasted-notes/src/styles.css";

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
      forgotpass: false,
      resetEmail: "",
      referal: "",
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
    var points = 0;
    e.preventDefault();
    this.setState({
      loading: true,
    });
    if (this.state.email === "" || !this.state.email.includes("@")) {
      toaster.notify("Enter email correctly !", {
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
      toaster.notify("Enter password !");
      this.setState({
        loading: false,
      });
    } else if (this.state.username === "") {
      toaster.notify("Enter Username !");
      this.setState({
        loading: false,
      });
    } else if (!this.state.checked) {
      toaster.notify("Please agree to the Terms & Condition");
      this.setState({
        loading: false,
      });
    } else if (this.state.referal.length > 0) {
      firebase
        .firestore()
        .collection("users")
        .where("referalID", "==", this.state.referal)
        .get()
        .then((snap) => {
          if (snap.size > 0) {
            points = 10;
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
                          referalID: "",
                          points: points,
                        })
                        .then((res) => {
                          var referal =
                            res.id.substr(16, 4) +
                            this.state.email.substr(0, 2);
                          firebase
                            .firestore()
                            .collection("users")
                            .doc(res.id)
                            .update({
                              referalID: referal,
                            });
                          this.setState({
                            loading: false,
                          });
                          this.props.login(true);
                          this.props.close(false);
                        })
                        .catch((err) => {
                          toaster.notify(err.message);
                          this.setState({
                            loading: false,
                          });
                        });
                    })
                    .catch((err) => {
                      toaster.notify(err.message);
                      this.setState({
                        loading: false,
                      });
                    });
                } else {
                  toaster.notify("You are already a user");
                  this.setState({
                    loading: false,
                  });
                }
              });
          } else {
            toaster.notify("Invalid Referal Code");
            this.setState({
              loading: false,
            });
          }
        })
        .catch((err) => {
          toaster.notify("Invalid Referal Code");
          this.setState({
            loading: false,
          });
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
                    referalID: "",
                    points: points,
                  })
                  .then((res) => {
                    var referal =
                      res.id.substr(16, 4) + this.state.email.substr(0, 2);
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(res.id)
                      .update({
                        referalID: referal,
                      });
                    this.setState({
                      loading: false,
                    });
                    this.props.login(true);
                    this.props.close(false);
                  })
                  .catch((err) => {
                    toaster.notify(err.message);
                    this.setState({
                      loading: false,
                    });
                  });
              })
              .catch((err) => {
                toaster.notify(err.message);
                this.setState({
                  loading: false,
                });
              });
          } else {
            toaster.notify("You are already a user");
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
      toaster.notify("Enter email correctly");
      this.setState({
        loading: false,
      });
    } else if (this.state.password === "") {
      toaster.notify("Enter password");
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
                this.setState({
                  loading: false,
                });
                this.props.login(true);
                this.props.close(false);
              })
              .catch((err) => {
                toaster.notify(err.message);
                this.setState({
                  loading: false,
                });
              });
          } else {
            toaster.notify("Please register!");
            this.setState({
              loading: false,
            });
          }
        });
    }
  };

  resetPassword = () => {
    this.setState({
      loading: true,
    });
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.resetEmail)
      .then(() => {
        toaster.notify("Reset E-mail sent successfully");
        this.setState({
          loading: false,
        });
      })
      .catch((err) => {
        toaster.notify("User account does not exist!!!");
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    return (
      <div className="login-container">
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
                <input
                  type="text"
                  name="referal"
                  placeholder="Referal code  (optional)"
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
              <div className="social">
                <img src={google} alt="Google Image" />
                <img src={fb} alt="Facebook Image" />
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
              {this.state.forgotpass ? (
                <div className="resetPass">
                  <i
                    className="fas fa-arrow-left"
                    onClick={() =>
                      this.setState({
                        forgotpass: false,
                      })
                    }
                  ></i>
                  <div className="sendmail">
                    <input
                      type="email"
                      name="resetEmail"
                      placeholder="Enter your Email"
                      onChange={this.handleChange}
                    />
                    {this.state.loading ? (
                      <Lottie
                        options={{ animationData: loading }}
                        width={50}
                        height={50}
                      />
                    ) : (
                      <button type="button" onClick={this.resetPassword}>
                        <p>Reset Password</p>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="input-fields">
                    <input
                      type="email"
                      name="email"
                      id="user-email"
                      placeholder="Enter Email"
                      onChange={this.handleChange}
                    />
                    <div className="pass">
                      <input
                        type="password"
                        name="password"
                        id="user-password"
                        placeholder="Enter Password"
                        onChange={this.handleChange}
                      />
                      <p
                        onClick={() =>
                          this.setState({
                            forgotpass: true,
                          })
                        }
                      >
                        Forgot password?
                      </p>
                    </div>
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
                  <div className="social">
                    <img
                      src={google}
                      alt="Google Image"
                      onClick={signInWithGoogle}
                    />
                    <img src={fb} alt="Facebook Image" />
                  </div>
                  <div className="already-customer">
                    <p>
                      Not a Customer.{" "}
                      <a onClick={() => this.setState({ toggle: "register" })}>
                        Register
                      </a>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
