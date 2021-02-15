import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/image_1.png";
import "./HamburgerMenu.css";
import firebase from "firebase";
import { auth } from "../../../config/firebaseConfig";

export default class HamburgerMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			open: null,
			currentUser: {},
		};
		this.windowOffSet = 0;
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("users")
					.where("email", "==", user.email)
					.get()
					.then((snap) => {
						snap.forEach((doc) => {
							this.setState({
								currentUser: doc.data(),
							});
						});
					});
			}
		});
		firebase
			.firestore()
			.collection("settings")
			.onSnapshot((snap) => {
				snap.docChanges().forEach((change) => {
					this.setState({
						categories: change.doc.data().categories,
						loading: false,
					});
				});
			});
	}

	render() {
		return (
			<div className={this.props.active ? "menu-ham active" : "menu-ham"}>
				<div className={this.props.active ? "hamburger-menu active" : "hamburger-menu"}>
					<div className='head'>
						<div className='logo'>
							<img src={logo} alt='Marfit Logo' className='logo-img' />
						</div>
						<i className='fa fa-times fa-1x' onClick={() => this.props.close(this.windowOffSet)}></i>
					</div>
					<div className='ham-list'>
						{this.props.login ? (
							<p
								className='box orange'
								onClick={() => {
									this.props.logout();
									this.props.close();
								}}>
								<span style={{ cursor: "pointer", userSelect: "none" }}>Logout</span>
								<i className='fa fa-sign-out-alt fa-1x'></i>
							</p>
						) : (
							<p
								className='box orange'
								onClick={() => {
									this.props.handleLogin();
									this.props.close();
								}}>
								<span style={{ cursor: "pointer", userSelect: "none" }}>Login</span>
								<i className='fa fa-caret-right fa-1x'></i>
							</p>
						)}
						<a href='/' className='box' onClick={() => this.props.close()}>
							<p>Home</p>
						</a>
						<a href='/NewArrivals' className='box hide' onClick={() => this.props.close()}>
							<p style={{ color: "#fb641b" }}>New Arrivals</p>
						</a>
						<a href='/Sale' className='box hide' onClick={() => this.props.close()}>
							<p style={{ color: "#fb641b" }}>Sale</p>
						</a>
						<div className='MiniNav'>
							{this.state.categories.map((cat, index) => {
								return (
									<div
										className={this.state.open === index ? "MiniNav-category opened box" : "MiniNav-category box"}
										key={index}
										onClick={() => (this.state.open === index ? this.setState({ open: null }) : this.setState({ open: index }))}>
										<p>
											{cat.name} <i className={this.state.open === index ? "fa fa-chevron-down fa-1x open-arrow" : "fa fa-chevron-down fa-1x"}></i>
										</p>
										<div className='subcategory-options'>
											{cat.subcategories.map((sub, index) => {
												return (
													<a href={"/Category/" + cat.name + "/" + sub.name} key={index}>
														<img src={sub.image} style={{ width: "30px", objectFit: "contain", marginRight: "5px" }} /> {sub.name}
													</a>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
						{this.props.login ? (
							<>
								<a href='/Dashboard/Orders' className='box disappear' onClick={() => this.props.close()}>
									<p>Orders</p>
								</a>
								<a href to='/Dashboard/Wishlist' className='box disappear' id='wishlist' onClick={() => this.props.close()}>
									<p href='#'>Wishlist</p>
								</a>
								<a href='/Dashboard/Profile' className='box disappear' onClick={() => this.props.close()}>
									<p>Profile</p>
								</a>
								<a href='/Dashboard/Address' className='box disappear' onClick={() => this.props.close()}>
									<p>Address</p>
								</a>
								<a href='/Dashboard/Refer' className='box disappear' onClick={() => this.props.close()}>
									<p>Refer & Earn</p>
								</a>
							</>
						) : null}
						<a href='#' className='box' onClick={() => this.props.close()}>
							<p>Contact us</p>
						</a>
						{this.state.currentUser.points ? (
							<a href='/Dashboard/Refer' className='box' onClick={() => this.props.close()}>
								<p>Points : {this.state.currentUser.points}</p>
							</a>
						) : null}
						<p
							className='box'
							id='cart'
							onClick={() => {
								this.props.cart();
								this.props.close();
							}}>
							<span>Cart</span>
						</p>
					</div>
				</div>
				<div className='blank' onClick={() => this.props.close(this.windowOffSet)}></div>
			</div>
		);
	}
}
