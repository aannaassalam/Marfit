import React from "react";
import "./dashboard.css";
import { motion } from "framer-motion";
import firebase from "firebase";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import toaster from "toasted-notes";
import empty from "./629-empty-box.json";
import emptywish from "./10000-empty-box.json";
import Card from "../../Components/Card/Card";
import { CopyToClipboard } from "react-copy-to-clipboard";
import refer from "../../../assets/refer.json";
import moment from "moment";
import { Link } from "react-router-dom";

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
      wishlist: [],
      copy: false,
      fetchedAddresses: [],
      addTab: false,
      points: "",
      orderID: [],
      orderedProduct: [],
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
              this.setState(
                {
                  currentUser: change.doc.data(),
                  points: change.doc.data().points,
                  fetchedAddresses: change.doc.data().addresses,
                  loading: false,
                  orderID: change.doc.data().orders,
                },
                () => {
                  this.state.orderID.forEach((item) => {
                    firebase
                      .firestore()
                      .collection("orders")
                      .doc(item)
                      .get()
                      .then((doc) => {
                        var products = doc.data().products;
                        var finalProduct = [];
                        products.forEach((item) => {
                          firebase
                            .firestore()
                            .collection("products")
                            .doc(item.id)
                            .get()
                            .then((prod) => {
                              var product = {};
                              product = prod.data();
                              product.productID = item.id;
                              product.quantity = item.quantity;
                              finalProduct.push(product);
                              var data = doc.data();
                              data.products = finalProduct;
                              this.setState({
                                orders: [...this.state.orders, data],
                              });
                            });
                        });
                      });
                  });
                }
              );
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
              toaster.notfiy("Profile Updated");
            });
        });
      });
  };

  handleChange = (e) => {
    const { value, id } = e.target;
    this.setState({ [id]: value });
  };

  handleDelete(index) {
    console.log(index);
    var addresses = this.state.fetchedAddresses;
    console.log(addresses);
    var newAddresses = addresses.filter(
      (address) => address !== addresses[index]
    );
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
              addresses: newAddresses,
            })
            .then(() => {
              this.setState({
                fetchedAddress: newAddresses,
              });
            });
        });
      });
  }

  handleAdd() {
    var addresses = this.state.fetchedAddresses;
    if (this.state.address.length > 0) {
      document.getElementById("address").value = "";
      addresses.push(this.state.address);
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
                addresses: addresses,
              })
              .then(() => {
                this.setState({
                  fetchedAddresses: addresses,
                  addTab: false,
                });
              });
          });
        });
    }
  }

  render() {
    console.log(this.state.orders);
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
                {this.state.tab === "Refer" ? (
                  <div className="menu-active">Refer & Earn</div>
                ) : (
                  <div
                    className="menu"
                    onClick={() => this.setState({ tab: "Refer" })}
                  >
                    Refer & Earn
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
                    {this.state.orders.length === 0 ? (
                      <div
                        className="ordersdiv"
                        style={{
                          width: "100%",
                          height: "90%",
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
                        <p>
                          <span>EMPTY ORDER LIST</span>
                          <br />
                          You have no items in your orderlist
                        </p>
                        <a href="/" className="empty">
                          Take me back to shopping
                        </a>
                      </div>
                    ) : (
                      <div className="order-container">
                        {this.state.orders.map((item) =>
                          item.products.map((data) => (
                            <Link
                              to={{
                                pathname: "/Dashboard/Orders/" + item.orderID,
                                id: data.productID,
                                quantity: data.quantity,
                              }}
                              className="orderList"
                            >
                              <div className="part1">
                                <img src={data.images[0]} alt="img" />
                                <div className="part1-detail">
                                  <h5>{data.title}</h5>
                                  <p>Color : Black</p>
                                  <p>Quantity : {data.quantity}</p>
                                  {/* <p>Order date : {moment(item.date.toDate()).format('ll')}</p> */}
                                </div>
                              </div>
                              <div className="part2">
                                <p>&#8377;{item.total}</p>
                              </div>
                              <div className="part3">
                                <div className="one">
                                  <div className="indictionCircle"></div>
                                  <p className="deliveryState">Delivered</p>
                                </div>
                                <p className="deliveryDate">
                                  Delivered on :{" "}
                                  {moment(item.date.toDate()).format("ll")}
                                </p>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
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
                          height: "90%",
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
                          var product = {};
                          product.id = item;
                          return <Card key={item} item={product} />;
                        })}
                      </div>
                    )}
                  </>
                ) : null}
                {this.state.tab === "Address" ? (
                  <>
                    <h1>Your Address List</h1>
                    <div className="divider"></div>
                    <div className="address-cont">
                      {this.state.fetchedAddresses.map((address, index) => (
                        <div className="address" key={index}>
                          <div className="paras">
                            <p>Address {index + 1} :</p>
                            <p>{address}</p>
                          </div>
                          <div
                            className="minus"
                            onClick={() => {
                              this.handleDelete(index);
                            }}
                          >
                            <i className="fas fa-minus-circle"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                    {this.state.addTab ? (
                      <div className="addtab">
                        <div className="inputs">
                          <input
                            type="text"
                            name="address"
                            id="address"
                            onChange={this.handleChange}
                            placeholder="Address"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              this.handleAdd();
                            }}
                          >
                            Add
                          </button>
                        </div>
                        <i
                          className="fas fa-times"
                          onClick={() => {
                            this.setState({ addTab: false });
                          }}
                        ></i>
                      </div>
                    ) : (
                      <div
                        className="newAddress"
                        onClick={() => {
                          this.setState({ addTab: true });
                        }}
                      >
                        <i className="fas fa-plus-circle"></i>
                        <p>ADD NEW ADDRESS</p>
                      </div>
                    )}
                  </>
                ) : null}
                {this.state.tab === "Refer" ? (
                  <>
                    <h1>Refer & Earn</h1>
                    <div className="divider"></div>
                    <div className="referMain">
                      <div className="referanimation">
                        <Lottie
                          options={{ animationData: refer }}
                          width={300}
                          height={300}
                          style={{ position: "absolute", top: 0 }}
                        />
                      </div>
                      <div className="referCode">
                        <div className="referInput">
                          <input
                            type="text"
                            value={this.state.currentUser.referalID}
                            disabled
                            id="referalText"
                          />
                          <CopyToClipboard
                            text={this.state.currentUser.referalID}
                          >
                            <button
                              type="button"
                              className={
                                this.state.copy ? "copiedButton" : "copyButton"
                              }
                              onClick={() => {
                                this.setState({ copy: true });
                                setTimeout(() => {
                                  this.setState({
                                    copy: false,
                                  });
                                }, 1000);
                              }}
                            >
                              {!this.state.copy ? (
                                <>
                                  <p>Copy</p>
                                  <i className="far fa-clipboard"></i>
                                </>
                              ) : (
                                <>
                                  <p>Copied</p>
                                  <i className="fas fa-check"></i>
                                </>
                              )}
                            </button>
                          </CopyToClipboard>
                        </div>
                        {/* <div className="referSocial">
                        <FacebookShareButton url={sharecode}>
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                      </div> */}
                      </div>
                    </div>
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
