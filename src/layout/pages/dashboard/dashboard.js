import React from "react";
import "./dashboard.css";
import { motion } from "framer-motion";
import firebase from "firebase";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import empty from "./629-empty-box.json";
import emptywish from "./10000-empty-box.json";
import Card from "../../Components/Card/Card";

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 0,
  },
};

const pageTransition = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

class Dashboard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tab: props.match.params.id,
      currentUser: [],
      editProifle: false,
      name: "",
      dob: "",
      gender: "",
      phone: "",
      alt: "",
      editProifleLoading: false,
      orders: [],
      address: [],
      loading: true,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection("users")
          .where("email", "==", user.email)
          .onSnapshot((snap) => {
            snap.docChanges().forEach((change) => {
              this.setState({
                currentUser: change.doc.data(),
                loading: false,
              });
            });
          });
      } else {
        window.location.href = "/";
      }
    });
  }

  handleProfile = () => {
    this.setState({
      editProifle: true,
      name: this.state.currentUser.name,
      dob: this.state.currentUser.dob,
      gender: this.state.currentUser.gender,
      phone: this.state.currentUser.phone,
      alt: this.state.currentUser.alt,
    });
  };

  handleProfileCancel = () => {
    this.setState({
      editProifle: false,
    });
  };

  handleProfileSave = () => {
    this.setState({
      editProifleLoading: true,
    });
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          firebase
            .firestore()
            .collection("users")
            .doc(doc.id)
            .update({
              name: this.state.name,
              phone: this.state.phone,
              alt: this.state.alt,
              gender: this.state.gender,
              dob: this.state.dob,
            })
            .then(() => {
              this.setState({
                editProifleLoading: false,
                editProifle: false,
              });
              toast.success("Profile Updated");
            });
        });
      });
  };

  handleChange = (e) => {
    const { value, id } = e.target;
    this.setState({ [id]: value });
  };

  removeFromWishlist = (e) => {
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          var wishlist = doc.data().wishlist;
          var newwishlist = [];
          wishlist.map((item) => {
            if (item.email === e.email && item.id === e.id) {
            } else {
              newwishlist.push(item);
            }
          });
          firebase
            .firestore()
            .collection("users")
            .doc(doc.id)
            .update({
              wishlist: newwishlist,
            })
            .then(() => {
              toast.success(" Item removed from your wishlist");
            });
        });
      });
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lottie
              options={{ animationData: loading }}
              width={150}
              height={150}
            />
          </div>
        ) : (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ToastContainer />
            <div className="dashboard-container">
              <div className="sidebar">
                {this.state.tab === "Profile" ? (
                  <div className="menu-active">Profile</div>
                ) : (
                  <div
                    className="menu"
                    onClick={() => this.setState({ tab: "Profile" })}
                  >
                    Profile
                  </div>
                )}
                {this.state.tab === "Orders" ? (
                  <div className="menu-active">Orders</div>
                ) : (
                  <div
                    className="menu"
                    onClick={() => this.setState({ tab: "Orders" })}
                  >
                    Orders
                  </div>
                )}
                {this.state.tab === "Wishlist" ? (
                  <div className="menu-active">Wishlist</div>
                ) : (
                  <div
                    className="menu"
                    onClick={() => this.setState({ tab: "Wishlist" })}
                  >
                    Wishlist
                  </div>
                )}
                {this.state.tab === "Address" ? (
                  <div className="menu-active">Address</div>
                ) : (
                  <div
                    className="menu"
                    onClick={() => this.setState({ tab: "Address" })}
                  >
                    Address
                  </div>
                )}
              </div>
              <div className="content">
                {this.state.tab === "Profile" ? (
                  <>
                    <h1>Profile Details</h1>
                    <div className="divider"></div>
                    <div className="input-list">
                      <div className="input-group">
                        <p className="title">User Name</p>
                        {this.state.editProifle ? (
                          <input
                            id="name"
                            type="text"
                            value={this.state.name}
                            placeholder="Enter your user name"
                            onChange={this.handleChange}
                          />
                        ) : (
                          <p className="value">
                            {this.state.currentUser
                              ? this.state.currentUser.name
                              : "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="input-group">
                        <p className="title">Email</p>
                        <p className="value">
                          {this.state.currentUser
                            ? this.state.currentUser.email
                            : "N/A"}
                        </p>
                      </div>
                      <div className="input-group">
                        <p className="title">Mobile No.</p>
                        {this.state.editProifle ? (
                          <input
                            id="phone"
                            maxLength={10}
                            type="text"
                            value={this.state.phone}
                            placeholder="Enter your mobile no."
                            onChange={this.handleChange}
                          />
                        ) : (
                          <p className="value">
                            {this.state.currentUser
                              ? this.state.currentUser.phone
                                ? this.state.currentUser.phone
                                : "N/A"
                              : "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="input-group">
                        <p className="title">Gender</p>
                        {this.state.editProifle ? (
                          <div className="gender-group">
                            <div className="gender">
                              {this.state.gender === "male" ? (
                                <i className="fas fa-dot-circle activated"></i>
                              ) : (
                                <i
                                  class="far fa-circle"
                                  onClick={() =>
                                    this.setState({ gender: "male" })
                                  }
                                ></i>
                              )}
                              <p>Male</p>
                            </div>
                            <div className="gender">
                              {this.state.gender === "female" ? (
                                <i className="fas fa-dot-circle activated"></i>
                              ) : (
                                <i
                                  className="far fa-circle "
                                  onClick={() =>
                                    this.setState({ gender: "female" })
                                  }
                                ></i>
                              )}
                              <p>Female</p>
                            </div>
                          </div>
                        ) : (
                          <p className="value">
                            {this.state.currentUser
                              ? this.state.currentUser.gender
                                ? this.state.currentUser.gender
                                : "N/A"
                              : "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="input-group">
                        <p className="title">Date of Birth</p>
                        {this.state.editProifle ? (
                          <input
                            id="dob"
                            type="date"
                            maxLength={8}
                            value={this.state.dob}
                            onChange={this.handleChange}
                          />
                        ) : (
                          <p className="value">
                            {this.state.currentUser
                              ? this.state.currentUser.dob
                                ? this.state.currentUser.dob
                                : "N/A"
                              : "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="input-group">
                        <p className="title">Alternative No.</p>
                        {this.state.editProifle ? (
                          <input
                            id="alt"
                            maxLength={10}
                            value={this.state.alt}
                            type="text"
                            placeholder="Enter an alternative no."
                            onChange={this.handleChange}
                          />
                        ) : (
                          <p className="value">
                            {this.state.currentUser
                              ? this.state.currentUser.alt
                                ? this.state.currentUser.alt
                                : "N/A"
                              : "N/A"}
                          </p>
                        )}
                      </div>
                    </div>
                    {this.state.editProifle ? (
                      <>
                        {this.state.editProifleLoading ? (
                          <div className="loader-container">
                            <div className="loader">
                              <Lottie options={{ animationData: loading }} />
                            </div>
                          </div>
                        ) : (
                          <div className="button-group">
                            <div
                              className="profile-cancel-button"
                              onClick={this.handleProfileCancel}
                            >
                              Cancel
                            </div>
                            <div
                              className="profile-save-button"
                              onClick={this.handleProfileSave}
                            >
                              Save
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div
                        className="profile-edit-button"
                        onClick={this.handleProfile}
                      >
                        Edit Profile
                      </div>
                    )}
                  </>
                ) : null}
                {this.state.tab === "Orders" ? (
                  <>
                    <h1>Your Orders</h1>
                    <div className="divider"></div>
                    {this.state.currentUser.orders.length === 0 ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Lottie
                          options={{ animationData: empty }}
                          width={200}
                          height={200}
                        />
                        <a href="/" className="empty">
                          Take me back to shopping
                        </a>
                      </div>
                    ) : null}
                  </>
                ) : null}
                {this.state.tab === "Wishlist" ? (
                  <>
                    <h1>Your Wishlist Items</h1>
                    <div className="divider"></div>
                    {this.state.currentUser.wishlist.length === 0 ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Lottie
                          options={{ animationData: emptywish }}
                          width={300}
                          height={300}
                        />
                        <a href="/" className="empty">
                          Take me back to shopping
                        </a>
                      </div>
                    ) : (
                      <div className="wishlist-container">
                        {this.state.currentUser.wishlist.map((item) => {
                          return (
                            <Card
                              item={item}
                              removeFromWishlist={(e) =>
                                this.removeFromWishlist(e)
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : null}
                {this.state.tab === "Address" ? (
                  <>
                    <h1>Your Address List</h1>
                    <div className="divider"></div>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </>
    );
  }
}

export default Dashboard;
