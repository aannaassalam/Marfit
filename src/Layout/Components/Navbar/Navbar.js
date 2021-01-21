import React from "react";
import "./Navbar.css";
import logo from "../../../assets/image_1.png";
import title from "../../../assets/marfit-label.png";
import Cart from "../../Pages/Cart/Cart";
import Login from "../Login/Login";
import HamburgerMenu from "../HambugerMenu/HamburgerMenu";
import firebase from "../../../config/firebaseConfig";
import Loader from "../Loader/Loader";

export default class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.child = React.createRef();
		this.state = {
			showCart: false,
			login: false,
			loginStatus: false,
			loading: true,
			profile: false,
			currentUser: [],
			hamburgerActive: false,
			showMenu: false,
			searchbtn: false,
			products: [],
			searchedItems: [],
			search: "",
			cartSize: 0,
			currentScroll: "",
			hamburgerOffSet: 0,
			tags:[],
			stags:[]
		};
		this.windowOffSet = 0;
	}

	componentDidMount() {
		window.addEventListener("scroll", this.handleScroll);
		this.handleInit();
	}

	handleInit = () => {
		firebase.firestore().collection('products').get().then(snap=>{
			var tags=[];
			snap.forEach(doc=>{
				if(doc.data().tag)
				{
					var tag=doc.data().tag.split(',');
					for(var i=0;i<tag.length;i++)
					{
						if(!tags.includes(tag[i])){
							tags.push(tag[i])
						}
					}
				}
			});
			this.setState({
				tags
			})
		})
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("users")
					.where("uid", "==", user.uid)
					.onSnapshot((snap) => {
						snap.docs.forEach((doc) => {
							console.log(doc.data());
							this.setState({
								currentUser: doc.data(),
								loginStatus: true,
								isAnonymous: user.isAnonymous,
								loading: false,
								cartSize: doc.data().cart.length,
							});
						});
					});
			} else {
				this.setState({
					loading: false,
					cartSize: JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")).length : 0,
				});
			}
		});
		this.child.current.handleInit();
	};

	handleScroll = () => {
		const currentScroll = window.pageYOffset;
		console.log(window.pageYOffset);
		this.setState(
			{
				currentScroll: currentScroll,
			},
			() => {
				if (this.state.currentScroll < 50) {
					this.setState({
						search: "",
					});
				}
			}
		);
	};

	handleCart = () => {
		this.setState(
			{
				showCart: true,
			},
			() => {
				this.windowOffSet = window.scrollY;
				document.body.setAttribute("style", `position: fixed; top: -${this.windowOffSet}px; left: 0; right: 0;`);
			}
		);
	};

	handleSearch = (e) => {
		console.log(e.target.value);
		var tags=this.state.tags;
		var stags=[];
		tags.map(t=>{
			if(t.toLowerCase().includes(e.target.value.toLowerCase()))
			{
				stags.push(t)
			}
		})
		this.setState({
			[e.target.name]: e.target.value,
			stags:stags
		});
	};

	handleCartClose = () => {
		this.setState(
			{
				showCart: false,
			},
			() => {
				document.body.setAttribute("style", "");
				window.scrollTo(0, this.windowOffSet);
			}
		);
	};

	handleLoginStatus = (toggle) => {
		this.setState({
			loginStatus: toggle,
		});
	};

	handleLogin = () => {
		this.setState({ login: true }, () => {
			this.windowOffSet = window.scrollY;
			document.body.setAttribute("style", `position: fixed; top: -${this.windowOffSet}px; left: 0; right: 0;`);
		});
	};

	handleLogout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				this.setState({
					loginStatus: !this.state.loginStatus,
				});
			});
	};

	handleSearchIt = () => {
		if (this.state.search.replace(/ /g, "").length > 2) {
			window.location.href = "/Search/" + this.state.search;
		}
	};

	handleKeyPress = (e) => {
		if (e.key === "Enter") {
			this.handleSearchIt();
		}
	};

	render() {
		return (
			<nav className='navbar'>
				{this.state.currentScroll > 50 ? (
					<>
						<div className='navScrollContainer'>
							<i
								className='fa fa-bars fa-2x'
								onClick={() => {
									this.setState({ showMenu: true });
								}}></i>
							<div className={this.state.stags.length>0 && this.state.search.length>0?"searchContainer active":"searchContainer"}>
								<div className='input-container'>
									<input
										type='text'
										name='search'
										id='search'
										placeholder='What are you looking for ?'
										onChange={this.handleSearch}
										value={this.state.search}
										onKeyPress={this.handleKeyPress}
										autoComplete="off"
									/>
								</div>
								<button>
									<i className='fa fa-search' onClick={this.handleSearchIt}></i>
								</button>
								{
								this.state.stags.length>0 && this.state.search.length>0
								?
								<div className='suggestions'>
								<div className='suggestions-box'>
									{
										this.state.stags.map(tag=>{
											return (
												<p className='suggest' onClick={()=>{
													this.setState({
														search:tag
													},()=>{
														this.handleSearchIt();
													})
												}}>
												{
													tag
												}
												</p>
											)
										})
									}
								</div>
							</div>
							:
							null
							}
							</div>
						</div>
						<div className='nav-container hide'>
							<div className={this.state.searchbtn ? "first-container-none" : "first-container"}>
								<i
									className='fa fa-bars fa-2x'
									onClick={() => {
										this.setState({ showMenu: true });
									}}
									aria-hidden='true'></i>
								<a href='/' className='logo'>
									<img src={logo} alt='Marfit Logo' className='logo-img' />
									<img src={title} alt='Marfit Title' className='logo-title' />
								</a>
							</div>
							<div className={this.state.stags.length>0 && this.state.search.length>0 ? "second-container active" : "second-container"}>
								<div className='input-container'>
									<input
										type='text'
										name='search'
										id='search'
										placeholder='What are you looking for ?'
										onChange={this.handleSearch}
										value={this.state.search}
										onKeyPress={this.handleKeyPress}
										autoComplete="off"
									/>
								</div>
								<button id='search-btn' onClick={this.handleSearchIt}>
									<i className='fa fa-search'></i>
								</button>
								{
								this.state.stags.length>0 && this.state.search.length>0
								?
								<div className='suggestions'>
								<div className='suggestions-box'>
									{
										this.state.stags.map(tag=>{
											return (
												<p className='suggest' onClick={()=>{
													this.setState({
														search:tag
													},()=>{
														this.handleSearchIt();
													})
												}}>
												{
													tag
												}
												</p>
											)
										})
									}
								</div>
							</div>
							:
							null
							}
							</div>
							<div className={this.state.searchbtn ? "third-container-none" : "third-container"}>
								<i
									className='fas fa-times'
									onClick={() => {
										this.setState({ searchbtn: false });
									}}></i>
								<a
									className='search-icon links'
									onClick={() => {
										this.setState({ searchbtn: true });
									}}>
									<i className='fa fa-search'></i>
								</a>

								{this.state.loading ? (
									<Loader />
								) : (
									<>
										{this.state.loginStatus ? (
											<>
												<div className='profile' style={{ cursor: "pointer", userSelect: "none" }}>
													<a className='username'>
														<p>{this.state.currentUser.name}</p>
														<i className='fas fa-chevron-down'></i>
													</a>
													{/* <div className="arrow-up"></div> */}
													<div className='options'>
														<a href='/Dashboard/Profile' className='option-links' style={{ cursor: "pointer", userSelect: "none" }}>
															<i className='fas fa-user'></i>
															<p>Profile</p>
														</a>
														<a href='/Dashboard/Wishlist' className='option-links' style={{ cursor: "pointer", userSelect: "none" }}>
															<i className='fa fa-heart'></i>
															<p>Wishlist</p>
														</a>
														<a href='/Dashboard/Orders' className='option-links' style={{ cursor: "pointer", userSelect: "none" }}>
															<i className='fas fa-shopping-bag'></i>
															<p>Orders</p>
														</a>
														<a className='option-links' onClick={this.handleLogout} style={{ cursor: "pointer", userSelect: "none" }}>
															<i className='fas fa-sign-out-alt'></i>
															<p>Logout</p>
														</a>
													</div>
												</div>
											</>
										) : (
											<a style={{ cursor: "pointer", userSelect: "none" }} className='login-signup' onClick={this.handleLogin} id='userLogin'>
												<i className='fas fa-user'></i>
												<p>LOGIN/SIGN UP</p>
											</a>
										)}
										<a style={{ cursor: "pointer", userSelect: "none" }} className='links' onClick={this.handleCart} id='cartId'>
											<i className='fas fa-shopping-cart'></i>
											<p>CART</p>
											{this.state.cartSize > 0 ? <p className='cartSize'>{this.state.cartSize}</p> : null}
										</a>
									</>
								)}
							</div>
							<Cart active={this.state.showCart} close={this.handleCartClose} />
							{this.state.login ? (
								<Login
									close={(toggle) => this.setState({ login: toggle })}
									login={(toggle) => {
										this.handleLoginStatus(toggle);
									}}
									windowOffSet={this.windowOffSet}
								/>
							) : null}
						</div>
					</>
				) : (
					<div className='nav-container'>
						<div className={this.state.searchbtn ? "first-container-none" : "first-container"}>
							<i
								className='fa fa-bars fa-2x'
								onClick={() => {
									this.setState({ showMenu: true });
								}}
								aria-hidden='true'></i>
							<a href='/' className='logo'>
								<img src={logo} alt='Marfit Logo' className='logo-img' />
								<img src={title} alt='Marfit Title' className='logo-title' />
							</a>
						</div>
						<div className={this.state.stags.length>0 && this.state.search.length>0 ? "second-container active" : "second-container"}>
							<div className='input-container'>
								<input
									type='text'
									name='search'
									id='search'
									placeholder='What are you looking for ?'
									onChange={this.handleSearch}
									value={this.state.search}
									onKeyPress={this.handleKeyPress}
									autocomplete="off"
								/>
							</div>
							<button>
								<i className='fa fa-search' onClick={this.handleSearchIt}></i>
							</button>
							{
								this.state.stags.length>0 && this.state.search.length>0
								?
								<div className='suggestions'>
								<div className='suggestions-box'>
									{
										this.state.stags.map(tag=>{
											return (
												<p className='suggest' onClick={()=>{
													this.setState({
														search:tag
													},()=>{
														this.handleSearchIt();
													})
												}}>
												{
													tag
												}
												</p>
											)
										})
									}
								</div>
							</div>
							:
							null
							}
						</div>
						{
								this.state.searchbtn
								?
								<div className={this.state.stags.length>0 && this.state.search.length>0?"searchContainer active":"searchContainer"}>
									<div className='input-container'>
										<input
											type='text'
											name='search'
											id='search'
											placeholder='What are you looking for ?'
											onChange={this.handleSearch}
											value={this.state.search}
											onKeyPress={this.handleKeyPress}
											autoComplete="off"
										/>
									</div>
									<button>
										<i className='fa fa-search' onClick={this.handleSearchIt}></i>
									</button>
									{
										this.state.stags.length>0 && this.state.search.length>0
										?
										<div className='suggestions'>
										<div className='suggestions-box'>
											{
												this.state.stags.map(tag=>{
													return (
														<p className='suggest' onClick={()=>{
															this.setState({
																search:tag
															},()=>{
																this.handleSearchIt();
															})
														}}>
														{
															tag
														}
														</p>
													)
												})
											}
										</div>
									</div>
									:
									null
									}
								</div>
								:
								null
							}
						<div className={this.state.searchbtn ? "third-container-none" : "third-container"}>
							<i
								className='fas fa-times'
								onClick={() => {
									this.setState({ searchbtn: false });
								}}></i>
							<a
								className='search-icon links'
								onClick={() => {
									this.setState({ searchbtn: true });
								}}>
								<i className='fa fa-search'></i>
							</a>

							{this.state.loading ? (
								<Loader />
							) : (
								<>
									{this.state.loginStatus ? (
										<>
											<div className='profile' style={{ cursor: "pointer", userSelect: "none" }}>
												<a className='username'>
													<p>{this.state.currentUser.name}</p>
													<i className='fas fa-chevron-down'></i>
												</a>
												{/* <div className="arrow-up"></div> */}
												<div className='options'>
													<a href='/Dashboard/Profile' className='option-links' style={{ cursor: "pointer", userSelect: "none" }}>
														<i className='fas fa-user'></i>
														<p>Profile</p>
													</a>
													<a href='/Dashboard/Wishlist' className='option-links' style={{ cursor: "pointer", userSelect: "none" }}>
														<i className='fa fa-heart'></i>
														<p>Wishlist</p>
													</a>
													<a href='/Dashboard/Orders' className='option-links' style={{ cursor: "pointer", userSelect: "none" }}>
														<i className='fas fa-shopping-bag'></i>
														<p>Orders</p>
													</a>
													<a className='option-links' onClick={this.handleLogout} style={{ cursor: "pointer", userSelect: "none" }}>
														<i className='fas fa-sign-out-alt'></i>
														<p>Logout</p>
													</a>
												</div>
											</div>
											<a className='profileMobile' href='/Dashboard/Profile'>
												<i className='fas fa-user'></i>
											</a>
										</>
									) : (
										<a style={{ cursor: "pointer", userSelect: "none" }} className='login-signup' onClick={this.handleLogin} id='userLogin'>
											<i className='fas fa-user'></i>
											<p>LOGIN/SIGN UP</p>
										</a>
									)}
									<a style={{ cursor: "pointer", userSelect: "none" }} className='links' onClick={this.handleCart} id='cartId'>
										<i className='fas fa-shopping-cart'></i>
										<p>CART</p>
										{this.state.cartSize > 0 ? <p className='cartSize'>{this.state.cartSize}</p> : null}
									</a>
								</>
							)}
						</div>
						<Cart active={this.state.showCart} close={this.handleCartClose} ref={this.child} handleInit={this.handleInit} />
						{this.state.login ? (
							<Login
								close={(toggle) => this.setState({ login: toggle })}
								login={(toggle) => {
									this.handleLoginStatus(toggle);
								}}
								windowOffSet={this.windowOffSet}
							/>
						) : null}
					</div>
				)}
				<HamburgerMenu
					active={this.state.showMenu}
					cart={this.handleCart}
					logout={this.handleLogout}
					login={this.state.loginStatus}
					close={() => {
						this.setState({ showMenu: false });
					}}
					handleLogin={() => this.setState({ login: true })}
				/>
			</nav>
		);
	}
}
