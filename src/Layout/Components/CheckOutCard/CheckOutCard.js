import React from "react";
import remove from "./remove.svg";
import truck from "./truck.svg";
import firebase from "firebase";
import "./CheckOutCard.css";
import toaster from "toasted-notes";

export default class CheckOutCard extends React.Component {
	constructor() {
		super();
		this.state = {
			productInfo: {},
			quantity: 0,
		};
	}

	componentDidMount() {
		firebase
			.firestore()
			.collection("products")
			.doc(this.props.info.id)
			.get()
			.then((snap) => {
				var productInfo = snap.data();
				productInfo.id = snap.id;
				if (productInfo.quantity > 0) {
					if (this.props.info.size === "null") {
						if (productInfo.quantity >= this.props.info.quantity && productInfo.max >= this.props.info.quantity) {
							this.setState({
								productInfo: productInfo,
								quantity: this.props.info.quantity,
							});
						} else {
							this.setState(
								{
									NF: true,
									quantity: 1,
								},
								() => {
									this.handleRemove();
								}
							);
						}
					} else {
						productInfo.sizes.map((size) => {
							if (size.name === this.props.info.size) {
								if (size.quantity >= this.props.info.quantity && productInfo.max >= this.props.info.quantity) {
									this.setState({
										productInfo: productInfo,
										quantity: this.props.info.quantity,
									});
								} else {
									this.setState(
										{
											NF: true,
											quantity: 1,
										},
										() => {
											this.handleRemove();
										}
									);
								}
							}
						});
					}
				} else {
					this.setState(
						{
							NF: true,
							quantity: 1,
						},
						() => {
							this.handleRemove();
						}
					);
				}
			});
	}

	handleRemove = async () => {
		var q = this.state.quantity - 1;
		if (q >= 0) {
			var snap = await firebase.firestore().collection("users").doc(this.props.currentUser.id).get();
			if (snap) {
				var data = snap.data();
				var newCart = [];
				if (q !== 0) {
					newCart = data.cart;
					newCart.map((c) => {
						if (c.id === this.props.info.id) {
							c.quantity = q;
						}
					});
				} else {
					data.cart.map((c) => {
						if (c.id !== this.props.info.id) {
							newCart.push(c);
						}
					});
				}
				firebase
					.firestore()
					.collection("users")
					.doc(this.props.currentUser.id)
					.update({
						cart: newCart,
					})
					.then(() => {
						this.setState(
							{
								quantity: q,
							},
							() => {
								if (this.state.quantity === 0) {
									this.setState(
										{
											NF: true,
										},
										() => {
											this.props.handleRefresh();
										}
									);
								}
							}
						);
					})
					.catch((err) => {
						toaster.notify("Could Update Quantity");
					});
			}
		}
	};

	handleAdd = () => {
		var q = this.state.quantity + 1;
		firebase
			.firestore()
			.collection("products")
			.doc(this.props.info.id)
			.get()
			.then(async (snap) => {
				var productInfo = snap.data();
				productInfo.id = snap.id;
				if (this.props.info.size === "null") {
					if (productInfo.quantity >= q && productInfo.max >= q) {
						var snap = await firebase.firestore().collection("users").doc(this.props.currentUser.id).get();
						if (snap) {
							var data = snap.data();
							data.cart.map((c) => {
								if (c.id === this.props.info.id) {
									c.quantity = q;
								}
							});
							firebase
								.firestore()
								.collection("users")
								.doc(this.props.currentUser.id)
								.update({
									cart: data.cart,
								})
								.then(() => {
									this.setState({
										quantity: q,
									});
								})
								.catch((err) => {
									toaster.notify("Could Update Quantity");
								});
						}
					} else {
						toaster.notify("You cannot add more quanity");
					}
				} else {
					productInfo.sizes.map(async (size) => {
						if (size.name === this.props.info.size) {
							if (size.quantity >= q && productInfo.max >= q) {
								var snap = await firebase.firestore().collection("users").doc(this.props.currentUser.id).get();
								if (snap) {
									var data = snap.data();
									data.cart.map((c) => {
										if (c.id === this.props.info.id) {
											c.quantity = q;
										}
									});
									firebase
										.firestore()
										.collection("users")
										.doc(this.props.currentUser.id)
										.update({
											cart: data.cart,
										})
										.then(() => {
											this.setState({
												quantity: q,
											});
										})
										.catch((err) => {
											toaster.notify("Could Update Quantity");
										});
								}
							} else {
								toaster.notify("You cannot add more quanity");
							}
						}
					});
				}
			});
	};

	render() {
		return (
			<>
				{this.state.NF ? null : (
					<div className='prod-card'>
						<div className='card-content'>
							<div className='left-img'>
								<a href={"/Category/" + this.state.productInfo.category + "/" + this.state.productInfo.subCategory + "/" + this.state.productInfo.id}>
									<img src={this.state.productInfo.images && this.state.productInfo.images[0]} alt='prod-img' />
								</a>
							</div>
							<div className='right-details'>
								<div className='item-name'>
									<a href={"/Category/" + this.state.productInfo.category + "/" + this.state.productInfo.subCategory + "/" + this.state.productInfo.id}>
										<p>{this.state.productInfo.title}</p>
									</a>
									<div className='delete' onClick={() => this.props.handleDelete(this.props.info)}>
										<img src={remove} alt='remove' />
										<p>Delete</p>
									</div>
								</div>
								<div className='item-price-time'>
									<div className='tenure'>
										<p>&#8377; {this.state.productInfo.sp}</p>
										<span>
											<span style={{ textDecoration: "line-through", marginRight: "2px" }}>&#8377; {this.state.productInfo.cp}</span>
											<span style={{ color: "#fb6b25" }}>{100 - Math.round((this.state.productInfo.sp / this.state.productInfo.cp) * 100)}% off</span>
										</span>
									</div>
									{this.props.info.size !== "null" ? (
										<div className='tenure'>
											<p style={{ textTransform: "uppercase" }}>{this.props.info.size}</p>
											<span>Size</span>
										</div>
									) : null}
									<div className='tenure'>
										<p>
											<button onClick={this.handleRemove} className='qbtn'>
												<p>-</p>
											</button>
											{this.state.quantity}
											<button onClick={this.handleAdd} className='qbtn'>
												<p>+</p>
											</button>
										</p>
										<span>Quantity</span>
									</div>
									<div className='tenure'>
										<p>Delivery in 2-3 days</p>
										<span>7 Days Replacement Policy</span>
									</div>
								</div>
								<div className='item-delivery'>
									<img src={truck} alt='truck' />
									<p>Delivery Charge :</p>
									<p>{this.state.productInfo.shippingCharge !== 0 ? "₹ " + this.state.productInfo.shippingCharge : "Free"}</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
}
