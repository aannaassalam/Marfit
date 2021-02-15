import React from "react";
import "./Login.css";
import logo from "../../../assets/image_1.png";
import marfit from "../../../assets/marfit-label.png";
import google from "../../../assets/google.png";
import fb from "../../../assets/fb.png";
import loginBag from "../../../assets/login bag.jpg";
import firebase from "firebase";
import { signInWithGoogle } from "../../../config/firebaseConfig";
import loading from "../../../assets/loading.json";
import Lottie from "lottie-react-web";
import toaster from "toasted-notes";
import "toasted-notes/src/styles.css";
import axios from "axios";
import link from "../../../fetchPath";
import "react-phone-input-2/lib/material.css";
import PhoneInput from "react-phone-input-2";

const otpGenerator = require("otp-generator");

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		for (var i = 1; i <= 6; i++) {
			this["c" + i] = React.createRef();
		}
		this.state = {
			toggle: "login",
			checked: false,
			username: "",
			email: "",
			password: "",
			loading: false,
			forgotpass: false,
			resetEmail: "",
			referal: "",
			showNext: false,
			otp: 0,
			showOTP: false,
			showPassword: false,
			c1: "",
			c2: "",
			c3: "",
			c4: "",
			c5: "",
			c6: "",
			phone: "",
		};
	}

	handleCheck = () => {
		this.setState({
			checked: !this.state.checked,
		});
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	};

	handleRegister = () => {
		if (this.state.username === "") {
			toaster.notify("Please enter a username");
		} else if (this.state.checked === false) {
			toaster.notify("Please accept the terms");
		} else {
			this.setState({
				loadingNext: true,
			});
			let phoneNumber = "+91" + this.state.phone;
			if (this.state.referal.length > 0) {
				firebase
					.firestore()
					.collection("users")
					.where("referalID", "==", this.state.referal)
					.get()
					.then((snap) => {
						if (snap.size > 0) {
							firebase
								.firestore()
								.collection("users")
								.add({
									email: "",
									name: this.state.username,
									orders: [],
									addresses: [],
									phone: phoneNumber,
									dob: "",
									gender: "",
									alt: "",
									cart: [],
									wishlist: [],
									referalID: "",
									points: 10,
									uid: this.state.user.uid,
									couponsUsed: [],
									poinstsHistory: [],
								})
								.then((res) => {
									var referal = res.id.substr(16, 4) + phoneNumber.substr(0, 2);
									firebase
										.firestore()
										.collection("users")
										.doc(res.id)
										.update({
											referalID: referal,
										})
										.then(() => {
											this.setState({
												loadingNext: false,
												showNext: false,
												showOTP: false,
											});
											this.props.login(true);
											this.props.close(false);
										});
								})
								.catch((err) => {
									toaster.notify(err.message);
									this.setState({
										loadingNext: false,
										showNext: false,
										showOTP: false,
									});
								});
						} else {
							toaster.notify("Invalid Referal Code");
							this.setState({
								loadingNext: false,
								showNext: false,
								showOTP: false,
							});
						}
					})
					.catch((err) => {
						toaster.notify(err.message);
						this.setState({
							loadingNext: false,
							showNext: false,
							showOTP: false,
						});
					});
			} else {
				firebase
					.firestore()
					.collection("users")
					.add({
						email: "",
						name: this.state.username,
						orders: [],
						addresses: [],
						phone: phoneNumber,
						dob: "",
						gender: "",
						alt: "",
						cart: [],
						wishlist: [],
						referalID: "",
						points: 0,
						uid: this.state.user.uid,
						couponsUsed: [],
						poinstsHistory: [],
					})
					.then((res) => {
						var referal = res.id.substr(16, 4) + phoneNumber.substr(0, 2);
						firebase
							.firestore()
							.collection("users")
							.doc(res.id)
							.update({
								referalID: referal,
							})
							.then(() => {
								this.setState({
									loadingNext: false,
									showNext: false,
									showOTP: false,
								});
								this.props.login(true);
								this.props.close(false);
							});
					})
					.catch((err) => {
						toaster.notify(err.message);
						this.setState({
							loadingNext: false,
							showNext: false,
							showOTP: false,
						});
					});
			}
		}
	};

	setUpRecaptcha = () => {
		window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
			size: "invisible",
			callback: function (response) {
				console.log("Captcha Resolved");
				this.onSignInSubmit();
			},
			defaultCountry: "IN",
		});
	};

	onSignInSubmit = () => {
		this.setState({
			loadingNext: true,
		});
		this.setUpRecaptcha();
		let phoneNumber = "+91" + this.state.phone;
		console.log("486", phoneNumber);
		let appVerifier = window.recaptchaVerifier;
		firebase
			.auth()
			.signInWithPhoneNumber(phoneNumber, appVerifier)
			.then((confirmationResult) => {
				// SMS sent. Prompt user to type the code from the message, then sign the
				// user in with confirmationResult.confirm(code).
				this.setState({
					showOTP: true,
					loadingNext: false,
					showNext: true,
				});
				this.c1.current.focus();
				window.confirmationResult = confirmationResult;
				// console.log(confirmationResult);
				toaster.notify("OTP is sent");
			})
			.catch((error) => {
				console.log(error);
				toaster.notify(error.message);
				this.setState({
					loadingNext: false,
				});
			});
	};

	onSubmitOtp = () => {
		this.setState({
			loadingNext: true,
		});
		let phoneNumber = "+91" + this.state.phone;
		let otpInput = this.state.c1 + this.state.c2 + this.state.c3 + this.state.c4 + this.state.c5 + this.state.c6;
		let optConfirm = window.confirmationResult;
		// console.log(codee);
		optConfirm
			.confirm(otpInput)
			.then(async (result) => {
				var user = result.user;
				this.setState({
					user,
				});
				var snaps = await firebase.firestore().collection("users").where("phone", "==", phoneNumber).get();
				console.log(snaps.size);
				if (snaps.size > 0) {
					this.setState({
						loadingNext: false,
						showNext: false,
						showOTP: false,
					});
					this.props.login(true);
					this.props.close(false);
				} else {
					toaster.notify("Please fill the details !");
					this.setState({
						toggle: "register",
						loadingNext: false,
					});
				}
			})
			.catch((error) => {
				console.log(error);
				this.setState({
					loadingNext: false,
				});
				toaster.notify("Incorrect OTP");
			});
	};

	handleGoogleLogin = () => {
		var props = this.props;
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.setCustomParameters({
			login_hint: "user@example.com",
		});
		firebase
			.auth()
			.signInWithPopup(provider)
			.then(function (result) {
				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = result.credential.accessToken;
				// The signed-in user info.
				var user = result.user;
				firebase
					.firestore()
					.collection("users")
					.where("email", "==", user.email)
					.get()
					.then((snap) => {
						if (snap.size === 0) {
							firebase
								.firestore()
								.collection("users")
								.add({
									email: user.email,
									name: user.displayName,
									orders: [],
									addresses: [],
									phone: "",
									dob: "",
									gender: "",
									alt: "",
									cart: [],
									wishlist: [],
									referalID: "",
									points: 0,
									uid: user.uid,
									couponsUsed: [],
									poinstsHistory: [],
								})
								.then(() => {
									props.login(true);
									props.close(false);
								})
								.catch((err) => {
									toaster.notify(err.message);
								});
						} else {
							props.login(true);
							props.close(false);
						}
					});
				// ...
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	handleFacebookLogin = () => {
		var props = this.props;
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.setCustomParameters({
			login_hint: "user@example.com",
		});
		firebase
			.auth()
			.signInWithPopup(provider)
			.then(function (result) {
				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = result.credential.accessToken;
				// The signed-in user info.
				var user = result.user;
				firebase
					.firestore()
					.collection("users")
					.where("email", "==", user.email)
					.get()
					.then((snap) => {
						if (snap.size === 0) {
							firebase
								.firestore()
								.collection("users")
								.add({
									email: user.email,
									name: user.displayName,
									orders: [],
									addresses: [],
									phone: "",
									dob: "",
									gender: "",
									alt: "",
									cart: [],
									wishlist: [],
									referalID: "",
									points: 0,
									uid: user.uid,
								})
								.then(() => {
									props.login(true);
									props.close(false);
								})
								.catch((err) => {
									toaster.notify(err.message);
								});
						} else {
							props.login(true);
							props.close(false);
						}
					});
				// ...
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	handleChangeCode = (e) => {
		var { id, value } = e.target;
		this.setState(
			{
				[id]: value,
			},
			() => {
				console.log(id);
				var num = parseInt(id[1]) + 1;
				var num2 = parseInt(id[1]) - 1;
				var num3 = parseInt(id[1]);
				if (num < 7 && value && num3 !== 6) {
					this["c" + num].current.focus();
				} else if (value === "" && num2 > 0) {
					this["c" + num2].current.focus();
				} else if (num3 === 6) {
					this.onSubmitOtp();
				}
			}
		);
	};

	render() {
		var inpuCode = [];
		for (var i = 1; i <= 6; i++) {
			inpuCode.push("c" + i);
		}
		return (
			<div className='login-container'>
				<div className='login'>
					<i
						className='fa fa-times fa-1x'
						onClick={() => {
							firebase.auth().signOut();
							this.props.close(false);
							document.body.setAttribute("style", "");
							window.scrollTo(0, this.props.windowOffSet);
						}}></i>
					{/* <div className='section-1'>
						<img src={loginBag} alt='' />
					</div> */}
					{this.state.toggle === "register" ? (
						<div className='register-form'>
							<div className='marfit-img'>
								<img src={logo} alt='Marfit logo' />
								<img src={marfit} alt='Marfit title' />
							</div>
							<div className='input-fields'>
								<input type='text' name='username' placeholder='Username' onChange={this.handleChange} maxLength={10} />
								<input type='text' name='referal' placeholder='Referal code  (optional)' onChange={this.handleChange} />
							</div>
							<div className='agree'>
								<input type='checkbox' name='checkbox' id='check' checked={this.state.checked} onChange={this.handleCheck} />
								<p className='conditions'>
									I agree to the{" "}
									<a href='#' className='terms'>
										TERMS & CONDITION
									</a>{" "}
									&{" "}
									<a href='#' className='policy'>
										PRIVACY POLICY
									</a>
								</p>
							</div>
							{this.state.loadingNext ? (
								<Lottie options={{ animationData: loading }} width={50} height={50} />
							) : (
								<button type='button' className='btn-next' id='btn' onClick={this.handleRegister}>
									Register
								</button>
							)}

							<div className='lines'>
								<div className='horizontal'></div>
								<div className='or'>OR</div>
								<div className='horizontal'></div>
							</div>
							<div className='social'>
								<img src={google} alt='Google Image' onClick={this.handleGoogleLogin} />
							</div>
						</div>
					) : (
						<div className='login-form'>
							<div className='marfit-img'>
								<img src={logo} alt='Marfit logo' />
								<img src={marfit} alt='Marfit title' />
							</div>
							<div id='recaptcha-container'></div>
							{this.state.toggle === "login" && this.state.showOTP ? (
								<div className='otp-cont'>
									<div className='vrf'>
										<p>Enter 6 digit verification code send to your phone number</p>
									</div>
									<div className='verification-cont'>
										{inpuCode.map((item) => {
											return (
												<div className='code-verification'>
													<input maxLength={1} id={item} type='text' value={this.state[item]} onChange={this.handleChangeCode} name={item} ref={this[item]} />
												</div>
											);
										})}
									</div>
								</div>
							) : (
								<div className='input-fields'>
									<PhoneInput
										country={"in"}
										onlyCountries={["in"]}
										disableDropdown={true}
										disableCountryCode={true}
										value={this.state.phone}
										onChange={(phone) => this.setState({ phone })}
										placeholder='Enter your phone number'
									/>
								</div>
							)}

							{this.state.showNext ? (
								<>
									{this.state.loadingNext ? (
										<Lottie options={{ animationData: loading }} width={50} height={50} />
									) : (
										<>
											{this.state.showOTP ? (
												<button type='button' className='btn-next' onClick={this.onSubmitOtp}>
													Verify & Login
												</button>
											) : (
												<button className='btn-next' type='button' onClick={this.handleLogin}>
													Login
												</button>
											)}
										</>
									)}
								</>
							) : (
								<>
									{this.state.loadingNext ? (
										<Lottie options={{ animationData: loading }} width={50} height={50} />
									) : (
										<button className='btn-next' type='button' onClick={this.onSignInSubmit}>
											Next
										</button>
									)}
								</>
							)}
							<div className='lines'>
								<div className='horizontal'></div>
								<div className='or'>OR</div>
								<div className='horizontal'></div>
							</div>
							<div className='social'>
								<img src={google} alt='Google Image' onClick={this.handleGoogleLogin} />
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}
