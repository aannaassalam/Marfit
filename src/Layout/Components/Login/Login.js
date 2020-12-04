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
import axios from "axios";

const otpGenerator = require("otp-generator");

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    for (var i = 1; i <= 4; i++) {
      this["c" + i] = React.createRef();
    }
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
      showNext: false,
      showOTP: false,
      showPassword: false,
      c1: "",
      c2: "",
      c3: "",
      c4: "",
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

  handleRegister = () => {
    var otp = this.state.c1 + this.state.c2 + this.state.c3 + this.state.c4;
    if (otp === this.state.otp) {
      this.setState({
        verify: true,
      });
      if (this.state.referal.length > 0) {
        firebase
          .firestore()
          .collection("users")
          .where("referalID", "==", this.state.referal)
          .get()
          .then((snap) => {
            if (snap.size > 0) {
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
                      .then((res) => {
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
                            points: 10,
                            uid: res.user.uid,
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
                            // window.location.href = "/";
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
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(
            (res) => {
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
                  points: 0,
                  uid: res.user.uid,
                })
                .then((res) => {
                  var referal =
                    res.id.substr(16, 4) + this.state.email.substr(0, 2);
                  firebase.firestore().collection("users").doc(res.id).update({
                    referalID: referal,
                  });
                  this.setState({
                    loading: false,
                  });
                  this.props.login(true);
                  this.props.close(false);
                  const data = {
                    email: this.state.email,
                    subject: "Marfit",
                    message: "You just got registered to mafit website, email",
                  };
                  axios.post("http://localhost:5000/api/sendemail", data);
                  window.location.href = "/";
                })
                .catch((err) => {
                  toaster.notify(err.message);
                  this.setState({
                    loading: false,
                  });
                });
            },
            firebase
              .firestore()
              .collection("users")
              .where("referalID", "==", this.state.referal)
              .get()
              .then((snap) => {
                if (snap.size > 0) {
                  var id = "";
                  var points = "";
                  snap.docChanges().forEach((change) => {
                    id = change.doc.id;
                    points = change.doc.data().points + 10;
                    firebase.firestore().collection("users").doc(id).update({
                      points: points,
                    });
                  });
                }
              })
          )
          .catch((err) => {
            toaster.notify(err.message);
            this.setState({
              loading: false,
            });
          });
      }
    } else {
      toaster.notify("Invalid OTP");
    }
  };

  handleOTP = (e) => {
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
    } else {
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", this.state.email)
        .get()
        .then(async (snap) => {
          if (snap.size === 0) {
            var otp = await otpGenerator.generate(4, {
              upperCase: false,
              specialChars: false,
              alphabets: false,
            });
            this.setState({
              otp: otp,
            });
            var data = {
              message: `Hey, your OTP is ${otp}`,
              email: this.state.email,
              subject: "Verify your Mamaeatz Account",
            };
            var resp = await axios.post(
              "http://localhost:5000/api/sendemail",
              data
            );
            console.log(resp);
            if (resp.data !== null) {
              this.setState({
                showOTP: true,
                loading: false,
              });
              this.c1.current.focus();
            } else {
              alert("none");
            }
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
            snap.forEach((doc) => {
              firebase
                .auth()
                .signInWithEmailAndPassword(
                  this.state.email,
                  this.state.password
                )
                .then((res) => {
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(doc.id)
                    .update({
                      uid: res.user.uid,
                    })
                    .then(() => {
                      this.setState({
                        loading: false,
                      });
                      this.props.login(true);
                      this.props.close(false);
                      const data = {
                        email: this.state.email,
                        subject: "Marfit",
                        message: "You just login to mafit website, email",
                      };
                      axios.post("http://localhost:5000/api/sendemail", data);
                    });
                })
                .catch((err) => {
                  toaster.notify(err.message);
                  this.setState({
                    loading: false,
                  });
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

  handlePhoneLogin = () => {
    this.setState({
      loading: true,
    });
    console.log("Phone Login");
    firebase
      .firestore()
      .collection("users")
      .where("phone", "==", this.state.email)
      .get()
      .then((snap) => {
        if (snap.size > 0) {
          snap.forEach((doc) => {
            firebase
              .auth()
              .signInAnonymously()
              .then((res) => {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(doc.id)
                  .update({
                    uid: res.user.uid,
                  })
                  .then(() => {
                    this.setState({
                      loading: false,
                    });
                    this.props.login(true);
                    this.props.close(false);
                    const data = {
                      email: this.state.email,
                      subject: "Marfit",
                      message:
                        "You just login to mafit website, We welcome you",
                    };
                    axios.post("http://localhost:5000/api/sendemail", data);
                  })
                  .catch((err) => {
                    console.log(err);
                    this.setState({
                      loading: false,
                    });
                  });
              });
          });
        } else {
          this.setState({
            loading: false,
          });
          alert("No such account found with this phone number");
        }
      });
  };

  handleNext = async () => {
    if (this.state.email === "") {
      alert("Please enter a valid email or phone number");
    }
    if (!this.state.email.includes("@") && this.state.email.length === 10) {
      // const message = "Please enter this OTP to verify your login: 4036";
      // var data = {
      //   apikey: "aP2UPmYzGCo-LZzL6YvkaHmEO6EzazQYQKwBA83czl",
      //   numbers: ["8017036489"],
      //   sender: "TXTLCL",
      //   message: "1024",
      // };
      // var res = await axios.post("http://localhost:5000/api/sendMessage", data);
      // console.log(res.data);
      this.setState({
        showOTP: true,
        showNext: true,
      });
    } else if (this.state.email.includes("@")) {
      this.setState({
        showNext: true,
        showPassword: true,
      });
    }
  };

  handleGoogleLogin = () => {
    var props = this.props;
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      login_hint: "user@example.com",
    });
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        firebase
          .firestore()
          .collection("users")
          .where("email", "==", user.email)
          .get()
          .then((snap) => {
            if (snap.size === 0) {
              firebase
                .firestore()
                .collection("users")
                .add({
                  email: user.email,
                  name: user.displayName,
                  orders: [],
                  addresses: [],
                  phone: "",
                  dob: "",
                  gender: "",
                  alt: "",
                  cart: [],
                  wishlist: [],
                  referalID: "",
                  points: 0,
                  uid: user.uid,
                })
                .then(() => {
                  props.login(true);
                  props.close(false);
                })
                .catch((err) => {
                  toaster.notify(err.message);
                });
            } else {
              props.login(true);
              props.close(false);
            }
          });
        // ...
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleFacebookLogin = () => {
    var props = this.props;
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      login_hint: "user@example.com",
    });
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        firebase
          .firestore()
          .collection("users")
          .where("email", "==", user.email)
          .get()
          .then((snap) => {
            if (snap.size === 0) {
              firebase
                .firestore()
                .collection("users")
                .add({
                  email: user.email,
                  name: user.displayName,
                  orders: [],
                  addresses: [],
                  phone: "",
                  dob: "",
                  gender: "",
                  alt: "",
                  cart: [],
                  wishlist: [],
                  referalID: "",
                  points: 0,
                  uid: user.uid,
                })
                .then(() => {
                  props.login(true);
                  props.close(false);
                })
                .catch((err) => {
                  toaster.notify(err.message);
                });
            } else {
              props.login(true);
              props.close(false);
            }
          });
        // ...
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleChangeCode = (e) => {
    var { id, value } = e.target;
    this.setState(
      {
        [id]: value,
      },
      () => {
        console.log(id);
        var num = parseInt(id[1]) + 1;
        var num2 = parseInt(id[1]) - 1;
        var num3 = parseInt(id[1]);
        if (num < 5 && value && num3 !== 4) {
          this["c" + num].current.focus();
        } else if (value === "" && num2 > 0) {
          this["c" + num2].current.focus();
        } else if (num3 === 4) {
          if (this.state.toggle === "register") {
            this.handleRegister();
          } else {
            this.handleLogin();
          }
        }
      }
    );
  };

  render() {
    var inpuCode = [];
    for (var i = 1; i <= 4; i++) {
      inpuCode.push("c" + i);
    }
    return (
      <div className="login-container">
        <div className="login">
          <i
            className="fa fa-times fa-1x"
            onClick={() => {
              this.props.close(false);
              this.props.handleOverflow(false);
            }}
          ></i>
          {/* <button onClick={this.handlePhoneLogin}>Phone Login</button> */}
          <div className="section-1">
            <img src={loginBag} alt="" />
          </div>
          {this.state.toggle === "register" ? (
            <div className="register-form">
              <div className="marfit-img">
                <img src={logo} alt="Marfit logo" />
                <img src={marfit} alt="Marfit title" />
              </div>
              {this.state.toggle === "register" && this.state.showOTP ? (
                <div className="otp-cont">
                  <div className="vrf">
                    <h1>Enter verification code</h1>
                    <p>
                      Enter 4 digit verification code send to your email address
                    </p>
                  </div>
                  <div className="verification-cont">
                    <div className="code-container">
                      {inpuCode.map((item) => {
                        return (
                          <div className="code-verification">
                            <input
                              maxLength={1}
                              id={item}
                              type="text"
                              value={this.state[item]}
                              onChange={this.handleChangeCode}
                              name={item}
                              ref={this[item]}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="button-verification">
                      <button
                        className="btn-cancel"
                        onClick={() => {
                          this.setState({ showOTP: false, otp: 0 });
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-register"
                        onClick={this.handleRegister}
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                    <button
                      type="button"
                      className="btn-next"
                      id="btn"
                      onClick={this.handleOTP}
                    >
                      Register
                    </button>
                  )}
                </>
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
                  onClick={this.handleGoogleLogin}
                />
                {/* <img src={fb} alt='Facebook Image' /> */}
              </div>
              <div className="already-customer">
                <p>
                  Already a Customer?{" "}
                  <a
                    onClick={() =>
                      this.setState({ toggle: "login", showOTP: false })
                    }
                  >
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
                      value={this.state.resetEmail}
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
                  {this.state.toggle === "login" && this.state.showOTP ? (
                    <div className="otp-cont">
                      <div className="vrf">
                        <h1>Enter verification code</h1>
                        <p>
                          Enter 4 digit verification code send to your email
                          address
                        </p>
                      </div>
                      <div className="verification-cont">
                        <div className="code-container">
                          {inpuCode.map((item) => {
                            return (
                              <div className="code-verification">
                                <input
                                  maxLength={1}
                                  id={item}
                                  type="text"
                                  value={this.state[item]}
                                  onChange={this.handleChangeCode}
                                  name={item}
                                  ref={this[item]}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : this.state.showPassword ? (
                    <div className="input-fields">
                      <input
                        type="email"
                        name="email"
                        id="user-email"
                        value={this.state.email}
                        placeholder="Enter Email"
                        onChange={this.handleChange}
                      />
                      <div className="pass">
                        <input
                          type="password"
                          name="password"
                          value={this.state.password}
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
                  ) : (
                    <>
                      <div className="input-fields">
                        <input
                          type="email"
                          name="email"
                          id="user-email"
                          placeholder="Enter Email or Phone Number"
                          onChange={this.handleChange}
                        />
                      </div>
                    </>
                  )}

                  {this.state.showNext ? (
                    <>
                      {this.state.loadingNext ? (
                        <Lottie
                          options={{ animationData: loading }}
                          width={80}
                          height={80}
                        />
                      ) : (
                        <>
                          {this.state.showOTP ? (
                            <button
                              type="button"
                              className="btn-next"
                              onClick={this.handlePhoneLogin}
                            >
                              Verify & Login
                            </button>
                          ) : (
                            <button
                              className="btn-next"
                              type="button"
                              onClick={this.handleLogin}
                            >
                              Login
                            </button>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {this.state.loadingNext ? (
                        <Lottie
                          options={{ animationData: loading }}
                          width={80}
                          height={80}
                        />
                      ) : (
                        <button
                          className="btn-next"
                          type="button"
                          onClick={this.handleNext}
                        >
                          Next
                        </button>
                      )}
                    </>
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
                      onClick={this.handleGoogleLogin}
                    />
                    {/* <img src={fb} alt='Facebook Image' /> */}
                  </div>
                  <div className="already-customer">
                    <p>
                      Not a Customer.{" "}
                      <a
                        onClick={() =>
                          this.setState({ toggle: "register", showOTP: false })
                        }
                      >
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
