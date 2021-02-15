import React from "react";
import "./Dashboard.css";
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
import redeem from "./8287-redeem-points-to-get-gift.json";
import OrdersComp from "../../Components/OrdersComp/OrdersComp";
import circular from "../../../assets/circular loading.json";
import moment from "moment";

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
			circular: false,
			alt: "",
			editProifleLoading: false,
			orders: [],
			addresses: [],
			loading: true,
			wishlist: [],
			copy: false,
			addTab: false,
			editTab: false,
			points: "",
			orderedProduct: [],
			editPhone: "",
			pincode: "",
			editPincode: "",
			city: "",
			editCity: "",
			country: "",
			editCountry: "",
			state: "",
			editState: "",
			firstName: "",
			editFirstName: "",
			lastName: "",
			editLastName: "",
			appartment: "",
			editAppartment: "",
			address: "",
			editAddress: "",
			email: "",
			editEmail: "",
			redeem: "",
			selectedTab: "",
			user: "",
		};
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("users")
					.where("uid", "==", user.uid)
					.onSnapshot((snap) => {
						snap.docChanges().forEach((change) => {
							this.setState({
								currentUser: change.doc.data(),
								points: change.doc.data().points,
								addresses: change.doc.data().addresses,
								loading: false,
								orders: change.doc.data().orders,
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
		// this.setState({
		//   editProifleLoading: true,
		// });
		firebase
			.firestore()
			.collection("users")
			.where("uid", "==", firebase.auth().currentUser.uid)
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
							email: this.state.email,
							// alt: this.state.alt,
							gender: this.state.gender,
							dob: this.state.dob,
						})
						.then(() => {
							this.setState({
								// editProifleLoading: false,
								editProifle: false,
							});
							toaster.notify("Profile Updated");
							// toaster.notfiy("Profile Updated");
						});
				});
			});
	};

	handleChange = (e) => {
		const { value, id } = e.target;
		this.setState({ [id]: value });
	};

	handleDelete(index) {
		var addresses = this.state.addresses;
		var newAddresses = addresses.filter((address) => address !== addresses[index]);
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
								addresses: newAddresses,
							});
						});
				});
			});
	}

	handleAdd() {
		if (
			this.state.address.length > 0 &&
			this.state.firstName.length > 0 &&
			this.state.lastName.length > 0 &&
			this.state.phone.length > 0 &&
			this.state.city.length > 0 &&
			this.state.state.length > 0 &&
			this.state.country.length > 0 &&
			this.state.pincode.length > 0 &&
			this.state.email.length > 0
		) {
			var addresses = {};
			addresses.email = this.state.email;
			addresses.address = this.state.address;
			addresses.firstName = this.state.firstName;
			addresses.lastName = this.state.lastName;
			addresses.country = this.state.country;
			addresses.appartment = this.state.appartment;
			addresses.state = this.state.state;
			addresses.city = this.state.city;
			addresses.pincode = this.state.pincode;
			addresses.phone = this.state.phone;
			this.setState({
				addresses: [...this.state.addresses, addresses],
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
								addresses: this.state.addresses,
							})
							.then(() => {
								this.setState({
									firstName: "",
									lastName: "",
									phone: "",
									email: "",
									country: "",
									address: "",
									state: "",
									city: "",
									pincode: "",
									appartment: "",
									addTab: false,
								});
							});
					});
				});
		}
	}

	handleRedeem = () => {
		this.setState({
			circular: true,
		});
		firebase
			.firestore()
			.collection("gift card")
			.where("name", "==", this.state.redeem)
			.get()
			.then((snap) => {
				if (snap.size > 0) {
					snap.forEach((doc) => {
						if (!doc.data().redeem) {
							if (doc.data().type === "marfit user") {
								firebase
									.firestore()
									.collection("users")
									.where("email", "==", this.state.currentUser.email)
									.get()
									.then((snap) => {
										snap.forEach((doc2) => {
											var points = parseInt(doc2.data().points) + parseInt(doc.data().value);
											firebase
												.firestore()
												.collection("users")
												.doc(doc2.id)
												.update({
													points: points,
												})
												.then(() => {
													console.log(3);
													firebase
														.firestore()
														.collection("gift card")
														.doc(doc.id)
														.update({
															redeem: true,
														})
														.then(() => {
															console.log(4);
															toaster.notify("Redeem of " + doc.data().value + " points is Successfull");
															this.setState({
																circular: false,
															});
														});
												});
										});
									});
							} else {
								firebase
									.firestore()
									.collection("approval")
									.add({
										email: this.state.currentUser.email,
										giftCard: doc.data().name,
										date: new Date(),
										status: "pending",
									})
									.then(() => {
										toaster.notify("Redeem points successfully requested");
									});
							}
						} else {
							toaster.notify("You already claimed this offer");
							this.setState({
								circular: false,
							});
						}
					});
				} else {
					toaster.notify("Invalid gift card code");
					this.setState({
						circular: false,
					});
				}
			});
	};

	editTab = (index) => {
		this.setState({
			editAddress: this.state.addresses[index].address,
			editPhone: this.state.addresses[index].phone,
			editFirstName: this.state.addresses[index].firstName,
			editLastName: this.state.addresses[index].lastName,
			editPincode: this.state.addresses[index].pincode,
			editState: this.state.addresses[index].state,
			editCity: this.state.addresses[index].city,
			editEmail: this.state.addresses[index].email,
			editAppartment: this.state.addresses[index].appartment,
			editCountry: this.state.addresses[index].country,
			editTab: true,
			selectedTab: index,
		});
	};

	handleEdit = () => {
		var address = {};
		address.address = this.state.editAddress;
		address.phone = this.state.editPhone;
		address.firstName = this.state.editFirstName;
		address.lastName = this.state.editLastName;
		address.pincode = this.state.editPincode;
		address.state = this.state.editState;
		address.city = this.state.editCity;
		address.email = this.state.editEmail;
		address.appartment = this.state.editAppartment;
		address.country = this.state.editCountry;
		var addresses = this.state.addresses;
		addresses[this.state.selectedTab] = address;
		firebase
			.firestore()
			.collection("users")
			.where("email", "==", this.state.currentUser.email)
			.get()
			.then((snap) => {
				snap.forEach((doc) => {
					console.log(this.state.addresses);
					firebase
						.firestore()
						.collection("users")
						.doc(doc.id)
						.update({
							addresses: addresses,
						})
						.then(() => {
							this.setState({
								editTab: false,
							});
							toaster.notify("Address updates successfully");
						});
				});
			});
	};

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
						}}>
						<Lottie options={{ animationData: loading }} width={150} height={150} />
					</div>
				) : (
					<motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
						<div className='dashboard-container'>
							<div className='sidebar'>
								{this.state.tab === "Profile" ? (
									<div className='menu-active'>Profile</div>
								) : (
									<div className='menu' onClick={() => this.setState({ tab: "Profile" })}>
										Profile
									</div>
								)}
								{this.state.tab === "Orders" ? (
									<div className='menu-active'>Orders</div>
								) : (
									<div className='menu' onClick={() => this.setState({ tab: "Orders" })}>
										Orders
									</div>
								)}
								{this.state.tab === "Wishlist" ? (
									<div className='menu-active'>Wishlist</div>
								) : (
									<div className='menu' onClick={() => this.setState({ tab: "Wishlist" })}>
										Wishlist
									</div>
								)}
								{this.state.tab === "Address" ? (
									<div className='menu-active'>Address</div>
								) : (
									<div className='menu' onClick={() => this.setState({ tab: "Address" })}>
										Address
									</div>
								)}
								{this.state.tab === "Refer" ? (
									<div className='menu-active'>Refer & Earn</div>
								) : (
									<div className='menu' onClick={() => this.setState({ tab: "Refer" })}>
										Refer & Earn
									</div>
								)}
								{this.state.tab === "Redeem" ? (
									<div className='menu-active'>Redeem</div>
								) : (
									<div className='menu' onClick={() => this.setState({ tab: "Redeem" })}>
										Redeem
									</div>
								)}
							</div>
							<div className='content'>
								{this.state.tab === "Profile" ? (
									<>
										<h1>Profile Details</h1>
										<div className='divider'></div>
										<div className='input-list'>
											<div className='input-group'>
												<p className='title'>User Name</p>
												{this.state.editProifle ? (
													<input id='name' type='text' value={this.state.name} placeholder='Enter your user name' onChange={this.handleChange} />
												) : (
													<p className='value'>{this.state.currentUser ? this.state.currentUser.name : "N/A"}</p>
												)}
											</div>
											<div className='input-group'>
												<p className='title'>Email</p>
												{this.state.editProifle ? (
													<input id='email' type='text' value={this.state.email} placeholder='Enter your email address' onChange={this.handleChange} />
												) : (
													<p className='value'>{this.state.currentUser ? this.state.currentUser.email : "N/A"}</p>
												)}
											</div>
											<div className='input-group'>
												<p className='title'>Mobile No.</p>
												{this.state.editProifle ? (
													<input id='phone' maxLength={10} type='text' value={this.state.phone} placeholder='Enter your mobile no.' onChange={this.handleChange} />
												) : (
													<p className='value'>{this.state.currentUser ? (this.state.currentUser.phone ? this.state.currentUser.phone : "N/A") : "N/A"}</p>
												)}
											</div>
											<div className='input-group'>
												<p className='title'>Gender</p>
												{this.state.editProifle ? (
													<div className='gender-group'>
														<div className='gender'>
															{this.state.gender === "Male" ? (
																<i className='fas fa-dot-circle activated'></i>
															) : (
																<i class='far fa-circle' onClick={() => this.setState({ gender: "Male" })}></i>
															)}
															<p>Male</p>
														</div>
														<div className='gender'>
															{this.state.gender === "Female" ? (
																<i className='fas fa-dot-circle activated'></i>
															) : (
																<i className='far fa-circle ' onClick={() => this.setState({ gender: "Female" })}></i>
															)}
															<p>Female</p>
														</div>
													</div>
												) : (
													<p className='value'>{this.state.currentUser ? (this.state.currentUser.gender ? this.state.currentUser.gender : "N/A") : "N/A"}</p>
												)}
											</div>
											<div className='input-group'>
												<p className='title'>Date of Birth</p>
												{this.state.editProifle ? (
													<input id='dob' type='date' maxLength={8} value={this.state.dob} onChange={this.handleChange} />
												) : (
													<p className='value'>{this.state.currentUser ? (this.state.currentUser.dob ? this.state.currentUser.dob : "N/A") : "N/A"}</p>
												)}
											</div>
											{/* <div className="input-group">
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
                      </div> */}
										</div>
										{this.state.editProifle ? (
											<>
												{this.state.editProifleLoading ? (
													<div className='loader-container'>
														<div className='loader'>
															<Lottie options={{ animationData: loading }} />
														</div>
													</div>
												) : (
													<div className='button-group'>
														<div className='profile-cancel-button' onClick={this.handleProfileCancel}>
															Cancel
														</div>
														<div className='profile-save-button' onClick={this.handleProfileSave}>
															Save
														</div>
													</div>
												)}
											</>
										) : (
											<div className='profile-edit-button' onClick={this.handleProfile}>
												Edit Profile
											</div>
										)}
									</>
								) : null}
								{this.state.tab === "Orders" ? (
									<>
										<h1>Your Orders</h1>
										<div className='divider'></div>
										{this.state.orders.length === 0 ? (
											<div
												className='ordersdiv'
												style={{
													width: "100%",
													height: "90%",
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "center",
												}}>
												<Lottie options={{ animationData: empty }} width={200} height={200} />
												<p>
													<span>EMPTY ORDER LIST</span>
													<br />
													You have no items in your orderlist
												</p>
												<a href='/' className='empty'>
													Take me back to shopping
												</a>
											</div>
										) : (
											<div className='order-container'>
												{this.state.orders.map((item, index) => {
													return <OrdersComp item={item} key={index} />;
												})}
											</div>
										)}
									</>
								) : null}
								{this.state.tab === "Wishlist" ? (
									<>
										<h1>Your Wishlist Items</h1>
										<div className='divider'></div>
										{this.state.currentUser.wishlist.length === 0 ? (
											<div
												style={{
													width: "100%",
													height: "80%",
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "center",
												}}>
												<Lottie options={{ animationData: emptywish }} width={260} height={300} />
												<a href='/' className='empty'>
													Take me back to shopping
												</a>
											</div>
										) : (
											<div className='wishlist-container'>
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
										<div className='divider'></div>
										<div className='address-cont'>
											{this.state.addTab ? (
												<>
													<i
														className='fas fa-arrow-left'
														onClick={() => {
															this.setState({ addTab: false });
														}}></i>
													<div className={this.state.addTab ? "addtab active" : "addtab"}>
														<div className='inputs'>
															<div className='region'>
																<input
																	type='text'
																	placeholder='First name'
																	name='firstName'
																	id='firstName'
																	required
																	value={this.state.firstName}
																	onChange={this.handleChange}
																/>
																<input
																	type='text'
																	placeholder='Last name'
																	name='lastName'
																	id='lastName'
																	required
																	value={this.state.lastName}
																	onChange={this.handleChange}
																/>
															</div>
															<input type='text' placeholder='Email' name='email' id='email' required value={this.state.email} onChange={this.handleChange} />
															<input type='text' placeholder='Address' name='address' id='address' required value={this.state.address} onChange={this.handleChange} />
															<input
																type='text'
																placeholder='Appartment, suite, etc. (optional)'
																name='appartment'
																id='appartment'
																value={this.state.apartment}
																onChange={this.handleChange}
															/>
															<div className='region'>
																<input
																	type='text'
																	placeholder='Country / Nation'
																	name='country'
																	required
																	id='country'
																	value={this.state.country}
																	onChange={this.handleChange}
																/>
																<input type='text' placeholder='State' name='state' required id='state' value={this.state.state} onChange={this.handleChange} />
															</div>
															<div className='region'>
																<input type='text' placeholder='City' name='city' required id='city' value={this.state.city} onChange={this.handleChange} />
																<input type='text' placeholder='Pincode' name='pincode' required id='pincode' value={this.state.pincode} onChange={this.handleChange} />
															</div>
															<input type='text' name='phone' id='phone' placeholder='Phone' value={this.state.phone} onChange={this.handleChange} />
															<button
																type='button'
																onClick={() => {
																	this.handleAdd();
																}}>
																<p>Add</p>
															</button>
														</div>
													</div>
												</>
											) : this.state.editTab ? (
												<>
													<i
														className='fas fa-arrow-left'
														onClick={() => {
															this.setState({ editTab: false });
														}}></i>
													<div className={this.state.editTab ? "editTab active" : "editTab"}>
														<div className='inputs'>
															<div className='region'>
																<input
																	type='text'
																	placeholder='First name'
																	name='editFirstName'
																	id='editFirstName'
																	required
																	value={this.state.editFirstName}
																	onChange={this.handleChange}
																/>
																<input
																	type='text'
																	placeholder='Last name'
																	name='editLastName'
																	id='editLastName'
																	required
																	value={this.state.editLastName}
																	onChange={this.handleChange}
																/>
															</div>
															<input type='text' placeholder='Email' name='editEmail' id='editEmail' required value={this.state.editEmail} onChange={this.handleChange} />
															<input
																type='text'
																placeholder='Address'
																name='editAddress'
																id='editAddress'
																required
																value={this.state.editAddress}
																onChange={this.handleChange}
															/>
															<input
																type='text'
																placeholder='Appartment, suite, etc. (optional)'
																name='editAppartment'
																id='editAppartment'
																value={this.state.editAppartment}
																onChange={this.handleChange}
															/>
															<div className='region'>
																<input
																	type='text'
																	placeholder='Country / Nation'
																	name='editCountry'
																	required
																	id='editCountry'
																	value={this.state.editCountry}
																	onChange={this.handleChange}
																/>
																<input
																	type='text'
																	placeholder='State'
																	name='editState'
																	required
																	id='editState'
																	value={this.state.editState}
																	onChange={this.handleChange}
																/>
															</div>
															<div className='region'>
																<input type='text' placeholder='City' name='editCity' required id='editCity' value={this.state.editCity} onChange={this.handleChange} />
																<input
																	type='text'
																	placeholder='Pincode'
																	name='editPincode'
																	required
																	id='editPincode'
																	value={this.state.editPincode}
																	onChange={this.handleChange}
																/>
															</div>
															<input type='text' name='editPhone' id='editPhone' placeholder='Phone' value={this.state.editPhone} onChange={this.handleChange} />
															<button
																type='button'
																onClick={() => {
																	this.handleEdit();
																}}>
																<p>Save</p>
															</button>
														</div>
													</div>
												</>
											) : (
												<>
													{this.state.addresses &&
														this.state.addresses.map((address, index) => (
															<div className='address' key={index}>
																<div className='paras'>
																	<p>Address {index + 1} :</p>
																	<p>
																		{address.firstName} {address.lastName}
																	</p>
																	<p>{address.address}</p>
																</div>
																<div className='actions'>
																	<div
																		className='edit'
																		onClick={() => {
																			this.editTab(index);
																		}}>
																		<i className='fas fa-pen'></i>
																	</div>
																	<div
																		className='minus'
																		onClick={() => {
																			this.handleDelete(index);
																		}}>
																		<i className='fas fa-minus-circle'></i>
																	</div>
																</div>
															</div>
														))}

													<div
														className='newAddress'
														onClick={() => {
															this.setState({ addTab: true });
														}}>
														<i className='fas fa-plus-circle'></i>
														<p>ADD NEW ADDRESS</p>
													</div>
												</>
											)}
										</div>
									</>
								) : null}
								{this.state.tab === "Refer" ? (
									<>
										<h1>Refer & Earn</h1>
										<div className='divider'></div>
										<div className='referMain'>
											<div className='referanimation'>
												<Lottie options={{ animationData: refer }} width={280} height={280} style={{ position: "absolute", top: 0 }} />
											</div>
											<div className='referCode'>
												<div className='referInput'>
													<input type='text' value={this.state.currentUser.referalID} disabled id='referalText' />
													<CopyToClipboard text={this.state.currentUser.referalID}>
														<button
															type='button'
															className={this.state.copy ? "copiedButton" : "copyButton"}
															onClick={() => {
																this.setState({ copy: true });
																setTimeout(() => {
																	this.setState({
																		copy: false,
																	});
																}, 1000);
															}}>
															{!this.state.copy ? (
																<>
																	<p>Copy</p>
																	<i className='far fa-clipboard'></i>
																</>
															) : (
																<>
																	<p>Copied</p>
																	<i className='fas fa-check'></i>
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
								{this.state.tab === "Redeem" ? (
									<>
										<div className='redeemHead'>
											<div className='left'>
												<h1>Redeem</h1>
												<div className='divider'></div>
											</div>
											<div className='right'>
												<h3>Points: {this.state.currentUser.points}</h3>
											</div>
										</div>
										<div className='redeem-cont'>
											<div className='redeemCard'>
												<Lottie options={{ animationData: redeem }} width={270} height={270} style={{ position: "absolute", top: "-100px" }} />
											</div>
											<div className='redeemCode'>
												<div className='redeemInput'>
													<input type='text' id='redeem' onChange={this.handleChange} placeholder='XXXX-XXXX-XXXX' maxLength={10} />
													{this.state.circular ? (
														<button type='button' disabled className='redeem active'>
															<Lottie options={{ animationData: circular }} width={30} height={30} />
														</button>
													) : (
														<button
															type='button'
															className={this.state.redeem.length > 0 ? "redeem active" : "redeem"}
															onClick={() => {
																this.handleRedeem();
															}}>
															Redeem
														</button>
													)}
												</div>
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
