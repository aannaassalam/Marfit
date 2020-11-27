import React from "react";
import "./Cart.css";
import CartCard from "../../Components/Cart-card/Cart-card";
import firebase from "firebase";
import empty from "./629-empty-box.json";
import Lottie from "lottie-react-web";
import toaster from "toasted-notes";
import discount from "../../../assets/discount.png";

export default class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cart: [],
			coupons: [],
			selectedCoupon: "",
			currentUser: "",
			products: [],
			total: 0,
			outStockList: [],
			outStock: false,
			acTotal: 0,
		};
	}

	componentDidMount() {
		this.handleInit();
	}

	handleInit = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("users")
					.where("uid", "==", user.uid)
					.onSnapshot((snap) => {
						snap.docChanges().forEach((change) => {
							var products = [];
							change.doc.data().cart.forEach(async (item) => {
								console.log(item);
								await firebase
									.firestore()
									.collection("products")
									.doc(item.id)
									.get()
									.then((doc) => {
										if (doc.exists) {
											console.log("53 Doc Exist:", doc.id);
											var product = doc.data();
											product.id = doc.id;
											products.push(product);
											if (doc.data().quantity === 0 && !this.state.outStockList.includes(item.id)) {
												this.setState({
													outStockList: [...this.state.outStockList, item.id],
													outStock: true,
												});
											}
											if (products.length === change.doc.data().cart.length) {
												var total = 0;
												change.doc
													.data()
													.cart.reverse()
													.map((data, index) => {
														// alert(products[index].id + change.doc.data().cart[index].id + item.id)
														if (data.id === products[index].id) {
															total += products[index].sp * data.quantity;
															console.log(total);
														}
													});
												this.setState({
													cart: change.doc.data().cart,
													products: products,
													currentUser: change.doc.data(),
													total: total,
													acTotal: total,
												});
											}
										} else {
											console.log("67 Doc does not Exist:", doc.id);
											toaster.notify("A product in your cart does not exist");
											var cart = [];
											cart = change.doc.data().cart.filter((item2) => item2.id !== item.id);
											this.setState({
												cart: cart,
											});
											firebase.firestore().collection("users").doc(change.doc.id).update({
												cart: cart,
											});
										}
									});
							});
						});
					});
			} else {
				var cart = JSON.parse(localStorage.getItem("cart"));
				this.setState(
					{
						cart: cart ? cart : [],
					},
					() => {
						this.state.cart.forEach((item) => {
							firebase
								.firestore()
								.collection("products")
								.doc(item.id)
								.get()
								.then((doc) => {
									if (doc.data() === undefined) {
										toaster.notify("A product in your cart does not exist");
										var cart = [];
										cart = this.state.cart.filter((item2) => item2.id !== item.id);
										this.setState({
											cart: cart,
										});
										localStorage.setItem("cart", JSON.stringify(cart));
									} else {
										var product = doc.data();
										product.id = doc.id;
										console.log(product);
										this.setState({
											products: [...this.state.products, product],
										});
										if (doc.data().quantity === 0 && !this.state.outStockList.includes(item.id)) {
											this.setState({
												outStockList: [...this.state.outStockList, item.id],
												outStock: true,
											});
										}
									}
								});
						});
					}
				);
			}
		});
		firebase
			.firestore()
			.collection("settings")
			.get()
			.then((snap) => {
				snap.forEach((doc) => {
					this.setState({
						coupons: doc.data().coupons,
					});
				});
			});
	};

	handleChange(e) {
		this.setState(
			{
				selectedCoupon: this.state.coupons[e.target.value],
			},
			() => {
				var total = this.state.acTotal;
				if (this.state.selectedCoupon.type === "money") {
					total -= this.state.selectedCoupon.value;
				} else {
					total -= total * (this.state.selectedCoupon.value / 100);
				}
				this.setState({
					total: Math.round(total),
				});
			}
		);
	}

	removeFromCart = (id) => {
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
						var newCart = cart.filter((item) => {
							return item.id !== id;
						});
						var outOfStock = this.state.outStockList.filter((item) => item !== id);
						if (outOfStock.length === 0) {
							this.setState({
								outStock: false,
							});
						}
						firebase
							.firestore()
							.collection("users")
							.doc(doc.id)
							.update({
								cart: newCart,
							})
							.then(() => {
								this.setState({
									cart: newCart,
									outStockList: outOfStock,
								});
							});
					});
				});
		} else {
			var cart = JSON.parse(localStorage.getItem("cart"));
			var newCart = [];
			cart.forEach((car) => {
				if (car.id !== id) {
					newCart.push(car);
				}
			});
			var outOfStock = this.state.outStockList.filter((item) => item !== id);
			if (outOfStock.length === 0) {
				this.setState({
					outStock: false,
				});
			}
			this.setState({
				cart: newCart,
				outStockList: outOfStock,
			});
			localStorage.setItem("cart", JSON.stringify(newCart));
			this.props.handleInit();
			return newCart;
		}
	};

	handleminus = (id) => {
		if (firebase.auth().currentUser) {
			firebase
				.firestore()
				.collection("users")
				.where("uid", "==", firebase.auth().currentUser.uid)
				.get()
				.then((snap) => {
					snap.forEach((doc) => {
						var cart = doc.data().cart;
						cart.map((item) => {
							if (item.id === id) {
								if (item.quantity > 1) {
									item.quantity -= 1;
								} else {
									this.removeFromCart(id);
								}
							}
						});
						firebase.firestore().collection("users").doc(doc.id).update({
							cart: cart,
						});
					});
				});
		} else {
			var cart = this.state.cart;
			cart.forEach((item) => {
				if (item.id === id) {
					if (item.quantity > 1) {
						item.quantity -= 1;
					} else {
						var newCart = this.removeFromCart(id);
						cart = newCart;
					}
				}
			});
			this.setState({
				cart: cart,
			});
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	};

	handleplus = (id) => {
		if (firebase.auth().currentUser) {
			firebase
				.firestore()
				.collection("users")
				.where("uid", "==", firebase.auth().currentUser.uid)
				.get()
				.then((snap) => {
					snap.forEach((doc) => {
						var cart = doc.data().cart;
						cart.forEach((item) => {
							if (item.id === id && item.quantity < parseInt(item.max)) {
								item.quantity += 1;
							}
						});
						firebase.firestore().collection("users").doc(doc.id).update({
							cart: cart,
						});
					});
				});
		} else {
			var cart = this.state.cart;
			cart.forEach((item) => {
				if (item.id === id) {
					item.quantity += 1;
				}
			});
			localStorage.setItem("cart", JSON.stringify(cart));
			this.setState({
				cart: cart,
			});
		}
	};

	render() {
		var total = this.state.total;
		// if (this.state.products.length > 0) {
		// 	this.state.cart.forEach((data, index) => {
		// 		console.log('292', data, index);
		// 		console.log(this.state.products[1].id);
		// 		if (data.id === this.state.products[index].id) {
		// 			total += this.state.products[index].sp * data.quantity;
		// 			console.log(total);
		// 		}
		// 	});
		// }

		return (
			<div className={this.props.active ? "cart-cont active" : "cart-cont"}>
				<div className='blank' onClick={this.props.close}></div>
				<div className={this.props.active ? "cart active" : "cart"}>
					<div className='cart-head'>
						<h2>SHOPPING CART</h2>
						<i className='fa fa-times fa-1x' onClick={this.props.close}></i>
					</div>
					<div className='cart-body'>
						{this.state.cart.length > 0 ? (
							this.state.cart.map((item, index) => (
								<div className='list' key={index}>
									{this.state.outStockList.includes(item.id) ? (
										<CartCard
											item={item}
											removeFromCart={(e) => {
												this.removeFromCart(e);
											}}
											handleplus={() => {
												this.handleplus(item.id);
											}}
											handleminus={() => {
												this.handleminus(item.id);
											}}
											id={index}
											show={true}
											grey={true}
										/>
									) : (
										<CartCard
											item={item}
											removeFromCart={(e) => {
												this.removeFromCart(e);
											}}
											handleplus={() => {
												this.handleplus(item.id);
											}}
											handleminus={() => {
												this.handleminus(item.id);
											}}
											id={index}
											show={true}
											grey={false}
										/>
									)}
								</div>
							))
						) : (
							<div
								style={{
									width: "100%",
									height: "40vh",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexDirection: "column",
								}}>
								<Lottie options={{ animationData: empty }} width={150} height={150} />
								<p
									style={{
										fontSize: "14px",
										fontWeight: "bold",
										color: "#313131",
									}}>
									No items in cart
								</p>
							</div>
						)}
					</div>
					<div className='cart-checkout'>
						<div className='apply-coupon'>
							<h3>APPLY COUPON</h3>
							<input type='text' name='coupon' id='coupon' placeholder='Example: ABCD' />
							<div className='avail-coupon'>
								<p>Available Coupons</p>
								{this.state.coupons.map((item, index) => {
									if (item.active === "Active") {
										return (
											<div className='coupon-selector' key={index}>
												<div className='coupon-title'>
													<img src={discount} alt='' />
													<div className='paragraphs'>
														<p className='coupon-name'>{item.name}</p>
														<p className='coupon-details'>({item.description})</p>
													</div>
												</div>
												<input
													type='radio'
													name='coupon-select'
													id='selector'
													value={index}
													onChange={(e) => this.handleChange(e)}
												/>
											</div>
										);
									}
								})}
							</div>
						</div>
						{this.state.cart.length > 0 ? (
							<button
								className='checkout-btn'
								onClick={() =>
									this.state.outStock
										? toaster.notify("Your cart contains an out of stock product, please remove it")
										: (window.location.href =
												this.state.selectedCoupon !== ""
													? "/Cart/Checkout/coupon:" + this.state.selectedCoupon.name
													: "/Cart/Checkout/coupon:" + " ?")
								}>
								<p>CHECKOUT &#8377;{total}</p>
							</button>
						) : (
							<button className='checkout-btn-disabled'>
								<p>CHECKOUT</p>
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}
}
