import React from "react";
import { motion } from "framer-motion";
import "./ProductList.style.css";
import Filter from "../../../Components/Filter/Filter.component";
import Card from "../../../Components/Card2/Card";
import firebase from "firebase";
import Lottie from "lottie-react-web";
import empty from "../629-empty-box.json";
import circular from "../../../../assets/circular loading.json";
import Loader from "../../../Components/Loader/Loader";
import loading from "../../../../assets/loading.json";
import toaster from "toasted-notes";

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

class ProductList extends React.Component {
	constructor() {
		super();
		this.state = {
			productList: [],
			categories: [],
			filterProductList: [],
			type: [],
			outStock: true,
			loading: true,
			month: 3,
			min: 0,
			max: 0,
			filter: false,
			productLoading: false,
			colors: [],
			presentColor: "All",
			subcategory: "All",
			category: "All",
			sortType: "Relevance",
		};
	}

	componentDidMount() {
		this.handleInit();
		firebase
			.firestore()
			.collection("settings")
			.onSnapshot((snap) => {
				snap.docChanges().forEach((change) => {
					var categories = change.doc.data().categories;
					var c, s;
					categories.map((category) => {
						if (category.name === this.props.match.params.id1) {
							c = category;
							category.subcategories.map((sub) => {
								if (sub.name === this.props.match.params.id2) {
									s = sub;
								}
							});
						}
					});
					this.setState({
						categories: categories,
						category: c,
						subcategory: s,
					});
				});
			});
	}

	handleInit = () => {
		var find1 = this.props.match.params.id1;
		var find2 = this.props.match.params.id2;
		firebase
			.firestore()
			.collection("products")
			.orderBy("date", "desc")
			.get()
			.then((snap) => {
				var productList = [];
				var min = 100;
				var max = 0;
				var colors = [];
				snap.forEach((doc) => {
					var product = doc.data();
					product.id = doc.id;
					productList.push(product);
					if (!colors.includes(doc.data().color)) {
						colors.push(doc.data().color);
					}
				});
				productList.map((product) => {
					if (min > product.sp) {
						min = product.sp;
					}
					if (max < product.sp) {
						max = product.sp;
					}
				});
				this.setState(
					{
						productList: productList,
						filterProductList: productList,
						colors: colors,
						min: min,
						max: max,
						loading: false,
					},
					() => {
						this.handleFilterIt();
					}
				);
			});
	};

	handleMonths = (e) => {
		var products = this.state.productList;
		var newproducts = [];
		products.map((product) => {
			if (product.max >= e) {
				newproducts.push(product);
			}
		});
		this.setState({
			filterProductList: newproducts,
			month: e,
		});
	};

	handleProductAddType = (e) => {
		var products = this.state.productList;
		var type = this.state.type;
		type.push(e);
		this.setState(
			{
				type: type,
			},
			() => {
				var newproducts = [];
				products.map((product) => {
					if (this.state.type.includes(product.tag)) {
						newproducts.push(product);
					}
				});
				this.setState({
					filterProductList: newproducts,
				});
			}
		);
	};

	handleProductRemoveType = (e) => {
		var products = this.state.productList;
		var type = this.state.type;
		var type2 = [];
		type.map((t) => {
			if (t !== e) {
				type2.push(t);
			}
		});
		this.setState(
			{
				type: type2,
			},
			() => {
				if (this.state.type.length !== 0) {
					var newproducts = [];
					products.map((product) => {
						if (this.state.type.includes(product.tag)) {
							newproducts.push(product);
						}
					});
					this.setState({
						filterProductList: newproducts,
					});
				} else {
					this.setState({
						filterProductList: products,
					});
				}
			}
		);
	};

	handleShowFilter = () => {
		this.setState({
			filter: !this.state.filter,
		});
	};

	handleRentRange = (min, max) => {
		this.setState(
			{
				min,
				max,
			},
			() => {
				this.handleFilterIt();
			}
		);
	};

	handleProductOutStock = () => {
		this.setState(
			{
				outStock: !this.state.outStock,
			},
			() => {
				this.handleFilterIt();
			}
		);
	};

	handleReset = () => {
		var c, s;
		this.state.categories.map((category) => {
			if (category.name === this.props.match.params.id1) {
				c = category;
				category.subcategories.map((sub) => {
					if (sub.name === this.props.match.params.id2) {
						s = sub;
					}
				});
			}
		});
		this.setState({
			filterProductList: this.state.productList,
			outStock: true,
			type: [],
			month: 3,
			min: 100,
			max: 5000,
			presentColor: "All",
			category: c,
			subcategory: s,
		});
	};

	handleColorFilter = (color) => {
		this.setState(
			{
				presentColor: color,
			},
			() => {
				this.handleFilterIt();
			}
		);
	};

	handleCategory = (e) => {
		this.setState(
			{
				category: e,
				subcategory: "All",
			},
			() => {
				this.handleFilterIt();
			}
		);
	};

	handleSubCategory = (e) => {
		this.setState(
			{
				subcategory: e,
			},
			() => {
				this.handleFilterIt();
			}
		);
	};

	handleSort = (e) => {
		this.setState(
			{
				sortType: e,
			},
			() => {
				this.handleFilterIt();
			}
		);
	};

	handleFilterIt = () => {
		if (this.state.category !== "All") {
			if (this.state.subcategory !== "All") {
				var products = this.state.productList;
				var newproducts = [];
				products.forEach((product) => {
					if (
						product.category === this.state.category.name &&
						product.subCategory === this.state.subcategory.name &&
						product.sp >= this.state.min &&
						product.sp <= this.state.max
					) {
						if (this.state.presentColor !== "All") {
							if (product.color === this.state.presentColor) {
								if (this.state.outStock === false) {
									if (product.quantity > 0) {
										newproducts.push(product);
									}
								} else {
									newproducts.push(product);
								}
							}
						} else {
							if (this.state.outStock === false) {
								if (product.quantity > 0) {
									newproducts.push(product);
								}
							} else {
								newproducts.push(product);
							}
						}
					}
				});
				this.setState(
					{
						filterProductList: [],
						productLoading: true,
					},
					() => {
						this.handleSortIt(newproducts);
					}
				);
			} else {
				var products = this.state.productList;
				var newproducts = [];
				products.forEach((product) => {
					if (product.category === this.state.category.name && product.sp >= this.state.min && product.sp <= this.state.max) {
						if (this.state.presentColor !== "All") {
							if (product.color === this.state.presentColor) {
								if (this.state.outStock === false) {
									if (product.quantity > 0) {
										newproducts.push(product);
									}
								} else {
									newproducts.push(product);
								}
							}
						} else {
							if (this.state.outStock === false) {
								if (product.quantity > 0) {
									newproducts.push(product);
								}
							} else {
								newproducts.push(product);
							}
						}
					}
				});
				this.setState(
					{
						filterProductList: [],
						productLoading: true,
					},
					() => {
						this.handleSortIt(newproducts);
					}
				);
			}
		} else {
			var products = this.state.productList;
			var newproducts = [];
			products.map((product) => {
				if (product.sp >= this.state.min && product.sp <= this.state.max) {
					if (this.state.presentColor !== "All") {
						if (product.color === this.state.presentColor) {
							if (this.state.outStock === false) {
								if (product.quantity > 0) {
									newproducts.push(product);
								}
							} else {
								newproducts.push(product);
							}
						}
					} else {
						if (this.state.outStock === false) {
							if (product.quantity > 0) {
								newproducts.push(product);
							}
						} else {
							newproducts.push(product);
						}
					}
				}
			});
			this.setState(
				{
					filterProductList: [],
					productLoading: true,
				},
				() => {
					this.handleSortIt(newproducts);
				}
			);
		}
	};

	handleSortIt = (e) => {
		var products = e;
		if (this.state.sortType === "lth") {
			products.sort((a, b) => (a.sp > b.sp ? 1 : -1));
			this.setState({
				filterProductList: products,
				productLoading: false,
			});
		} else if (this.state.sortType === "htl") {
			products.sort((a, b) => (a.sp < b.sp ? 1 : -1));
			this.setState({
				filterProductList: products,
				productLoading: false,
			});
		} else {
			this.setState({
				filterProductList: products,
				productLoading: false,
			});
		}
	};

	addToWishlist = (e) => {
		if (firebase.auth().currentUser) {
			firebase
				.firestore()
				.collection("users")
				.where("email", "==", firebase.auth().currentUser.email)
				.get()
				.then((snap) => {
					snap.forEach((doc) => {
						var wishlist = doc.data().wishlist;
						var found = false;
						wishlist.map((item) => {
							if (item.email === e.email && item.id === e.id) {
								found = true;
							}
						});
						if (found === false) {
							e["isWished"] = true;
							wishlist.push(e);
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
		} else {
			toaster.notify("Please Log in");
		}
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
							toaster.notify(" Item removed from your wishlist");
						});
				});
			});
	};

	render() {
		return (
			<>
				{this.state.loading ? (
					<Loader />
				) : (
					<motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition} className='productlist-container'>
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
								</div>

								<div className='bd-menu-stats'>
									{this.props.match.params.id2 ? (
										<p>
											We have total {this.state.filterProductList.length} products under <b>{this.props.match.params.id2}</b> sub-category
										</p>
									) : (
										<p>
											We have total {this.state.filterProductList.length} products under <b>{this.props.match.params.id1}</b> category
										</p>
									)}
								</div>
							</div>
						</div>
						{/* Product List catalogue */}
						<div className='catalogue'>
							<div className='filter'>
								<Filter
									category={this.state.category}
									categories={this.state.categories}
									subcategory={this.state.subcategory}
									handleRentRange={(min, max) => this.handleRentRange(min, max)}
									handleProductOutStock={this.handleProductOutStock}
									sortType={this.state.sortType}
									outStock={this.state.outStock}
									min={this.state.min}
									max={this.state.max}
									month={this.state.month}
									colors={this.state.colors}
									presentColor={this.state.presentColor}
									handleColorFilter={this.handleColorFilter}
									handleCategory={this.handleCategory}
									handleSubCategory={this.handleSubCategory}
									handleReset={this.handleReset}
									handleSort={this.handleSort}
								/>
							</div>

							<div className='card-list-container'>
								{this.state.productLoading ? (
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: "100%",
											height: "100%",
										}}>
										<Lottie options={{ animationData: circular }} width={100} height={100} />
									</div>
								) : (
									<div className='card-list'>
										{this.state.filterProductList.length > 0 ? (
											<>
												{this.state.filterProductList.map((item, index) => {
													console.log(item.sp);
													return (
														<Card
															item={item}
															addToWishlist={(e) => this.addToWishlist(e)}
															removeFromWishlist={(e) => this.removeFromWishlist(e)}
															key={index}
														/>
													);
												})}
											</>
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
								)}
							</div>
						</div>
					</motion.div>
				)}
			</>
		);
	}
}

export default ProductList;
