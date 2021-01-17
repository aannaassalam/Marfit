import React from "react";
import "./Card.css";
import firebase from "firebase";
import toaster from "toasted-notes";
import Lottie from "lottie-react-web";
import Order from "../../Pages/Order/order";
import { Link } from "react-router-dom";
import { cssNumber } from "jquery";
import Loading from "../../../assets/loading.json";

export default class Card extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			item: [],
			loading: true,
			isWished: false,
			currentUser: "",
			orderDetail: false,
		};
	}

	componentDidMount() {
		if (typeof this.props.item === "object") {
			firebase
				.firestore()
				.collection("products")
				.doc(this.props.item.id)
				.onSnapshot((product) => {
					if (product.exists) {
						var p = product.data();
						p.id = product.id;
						console.log("34", p.sp);
						this.setState(
							{
								item: p,
								loading: false,
							},
							() => {
								firebase.auth().onAuthStateChanged((user) => {
									if (user) {
										firebase
											.firestore()
											.collection("users")
											.where("uid", "==", user.uid)
											.get()
											.then((snap) =>
												snap.forEach((doc) => {
													var wishlist = doc.data().wishlist;
													var currentUser = {};
													currentUser.email = doc.data().email;
													currentUser.id = doc.id;
													this.setState({
														currentUser: currentUser,
													});
													wishlist.forEach((item) => {
														console.log(item);
														console.log(this.state.item.id);
														if (item === this.state.item.id) {
															console.log("here");
															this.setState({
																isWished: true,
															});
														}
													});
												})
											);
									} else {
										this.setState({ currentUser: "" });
									}
								});
							}
						);
					} else {
						this.setState({
							loading: false,
						});
					}
				});
		} else {
			firebase
				.firestore()
				.collection("products")
				.doc(this.props.item)
				.onSnapshot((product) => {
					if (product.exists) {
						var p = product.data();
						p.id = product.id;
						this.setState(
							{
								item: p,
								loading: false,
							},
							() => {
								firebase.auth().onAuthStateChanged((user) => {
									if (user) {
										firebase
											.firestore()
											.collection("users")
											.where("uid", "==", user.uid)
											.get()
											.then((snap) =>
												snap.forEach((doc) => {
													var wishlist = doc.data().wishlist;
													var currentUser = {};
													currentUser.email = doc.data().email;
													currentUser.id = doc.id;
													this.setState({
														currentUser: currentUser,
													});
													wishlist.forEach((item) => {
														if (item === this.state.item.id) {
															this.setState({
																isWished: true,
															});
														}
													});
												})
											);
									} else {
										this.setState({ currentUser: "" });
									}
								});
							}
						);
					} else {
						this.setState({
							loading: false,
						});
					}
				});
		}
	}

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
						if (item === this.state.item.id) {
							found = true;
						}
					});
					if (found === false) {
						this.setState({
							isWished: true,
						});
						wishlist.push(this.state.item.id);
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
							if (item !== this.state.item.id) {
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
								toaster.notify(" Item removed from your wishlist");
								this.setState({
									isWished: false,
								});
							});
					}
				});
			});
	};

	render() {
		var percent = Math.round((this.state.item.sp / this.state.item.cp) * 100);
		return (
			<>
				{this.state.item.title ? (
					<div
						className={this.state.item.quantity > 0 ? "card-cont" : "card-cont grey"}
						onClick={
							this.state.item.quantity > 0
								? null
								: () => (window.location.href = "/Category/" + this.state.item.category + "/" + this.state.item.subCategory + "/" + this.state.item.id)
						}>
						{!this.state.item.quantity > 0 ? <p className='outOfStock'>OUT OF STOCK</p> : null}
						{this.state.loading ? (
							<Lottie options={{ animationData: Loading }} width={100} height={100} position={"absolute"} top={0} />
						) : (
							<>
								<div className='img-container'>
									<a
										style={{ width: "100%", height: "100%" }}
										href={"/Category/" + this.state.item.category + "/" + this.state.item.subCategory + "/" + this.state.item.id}>
										<img src={this.state.item.images[0]} alt='Bag-Icon' />
									</a>
								</div>
								{this.state.currentUser && this.state.currentUser.email ? (
									<>
										{this.state.isWished ? (
											<div className='circle' onClick={() => this.removeFromWishlist(this.state.item.id)}>
												<i className='red fa fa-heart'></i>
											</div>
										) : (
											<div className='circle' onClick={() => this.addToWishlist(this.state.item.id)}>
												<i className='fa fa-heart'></i>
											</div>
										)}
									</>
								) : null}

								<a href={"/Category/" + this.state.item.category + "/" + this.state.item.subCategory + "/" + this.state.item.id} className='short-description'>
									<p className='item-title'>{this.state.item.title}</p>
									<p className='item-price'>&#8377;{this.state.item.sp}</p>
									<div className='price-flex'>
										<p className='price-line-through'>&#8377;{this.state.item.cp}</p>
										<p className='discount'>{100 - percent}% off</p>
									</div>
								</a>
							</>
						)}
					</div>
				) : null}
			</>
		);
	}
}
