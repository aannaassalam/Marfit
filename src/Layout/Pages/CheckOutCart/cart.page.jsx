import React from "react";
import { motion } from "framer-motion";
import "./cart.style.css";
import firebase from "firebase";

import cart from "./supermarket.svg";
import loc from "./location.svg";
import pay from "./pay.svg";
import razorpay from "./razorpay.png";
import cod from "./cod.png";
import paytm from "./paytm.png";
import phonepe from "./phonepe.png";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import empty from "./629-empty-box.json";
import toaster from "toasted-notes";
import CheckOutCard from "../../Components/CheckOutCard/CheckOutCard";

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

class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: 1,
			modal: "modal-address",
			addresses: [],
			saddresses: [],
			isDefault: false,
			loading: true,
			currentUser: [],
			total: 0,
			shipping: 0,
			rental: 0,
			deposit: 0,
			address: {},
			city: "",
			state: "",
			pin: "",
			cname: "",
			cphone: "",
			add: "",
			process1: "process1",
			process2: "process2",
			editAddress: false,
			ogname: "",
			ogaddress: "",
			paymentTab: 1,
			cart: [],
			products: [],
			addressType: "default",
			points: 0,
		};
	}
	async componentDidMount() {
		firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				var snap = await firebase.firestore().collection("users").where("email", "==", user.email).get();
				if (snap) {
					snap.forEach(async (doc) => {
						var currentUser = doc.data();
						currentUser.id = doc.id;
						this.setState({
							currentUser,
							cart: currentUser.cart,
							loading: false,
						});
						var data = doc.data().cart;
						var addresses = doc.data().addresses;
						var x = {};
						var newAddresses = [];

						if (addresses.length > 0) {
							addresses.map((add) => {
								if (add.default) {
									x = add;
								} else {
									newAddresses.push(add);
								}
							});
							newAddresses.unshift(x);
							this.setState({
								addresses: newAddresses,
								address: x,
							});
						}
						this.setState({
							total: this.state.shipping + this.state.deposit + this.state.rental,
						});
						var products = [];
						var rental = 0;
						var shipping = 0;
						for (var i = 0; i < doc.data().cart.length; i++) {
							var product = await firebase.firestore().collection("products").doc(doc.data().cart[i].id).get();
							var prod = product.data();
							prod.id = product.id;
							products.push(prod);
							rental = rental + prod.sp * doc.data().cart[i].quantity;
							shipping = shipping + prod.shippingCharge;
						}
						var total = shipping + rental;
						this.setState({
							products,
							rental,
							shipping,
							total,
							points: currentUser.points < total ? currentUser.points : total,
						});
					});
				}
				var snap2 = await firebase.firestore().collection("settings").get();
				if (snap2) {
					snap2.forEach((doc) => {
						this.setState({
							saddresses: doc.data().stores,
						});
					});
				}
			} else {
				window.location.href = "/";
			}
		});
	}

	handleChange = (e) => {
		const { value, name } = e.target;
		this.setState({ [name]: value });
	};

	handleIsDefault = () => {
		this.setState({
			isDefault: !this.state.isDefault,
		});
	};

	handleDelete = (e) => {
		firebase
			.firestore()
			.collection("users")
			.where("email", "==", firebase.auth().currentUser.email)
			.get()
			.then((snap) => {
				snap.forEach((doc) => {
					var cart = doc.data().cart;
					var newcart = [];
					cart.map((item) => {
						if (item.id === e.id) {
						} else {
							newcart.push(item);
						}
					});
					this.setState(
						{
							cart: [],
						},
						() => {
							this.setState({
								cart: newcart,
							});
						}
					);
					firebase
						.firestore()
						.collection("users")
						.doc(doc.id)
						.update({
							cart: newcart,
						})
						.then(() => {
							toaster.notify("Item removed from your cart");
						})
						.catch((err) => {
							toaster.notify(err.message);
						});
				});
			});
	};

	handleRefresh = () => {
		window.location.reload();
	};

	handleSubmit = () => {
		var arr = {};
		arr["cname"] = this.state.cname;
		arr["cphone"] = this.state.cphone;
		arr["address"] = this.state.add;
		arr["pin"] = this.state.pin;
		arr["city"] = this.state.city;
		arr["state"] = this.state.state;
		arr["default"] = this.state.isDefault ? this.state.isDefault : this.state.addresses.length === 0 ? true : false;

		firebase
			.firestore()
			.collection("users")
			.where("email", "==", firebase.auth().currentUser.email)
			.get()
			.then((response) => {
				response.forEach((doc) => {
					console.log(doc.data());
					var oldAddresses = doc.data().addresses;
					var found = false;
					oldAddresses.map((add) => {
						if (add.cname === arr.cname && add.address === arr.address) {
							found = true;
						}
					});
					if (found === false) {
						if (this.state.isDefault) {
							oldAddresses.map((add) => {
								add["default"] = false;
							});
							oldAddresses.push(arr);
							console.log(oldAddresses);
							firebase
								.firestore()
								.collection("users")
								.doc(doc.id)
								.update({
									addresses: oldAddresses,
								})
								.then(() => {
									this.setState({
										modal: "modal-address",
										city: "",
										state: "",
										pin: "",
										cname: "",
										cphone: "",
										add: "",
										address: arr,
										addresses: oldAddresses,
									});
								});
						} else if (oldAddresses.length === 0) {
							arr["default"] = true;
							oldAddresses.push(arr);
							console.log(oldAddresses);
							firebase
								.firestore()
								.collection("users")
								.doc(doc.id)
								.update({
									addresses: oldAddresses,
								})
								.then(() => {
									this.setState({
										modal: "modal-address",
										city: "",
										state: "",
										pin: "",
										cname: "",
										cphone: "",
										add: "",
										address: arr,
										addresses: oldAddresses,
									});
								});
						} else {
							oldAddresses.push(arr);
							console.log(oldAddresses);
							firebase
								.firestore()
								.collection("users")
								.doc(doc.id)
								.update({
									addresses: oldAddresses,
								})
								.then(() => {
									this.setState({
										modal: "modal-address",
										city: "",
										state: "",
										pin: "",
										cname: "",
										cphone: "",
										add: "",
										address: arr,
										addresses: oldAddresses,
									});
								});
						}
					} else {
						toaster.notify("Address already exists!");
					}
				});
			});
	};

	handleSelectAddress = (e) => {
		this.setState({
			address: e,
		});
	};

	handleDeleteAddress = (e) => {
		firebase
			.firestore()
			.collection("users")
			.where("email", "==", firebase.auth().currentUser.email)
			.get()
			.then((snap) => {
				snap.forEach((doc) => {
					var addresses = doc.data().addresses;
					var newAddresses = [];
					addresses.map((add) => {
						if (add.cname === e.cname && add.address === e.address) {
						} else {
							newAddresses.push(add);
						}
					});
					if (newAddresses.length === 0) {
						this.setState({
							address: {},
							addresses: [],
						});
					}
					if (newAddresses.length === 1) {
						this.setState({
							address: newAddresses[0],
						});
					}
					firebase.firestore().collection("users").doc(doc.id).update({
						addresses: newAddresses,
					});
				});
			});
	};

	handleEditAddressShow = (e) => {
		this.setState({
			editAddress: true,
			modal: "modal-address-active",
			city: e.city,
			state: e.state,
			pin: e.pin,
			cname: e.cname,
			cphone: e.cphone,
			add: e.address,
			isDefault: e.default,
			ogname: e.cname,
			ogaddress: e.address,
		});
	};

	handleEditAddress = () => {
		firebase
			.firestore()
			.collection("users")
			.where("email", "==", firebase.auth().currentUser.email)
			.get()
			.then((snap) => {
				snap.forEach((doc) => {
					var addresses = doc.data().addresses;
					if (this.state.isDefault === false) {
						addresses.map((add) => {
							if (add.cname === this.state.ogname && add.address === this.state.ogaddress) {
								add["cname"] = this.state.cname;
								add["cphone"] = this.state.cphone;
								add["address"] = this.state.add;
								add["pin"] = this.state.pin;
								add["city"] = this.state.city;
								add["state"] = this.state.state;
								add["default"] = this.state.isDefault;
							}
						});
						var found = false;
						addresses.map((add) => {
							if (add["default"] === true) {
								found = true;
							}
						});
						if (found === false) {
							toaster.notify("Atleast one default address is required");
						} else if (found === true) {
							firebase
								.firestore()
								.collection("users")
								.doc(doc.id)
								.update({
									addresses: addresses,
								})
								.then(() => {
									toaster.notify("Address Updated");
									this.setState({
										modal: "modal-address",
										city: "",
										state: "",
										pin: "",
										cname: "",
										cphone: "",
										add: "",
										ogaddress: "",
										ogname: "",
									});
								});
						}
					} else {
						addresses.map((add) => {
							add["default"] = false;
						});
						addresses.map((add) => {
							if (add.cname === this.state.ogname && add.address === this.state.ogaddress) {
								add["cname"] = this.state.cname;
								add["cphone"] = this.state.cphone;
								add["address"] = this.state.add;
								add["pin"] = this.state.pin;
								add["city"] = this.state.city;
								add["state"] = this.state.state;
								add["default"] = this.state.isDefault;
							}
						});
						firebase
							.firestore()
							.collection("users")
							.doc(doc.id)
							.update({
								addresses: addresses,
							})
							.then(() => {
								toaster.notify("Address Updated");
								this.setState({
									modal: "modal-address",
									city: "",
									state: "",
									pin: "",
									cname: "",
									cphone: "",
									add: "",
									ogaddress: "",
									ogname: "",
								});
							});
					}
				});
			});
	};

	handlePayment = () => {
		if (this.state.total - this.state.points > 0) {
			if (this.state.paymentTab === 1) {
				this.handleRazorPayment();
			}
			if (this.state.paymentTab === 2) {
				alert("COD");
			}
		}
	};

	handleRazorPayment = () => {
		var total = Math.round((this.state.total - this.state.points) * 100);
		let options = {
			key: "rzp_live_YmYlELv3yfrWe6",
			amount: total, // 2000 paise = INR 20, amount in paisa
			name: "Marfit",
			description: "",
			image: "/favicon-96x96.png",
			handler: function (response) {
				console.log(response);
			},
			prefill: {
				name: this.state.currentUser.name,
				email: firebase.auth().currentUser.email,
			},
			notes: {
				address: "Hello World",
			},
			theme: {
				color: "#393280",
			},
		};

		let rzp = new window.Razorpay(options);
		rzp.open();
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
						}}>
						<Lottie options={{ animationData: loading }} width={150} height={150} />
					</div>
				) : (
					<>
						{this.state.cart.length === 0 ? (
							<div
								style={{
									width: "100%",
									height: "100vh",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
								}}>
								<Lottie options={{ animationData: empty }} width={320} height={320} />
								<p
									style={{
										fontSize: "30px",
										color: "#313131",
										marginBottom: "10px",
									}}>
									Your cart is empty
								</p>
								<p style={{ color: "#717171", marginBottom: "15px" }}>Add items in your cart and come back later to process checkout.</p>
								<a
									href='/'
									style={{
										backgroundColor: "#fb6b25",
										textDecoration: "none",
										padding: "0.8rem 1rem",
										color: "#fff",
										borderRadius: "3px",
									}}>
									Continue to shopping
								</a>
							</div>
						) : (
							<motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition} className='cart-container'>
								<div className='cart-section'>
									<div className='left'>
										<div className='head'>
											<div className='head-text'>
												<div className='sub'>
													<p>Your Cart</p>
													<div className='line'></div>
												</div>

												{this.state.currentUser.cart.length > 0 ? (
													<div className='item-count'>
														<p>
															{this.state.currentUser.cart.length} {this.state.currentUser.cart.length === 1 ? "item" : " items"}
														</p>
													</div>
												) : null}
											</div>
											<div className='head-amt'></div>
										</div>

										<div className='body'>
											{this.state.cart.map((info, index) => {
												return (
													<CheckOutCard handleDelete={this.handleDelete} info={info} key={index} currentUser={this.state.currentUser} handleRefresh={this.handleRefresh} />
												);
											})}
										</div>
									</div>

									<div className='right'>
										<div className='coupon-box'>
											<div className='coupon'>
												<input type='text' placeholder='Enter coupon code' />
												<button type='button'>APPLY</button>
											</div>
										</div>
										<div className='process-box'>
											<div className='process-header'>
												<div className='step'>
													{this.state.tab === 1 ? (
														<p
															className='active'
															onClick={() =>
																this.setState({
																	tab: 1,
																	process1: "process1",
																	process2: "process2",
																})
															}>
															CART
														</p>
													) : (
														<>
															{this.state.tab > 1 ? (
																<p
																	className='done'
																	onClick={() =>
																		this.setState({
																			tab: 1,
																			process1: "process1",
																			process2: "process2",
																		})
																	}>
																	CART
																</p>
															) : (
																<p onClick={() => this.setState({ tab: 1 })}>CART</p>
															)}
														</>
													)}
												</div>
												<div className={this.state.process1}></div>
												<div className='step'>
													{this.state.tab === 2 ? (
														<p className='active' onClick={() => this.setState({ tab: 2, process2: "process2" })}>
															ADDRESS
														</p>
													) : (
														<>
															{this.state.tab > 2 ? (
																<p
																	className='done'
																	onClick={() =>
																		this.setState({
																			tab: 2,
																			process2: "process2",
																		})
																	}>
																	ADDRESS
																</p>
															) : (
																<p>ADDRESS</p>
															)}
														</>
													)}
												</div>
												<div className={this.state.process2}></div>
												<div className='step'>
													{this.state.tab === 3 ? (
														<p className='active' onClick={() => this.setState({ tab: 3 })}>
															PAYMENT
														</p>
													) : (
														<>
															{this.state.tab > 3 ? (
																<p className='done' onClick={() => this.setState({ tab: 3 })}>
																	PAYMENT
																</p>
															) : (
																<p>PAYMENT</p>
															)}
														</>
													)}
												</div>
											</div>

											<div className='process-body'>
												{this.state.tab === 1 ? (
													<div className='section'>
														<div className='title'>
															<img src={cart} alt='cart-summary' />
															<p>Cart Summary</p>
														</div>
														<div className='body'>
															<p>PRICE DETAILS</p>
															<div className='line'></div>
															<div className='rent'>
																<p>Total</p>
																<span>&#8377; {this.state.rental}</span>
															</div>

															<div className='rent'>
																<p>Shipping Fees</p>
																<span>{this.state.shipping > 0 ? "₹ " + this.state.shipping : "Free"}</span>
															</div>

															<div className='rent'>
																<p>Reddem Points</p>
																<span>- &#8377; {this.state.points}</span>
															</div>

															<div className='total'>
																<p>Sub Total</p>
																<span>&#8377; {this.state.total - this.state.points}</span>
															</div>

															<div className='next-button'>
																<button
																	type='button'
																	onClick={() =>
																		this.setState({
																			tab: 2,
																			process1: "process1-active",
																		})
																	}>
																	CHOOSE ADDRESS
																</button>
															</div>
														</div>
													</div>
												) : this.state.tab === 2 ? (
													<div className='address-section'>
														<div className='title'>
															<img src={loc} alt='address-icon' />
															<p>Address Details</p>
															<div className='address-type'>
																<h1
																	className={this.state.addressType !== "default" ? null : "active"}
																	onClick={() => {
																		this.setState({ addressType: "default" });
																	}}>
																	My Addresses
																</h1>
																<h1
																	className={this.state.addressType !== "store" ? null : "active"}
																	onClick={() => {
																		this.setState({ addressType: "store" });
																	}}>
																	Store Pickup
																</h1>
															</div>
														</div>
														<div className='body'>
															<div className='address-card-list'>
																{this.state.addressType === "default" ? (
																	<>
																		{this.state.addresses.map((add) => {
																			return (
																				<div className='address-card'>
																					<div className='check-address'>
																						{this.state.address.cname === add.cname && this.state.address.address === add.address ? (
																							<i class='far fa-dot-circle'></i>
																						) : (
																							<i class='far fa-circle' onClick={() => this.handleSelectAddress(add)}></i>
																						)}
																					</div>
																					<div className='address-details'>
																						<h1>{add.cname}</h1>
																						<p>{add.address}</p>
																						<p>
																							{add.city} -{add.pin}, {add.state}
																						</p>
																						<p>
																							Mobile : <span>{add.cphone}</span>
																						</p>
																					</div>
																					<div className='address-actions'>
																						<i class='far fa-edit' onClick={() => this.handleEditAddressShow(add)}></i>
																						<i class='far fa-trash-alt' onClick={() => this.handleDeleteAddress(add)}></i>
																					</div>
																				</div>
																			);
																		})}
																	</>
																) : (
																	<>
																		{this.state.saddresses.map((add) => {
																			return (
																				<div className='address-card'>
																					<div className='check-address'>
																						{this.state.address.cname === add.cname && this.state.address.address === add.address ? (
																							<i class='far fa-dot-circle'></i>
																						) : (
																							<i class='far fa-circle' onClick={() => this.handleSelectAddress(add)}></i>
																						)}
																					</div>
																					<div className='address-details'>
																						<h1>{add.cname}</h1>
																						<p>{add.address}</p>
																						<p>
																							{add.city} -{add.pin}, {add.state}
																						</p>
																						<p>
																							Mobile : <span>{add.cphone}</span>
																						</p>
																					</div>
																					<div className='address-actions'>
																						<i class='far fa-edit' onClick={() => this.handleEditAddressShow(add)}></i>
																						<i class='far fa-trash-alt' onClick={() => this.handleDeleteAddress(add)}></i>
																					</div>
																				</div>
																			);
																		})}
																	</>
																)}
															</div>
															{this.state.addresses.length < 5 && this.state.addressType === "default" ? (
																<div className='add-address'>
																	<div
																		className='add-box'
																		onClick={() =>
																			this.setState({
																				modal: "modal-address-active",
																			})
																		}>
																		<p>+ Add New Address</p>
																	</div>
																</div>
															) : null}
															<div className='next-back-button'>
																<button
																	type='button'
																	onClick={() =>
																		this.setState({
																			tab: 3,
																			process2: "process2-active",
																		})
																	}>
																	PROCEED TO PAYMENT
																</button>
															</div>
														</div>
													</div>
												) : (
													<div className='payment-section'>
														<div className='title'>
															<img src={pay} alt='payemnt-logo' />
															<p>Choose Payment</p>
														</div>
														<div className='body'>
															<div className='pay' onClick={() => this.setState({ paymentTab: 1 })}>
																{this.state.paymentTab === 1 ? <i class='far fa-dot-circle active'></i> : <i class='far fa-circle'></i>}
																<img src={razorpay} alt='razorpay-logo' />
																<p>Pay via razorpay &#8377;50 off</p>
															</div>
															<div className='pay' onClick={() => this.setState({ paymentTab: 2 })}>
																{this.state.paymentTab === 2 ? <i class='far fa-dot-circle active'></i> : <i class='far fa-circle'></i>}
																<img src={cod} alt='razorpay-logo' />
																<p>Pay on delivery</p>
															</div>
															{/* <div
                                className="pay"
                                onClick={() => this.setState({ paymentTab: 2 })}
                              >
                                {this.state.paymentTab === 2 ? (
                                  <i class="far fa-dot-circle active"></i>
                                ) : (
                                  <i class="far fa-circle"></i>
                                )}
                                <img src={paytm} alt="razorpay-logo" />
                                <p>Pay via paytm</p>
                              </div>
                              <div
                                className="pay"
                                onClick={() => this.setState({ paymentTab: 3 })}
                              >
                                {this.state.paymentTab === 3 ? (
                                  <i class="far fa-dot-circle active"></i>
                                ) : (
                                  <i class="far fa-circle"></i>
                                )}
                                <img src={phonepe} alt="razorpay-logo" />
                                <p>Pay via phonepe</p>
                              </div> */}

															<div className='final-button' onClick={this.handlePayment}>
																<button type='button'>ORDER</button>
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>

									{/* Add address modal */}
									<div className={this.state.modal}>
										<div className='modal-content'>
											<div className='modal-header'>
												<p>ADD NEW ADDRESS</p>
												<div className='modal-address-close-button' onClick={() => this.setState({ modal: "modal-address" })}>
													<i class='far fa-times-circle'></i>
												</div>
											</div>
											<div className='modal-body'>
												<div className='modal-contact-details'>
													<p>CONTACT DETAILS</p>
													<input type='text' placeholder='Name' name='cname' onChange={this.handleChange} value={this.state.cname} />
													<input type='text' placeholder='Mobile Number' name='cphone' onChange={this.handleChange} value={this.state.cphone} />
												</div>
												<div className='modal-address-details'>
													<p>ADDRESS DETAILS</p>
													<input type='text' placeholder='Address (House No., building, street, area)' name='add' onChange={this.handleChange} value={this.state.add} />
													<input type='text' placeholder='Pincode' name='pin' onChange={this.handleChange} value={this.state.pin} />
													<input type='text' placeholder='City' name='city' onChange={this.handleChange} value={this.state.city} />
													<input type='text' placeholder='State' name='state' onChange={this.handleChange} value={this.state.state} />
													<div id='check-default'>
														<input type='checkbox' onChange={this.handleIsDefault} checked={this.state.isDefault} />
														<p>Make this my default address</p>
													</div>
												</div>
											</div>
											<div className='modal-footer'>
												{this.state.editAddress ? (
													<button type='button' onClick={this.handleEditAddress}>
														UPDATE ADDRESS
													</button>
												) : (
													<button type='button' onClick={this.handleSubmit}>
														ADD ADDRESS
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</>
				)}
			</>
		);
	}
}

export default Cart;
