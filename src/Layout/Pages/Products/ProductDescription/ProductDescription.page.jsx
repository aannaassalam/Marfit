import React from "react";
import "./ProductDescription.style.css";
import Slider from "../../../Components/Slider/Slider";
import { motion } from "framer-motion";
import Lottie from "lottie-react-web";
import empty from "./629-empty-box.json";
import loading from "../../../../assets/loading.json";
import Loader from "../../../Components/Loader/Loader";
import toaster from "toasted-notes";
import moment from "moment";
import ReactImageMagnify from "react-image-magnify";
import firebase from "firebase";
import { Link } from "react-router-dom";
import axios from "axios";
import link from "../../../../fetchPath";

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

export default class ProductDesc extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeImage: 0,
			isWished: false,
			cart: [],
			product: {},
			simProducts: [],
			sizeSelected: "",
			usersQuantity: 1,
			currentUser: "",
			loading: true,
			colorSelected: "",
			colors: [],
			ratings: [],
			stars: 0,
			sizeIndex: 0,
			available: false,
			delivery: "",
			navailable: false,
			checked: false,
		};
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.handleInit();
				firebase
					.firestore()
					.collection("users")
					.where("uid", "==", user.uid)
					.get()
					.then((snap) => {
						snap.forEach((doc) => {
							var wishlist = doc.data().wishlist;
							// productShow["isWished"] = false;
							wishlist.forEach((item) => {
								if (item === this.props.match.params.id3) {
									this.setState({
										isWished: true,
									});
								}
							});
							this.setState({
								cart: doc.data().cart,
								currentUser: doc.data().email,
							});
						});
					});
			} else {
				this.handleInit();
				this.setState({
					cart: JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [],
					currentUser: "",
				});
			}
		});
	}

	handleInit = () => {
		firebase
			.firestore()
			.collection("products")
			.onSnapshot((snap) => {
				var products = [];
				var productShow = {};
				var simProducts = [];
				var simProducts2 = [];
				var colors = [];
				snap.docChanges().forEach((changes) => {
					var p = changes.doc.data();
					p.id = changes.doc.id;
					products.push(p);
				});
				if (products.length === snap.size) {
					products.forEach(async (product) => {
						if (product.category.toLowerCase() === this.props.match.params.id1.toLowerCase()) {
							if (product.subCategory.toLowerCase() === this.props.match.params.id2.toLowerCase()) {
								if (product.id === this.props.match.params.id3) {
									productShow = product;
								} else {
									if (product.quantity !== 0 && simProducts.length < 12) {
										var sim = product.id;
										simProducts.push(sim);
									}
								}
							} else {
								if (product.id !== this.props.match.params.id3) {
									if (product.quantity !== 0 && simProducts2.length < 12) {
										var sim = product.id;
										simProducts2.push(sim);
									}
								}
							}
						}
					});
					products.forEach(async (product) => {
						if (product.category.toLowerCase() === this.props.match.params.id1.toLowerCase()) {
							if (product.subCategory.toLowerCase() === this.props.match.params.id2.toLowerCase()) {
								if (productShow.batch && product.batch === productShow.batch) {
									colors.push(product);
								}
							}
						}
					});
					this.setState({
						product: productShow,
						simProducts: simProducts,
						simProducts2: simProducts2,
						colors: colors,
						loading: false,
					});
				}
			});
	};

	AddToCart = () => {
		if (this.state.available) {
			if (!this.state.product.noSize) {
				if (this.state.sizeSelected !== "") {
					this.setState({
						addLoading: true,
					});
					if (firebase.auth().currentUser) {
						firebase
							.firestore()
							.collection("users")
							.where("uid", "==", firebase.auth().currentUser.uid)
							.get()
							.then((snap) => {
								snap.forEach((doc) => {
									var cart = doc.data().cart;
									var found = false;
									cart.forEach((item) => {
										if (item.id === this.state.product.id) {
											found = true;
										}
									});
									if (found === false) {
										var tempCart = {};
										tempCart.id = this.state.product.id;
										tempCart.quantity = this.state.usersQuantity;
										tempCart.size = this.state.sizeSelected;
										tempCart.max = this.state.product.max;
										tempCart.sizeMax = this.state.product.sizes[this.state.sizeIndex].quantity;
										cart.push(tempCart);
										console.log(cart);
										firebase
											.firestore()
											.collection("users")
											.doc(doc.id)
											.update({
												cart: cart,
											})
											.then(() => {
												toaster.notify("Added to cart");
												this.setState({
													addLoading: false,
												});

												this.removeFromWishlist(this.state.product.id);
											});
									} else {
										toaster.notify("Item already exist in your cart");
										this.setState({
											addLoading: false,
										});
									}
								});
							});
					} else {
						var cart = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];
						if (cart.length > 0) {
							cart.forEach((item) => {
								if (item.id !== this.state.product.id) {
									var tempCart = {};
									tempCart.id = this.state.product.id;
									tempCart.quantity = this.state.usersQuantity;
									tempCart.size = this.state.sizeSelected;
									tempCart.max = this.state.product.max;
									tempCart.sizeMax = this.state.product.sizes[this.state.sizeIndex].quantity;
									cart.push(tempCart);
									this.setState(
										{
											cart: cart,
											addloading: false,
										},
										() => {
											var localCart = JSON.stringify(this.state.cart);
											localStorage.setItem("cart", localCart);
											toaster.notify("Added to cart");
											this.props.handleParent();
										}
									);
								} else {
									toaster.notify("Item already exist in your cart");
									this.setState({
										addLoading: false,
									});
								}
							});
						} else {
							var tempCart = {};
							tempCart.id = this.state.product.id;
							tempCart.quantity = this.state.usersQuantity;
							tempCart.size = this.state.sizeSelected;
							tempCart.max = this.state.product.max;
							tempCart.sizeMax = this.state.product.sizes[this.state.sizeIndex].quantity;
							cart.push(tempCart);
							this.setState(
								{
									cart: cart,
									addloading: false,
								},
								() => {
									var localCart = JSON.stringify(this.state.cart);
									localStorage.setItem("cart", localCart);
									toaster.notify("Added to cart");
									this.props.handleParent();
								}
							);
						}
					}
				} else {
					toaster.notify("Please select a size !");
				}
			} else {
				this.setState({
					addLoading: true,
				});
				if (firebase.auth().currentUser) {
					firebase
						.firestore()
						.collection("users")
						.where("uid", "==", firebase.auth().currentUser.uid)
						.get()
						.then((snap) => {
							snap.forEach((doc) => {
								var cart = doc.data().cart;
								var found = false;
								cart.forEach((item) => {
									if (item.id === this.state.product.id) {
										found = true;
									}
								});
								if (found === false) {
									var tempCart = {};
									tempCart.id = this.state.product.id;
									tempCart.quantity = this.state.usersQuantity;
									tempCart.size = "null";
									tempCart.max = this.state.product.max;
									cart.push(tempCart);
									console.log(cart);
									firebase
										.firestore()
										.collection("users")
										.doc(doc.id)
										.update({
											cart: cart,
										})
										.then(() => {
											toaster.notify("Added to cart");
											this.setState({
												addLoading: false,
											});

											this.removeFromWishlist(this.state.product.id);
										});
								} else {
									toaster.notify("Item already exist in your cart");
									this.setState({
										addLoading: false,
									});
								}
							});
						});
				} else {
					var cart = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];
					if (cart.length > 0) {
						cart.forEach((item) => {
							if (item.id !== this.state.product.id) {
								var tempCart = {};
								tempCart.id = this.state.product.id;
								tempCart.quantity = this.state.usersQuantity;
								tempCart.size = "null";
								tempCart.max = this.state.product.max;
								cart.push(tempCart);
								this.setState(
									{
										cart: cart,
										addloading: false,
									},
									() => {
										var localCart = JSON.stringify(this.state.cart);
										localStorage.setItem("cart", localCart);
										toaster.notify("Added to cart");
										this.props.handleParent();
									}
								);
							} else {
								toaster.notify("Item already exist in your cart");
								this.setState({
									addLoading: false,
								});
							}
						});
					} else {
						var tempCart = {};
						tempCart.id = this.state.product.id;
						tempCart.quantity = this.state.usersQuantity;
						tempCart.size = "null";
						tempCart.max = this.state.product.max;
						cart.push(tempCart);
						this.setState(
							{
								cart: cart,
								addloading: false,
							},
							() => {
								var localCart = JSON.stringify(this.state.cart);
								localStorage.setItem("cart", localCart);
								toaster.notify("Added to cart");
								this.props.handleParent();
							}
						);
					}
				}
			}
		} else {
			toaster.notify("Please check your delivery pincode");
		}
	};

	addToWishlist = () => {
		firebase
			.firestore()
			.collection("users")
			.where("uid", "==", firebase.auth().currentUser.uid)
			.get()
			.then((snap) => {
				snap.forEach((doc) => {
					var wishlist = doc.data().wishlist;
					var found = false;
					wishlist.forEach((item) => {
						if (item === this.state.product.id) {
							found = true;
						}
					});
					if (found === false) {
						this.setState({
							isWished: true,
						});
						wishlist.push(this.state.product.id);
						firebase
							.firestore()
							.collection("users")
							.doc(doc.id)
							.update({
								wishlist: wishlist,
							})
							.then(() => {
								toaster.notify("Added to your wishlist");
							});
					} else {
						toaster.notify("Item already exists in your wishlist");
					}
				});
			});
	};

	removeFromWishlist = () => {
		firebase
			.firestore()
			.collection("users")
			.where("uid", "==", firebase.auth().currentUser.uid)
			.get()
			.then((snap) => {
				snap.forEach((doc) => {
					var wishlist = doc.data().wishlist;
					if (wishlist.length > 0) {
						var newwishlist = [];
						wishlist.map((item) => {
							if (item !== this.state.product.id) {
								newwishlist.push(item);
							}
						});
						this.setState({
							isWished: false,
						});
						firebase
							.firestore()
							.collection("users")
							.doc(doc.id)
							.update({
								wishlist: newwishlist,
							})
							.then(() => {
								toaster.notify(" Item removed from wishlist");
							});
					}
				});
			});
	};

	handlePincode = (e) => {
		var x = e.target.value;
		var delivery = parseInt(x);
		if (Number.isInteger(delivery)) {
			this.setState({
				delivery: x,
				available: false,
				navailable: false,
				checked: false,
			});
		} else {
			if (x === "") {
				this.setState({
					delivery: "",
					available: false,
					navailable: false,
					checked: false,
				});
			} else {
				this.setState({
					available: false,
					navailable: false,
					checked: false,
				});
			}
		}
	};

	handleCheck = async () => {
		var data = {
			pincode: this.state.delivery,
		};
		var res = await axios.post(link + "/checkPincode", data);
		if (res.data !== null) {
			if (res.data.type === "success") {
				this.setState({
					available: true,
					checked: true,
					navailable: false,
				});
			} else {
				this.setState({
					navailable: true,
					checked: true,
					available: false,
				});
			}
		}
	};

	render() {
		var stars = 0;
		var review = 0;
		var q = [];
		if (this.state.product.noSize) {
			for (var x = 1; x <= this.state.product.quantity; x++) {
				if (x <= this.state.product.max) {
					q.push(x);
				}
			}
		} else {
			if (this.state.sizeSelected !== "") {
				this.state.product.sizes.map((size) => {
					if (size.name === this.state.sizeSelected) {
						for (var x = 1; x <= size.quantity; x++) {
							if (x <= this.state.product.max) {
								q.push(x);
							}
						}
					}
				});
			} else {
				for (var x = 0; x <= 0; x++) {
					q.push(x);
				}
			}
		}
		if (this.state.product.title) {
			this.state.product.ratings.map((rate) => {
				stars += rate.stars;
				if (rate.review.length > 0) {
					review += 1;
				}
			});
			stars = Math.round(stars / this.state.product.ratings.length);
		}
		return (
			<>
				{this.state.loading ? (
					<Loader />
				) : (
					<motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition} className='product-desc-container'>
						<div className='categorylist-breadcrumb'>
							<div className='breadcrumb-menu'>
								<div className='bd-menu-list'>
									<a href='/' style={{ cursor: "pointer" }}>
										Home
									</a>
									<a>
										<i className='fas fa-chevron-right'></i>
									</a>
									<a href={"/Category/" + this.props.match.params.id1} style={{ cursor: "pointer" }}>
										{this.props.match.params.id1}
									</a>
									<a>
										<i className='fas fa-chevron-right'></i>
									</a>
									<a href={"/Category/" + this.props.match.params.id1 + "/" + this.props.match.params.id2} style={{ cursor: "pointer" }}>
										{this.props.match.params.id2}
									</a>
									<a>
										<i className='fas fa-chevron-right'></i>
									</a>
									<a
										href={"/Category/" + this.props.match.params.id1 + "/" + this.props.match.params.id2 + "/" + this.state.product.id ? this.state.product.id : null}
										style={{ cursor: "pointer" }}>
										{this.state.product.title ? this.state.product.title : "Not Found"}
									</a>
								</div>
							</div>
						</div>
						<div className='product-container'>
							{this.state.product.title ? (
								<div className='product-desc'>
									<div className='all-product-image'>
										<div className='carousal-section'>
											<div className='product-images'>
												{this.state.product.images &&
													this.state.product.images.map((item, index) => (
														<>
															{this.state.activeImage === index ? (
																<div className='preview-image activeImage' key={index}>
																	<img src={this.state.product.images[index]} alt='slider Images' />
																</div>
															) : (
																<div className='preview-image' key={index}>
																	<img
																		src={item}
																		alt='slider Images'
																		onClick={() => {
																			this.setState({ activeImage: index });
																		}}
																	/>
																</div>
															)}
														</>
													))}
											</div>

											<div className='product-image'>
												{this.state.product.images ? (
													<>
														<div className='product-image-container'>
															<ReactImageMagnify
																{...{
																	className: "image-container",
																	imageClassName: "product-image-image",
																	enlargedImageContainerClassName: "product-zoom-container",
																	enlargedImageClassName: "product-zoom-image",
																	smallImage: {
																		alt: "product image",
																		isFluidWidth: true,
																		src: this.state.product.images[this.state.activeImage],
																	},
																	largeImage: {
																		src: this.state.product.images[this.state.activeImage],
																		width: 1200,
																		height: 1800,
																	},
																	lensStyle: { backgroundColor: "transparent" },
																}}
															/>
														</div>
														<div className='product-image-container2'>
															<img src={this.state.product.images[this.state.activeImage]} alt='' />
														</div>
													</>
												) : null}
											</div>
										</div>
										<div className='buying-options'>
											{this.state.product.quantity > 0 ? (
												<>
													<div className='option' onClick={this.AddToCart}>
														<i className='fas fa-shopping-cart'></i>
														<p>ADD TO CART</p>
													</div>
													<div
														className='option'
														onClick={() => {
															if (this.state.product.noSize) {
																window.location.href = "/Checkout/" + this.state.product.id + "/" + this.state.usersQuantity + "/" + "null";
															} else {
																if (this.state.sizeSelected !== "" && !this.state.product.noSize) {
																	window.location.href = "/Checkout/" + this.state.product.id + "/" + this.state.usersQuantity + "/" + this.state.sizeSelected;
																} else {
																	toaster.notify("Please select a size !");
																}
															}
														}}>
														<i className='fas fa-bolt'></i>
														<p>BUY NOW</p>
													</div>
												</>
											) : (
												<p className='outstock'>OUT OF STOCK</p>
											)}
										</div>
									</div>
									<div className='description-section'>
										<div className='product-title'>
											<p>{this.state.product.title}</p>
											{this.state.currentUser.length > 0 ? (
												<>
													{this.state.isWished ? (
														<div className='circle' onClick={this.removeFromWishlist}>
															<i className='red fa fa-heart'></i>
														</div>
													) : (
														<div className='circle' onClick={this.addToWishlist}>
															<i className='fa fa-heart'></i>
														</div>
													)}
												</>
											) : null}
										</div>
										{this.state.product.ratings && this.state.product.ratings.length > 0 ? (
											<div className='rating'>
												<div className='rating-header'>
													{this.state.product.ratings.length > 0 ? (
														<div className='rating-body'>
															<div className='stars'>
																<p>{stars}</p>
																<i className='fas fa-star'></i>
															</div>
															<p className='rating-size'>
																{this.state.product.ratings.length} ratings {review > 0 ? "& " + review + " reviews" : null}
															</p>
														</div>
													) : null}
												</div>
											</div>
										) : null}
										<div className='price'>
											<div className='product-price'>&#8377;{this.state.product.sp}</div>
											<div className='product-price-linethrough'>&#8377;{this.state.product.cp}</div>
											<div className='product-discount'>{100 - Math.round((this.state.product.sp / this.state.product.cp) * 100)}% off</div>
										</div>
										<div className='other-details'>
											{this.state.product.quantity > 0 ? (
												<>
													<div className='quantity-cont'>
														<p className='title-tag'>Quantity</p>
														<div className={this.state.sizeSelected === "" && !this.state.product.noSize ? "quantity grey" : "quantity"}>
															<select
																style={{ width: "100%", height: "100%", textAlign: "center", cursor: "pointer", border: "none", outline: "none" }}
																value={this.state.usersQuantity}
																onChange={(e) => {
																	this.setState({
																		usersQuantity: e.target.value,
																	});
																}}>
																{q.map((qaunt) => {
																	return <option value={qaunt}>{qaunt}</option>;
																})}
															</select>
														</div>
													</div>
													{this.state.product.noSize ? null : (
														<div className='size-cont'>
															<p className='title-tag'>Size</p>
															<div className='size'>
																{this.state.product.sizes.map((size, index) => {
																	return size.quantity > 0 ? (
																		<p
																			className={this.state.sizeSelected === size.name ? "sizeSelected" : null}
																			onClick={() => {
																				this.setState({
																					sizeSelected: size.name,
																					usersQuantity: 1,
																					sizeIndex: index,
																				});
																			}}>
																			{size.name.toUpperCase()}
																		</p>
																	) : (
																		<p className='grey'>{size.name.toUpperCase()}</p>
																	);
																})}
															</div>
														</div>
													)}
													{this.state.colors.length > 1 ? (
														<div className='color-cont'>
															<p className='title-tag'>Color</p>
															<div className='colors'>
																{this.state.colors.map((color) => {
																	return (
																		<Link
																			className={color.color === this.state.product.color ? "color color-selected" : "color"}
																			to={"/Category/" + this.props.match.params.id1 + "/" + this.props.match.params.id2 + "/" + color.id}>
																			<img src={color.images[0]} alt='' />
																		</Link>
																	);
																})}
															</div>
														</div>
													) : null}
												</>
											) : (
												<div className='out-of-stock-text'>
													<h1>Sold Out</h1>
													<p>This item is currently out of stock</p>
												</div>
											)}
										</div>
										<div className='product-delivery'>
											<p>Delivery</p>
											<div className='delivery-input-box'>
												<div className='delivery-input'>
													<i className='fas fa-map-marker-alt'></i>
													<input value={this.state.delivery} onChange={this.handlePincode} placeholder='Enter Delivery Pincode' maxLength={6} />
													{this.state.delivery.length === 6 ? <p onClick={this.handleCheck}>Check</p> : null}
												</div>
												{this.state.checked ? (
													<>{this.state.navailable ? <p className='wrong'>Not-availble at your pincode</p> : <p className='right'>Availble at your pincode</p>}</>
												) : null}
											</div>
										</div>
										<div className='product-details'>
											<h3>Product Details</h3>
											<p className='product-summary'>{this.state.product.description}</p>
											<ul>
												<li>
													<p className='darkgrey'>Height</p>
													<p className='text'>{this.state.product.height} mm</p>
												</li>
												<li>
													<p className='darkgrey'>Width</p>
													<p className='text'>{this.state.product.width} mm</p>
												</li>
												<li>
													<p className='darkgrey'>Thickness</p>
													<p className='text'>{this.state.product.thick} mm</p>
												</li>
												{this.state.product.specifications &&
													this.state.product.specifications.map((spec) => (
														<li>
															<p className='darkgrey'>{spec.title}</p>
															<p className='text'>{spec.content}</p>
														</li>
													))}
											</ul>
										</div>
										<div className='rating'>
											<div className='rating-header'>
												<h3>Ratings & Review</h3>
												{this.state.product.ratings.length > 0 ? (
													<div className='rating-body'>
														<div className='stars'>
															<p>{stars}</p>
															<i className='fas fa-star'></i>
														</div>
														<p className='rating-size'>
															{this.state.product.ratings.length} ratings {review > 0 ? "& " + review + " reviews" : null}
														</p>
													</div>
												) : null}
											</div>
											<div className='review-list'>
												{this.state.product.ratings.length > 0 ? (
													this.state.product.ratings.map((rating) => {
														return (
															<div className='reviews'>
																<div className='upper'>
																	<div className='stars-mini'>
																		<p>{rating.stars}</p>
																		<i className='fas fa-star'></i>
																	</div>
																	<p className='review-text'>{rating.review}</p>
																</div>
																<div className='lower'>
																	<p className='user-name'>{rating.name}</p>
																	<p className='date'>on</p>
																	<p className='date'>{moment(rating.date.toDate()).format("DD-MM-YYYY")}</p>
																</div>
															</div>
														);
													})
												) : (
													<div className='noratings'>
														<p>No ratings or reviews</p>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							) : (
								<div
									style={{
										width: "100%",
										height: "85vh",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexDirection: "column",
									}}>
									<Lottie options={{ animationData: empty }} width={200} height={200} />
									<p
										style={{
											fontSize: "16px",
											fontWeight: "bold",
											color: "#313131",
										}}>
										Sorry! we could not find any items
									</p>
								</div>
							)}
						</div>
						{this.state.simProducts.length > 0 ? (
							<>
								<div className='product-like'>
									<Slider data={this.state.simProducts} title={"Similar Products"} view={false} />
									<Slider data={this.state.simProducts2} title={"You may also like"} view={false} />
								</div>
								<div className='buying-options-sticky'>
									{this.state.product.quantity > 0 ? (
										<>
											<div className='option' onClick={this.AddToCart}>
												<i className='fas fa-shopping-cart'></i>
												<p>ADD TO CART</p>
											</div>
											<div className='option' onClick={() => (window.location.href = "/Checkout/" + this.state.product.id + "/" + this.state.usersQuantity)}>
												<i className='fas fa-bolt'></i>
												<p>BUY NOW</p>
											</div>
										</>
									) : (
										<p className='outstock'>OUT OF STOCK</p>
									)}
								</div>
							</>
						) : null}
					</motion.div>
				)}
			</>
		);
	}
}
