import React from "react";
import "./MiniNav.css";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import firebase from "firebase";
import Loader from "../Loader/Loader";

export default class MiniNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			loading: true,
		};
	}

	componentDidMount() {
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
			<div className='mini-container'>
				{this.state.loading ? (
					<Loader />
				) : (
					<>
						<a href='/NewArrivals' className='new'>
							New Arrivals
						</a>
						{this.state.categories.map((cat, index) => {
							return (
								<a href={"/Category/" + cat.name} className='mini-content' key={index}>
									{cat.name} <i className='fa fa-chevron-down fa-1x'></i>
									<div className='category-options'>
										{cat.subcategories.map((sub, index) => {
											return (
												<a href={"/Category/" + cat.name + "/" + sub.name} key={index}>
													{sub.name}
												</a>
											);
										})}
									</div>
								</a>
							);
						})}
						<a href='/Sale' className='sale'>
							Sale
						</a>
					</>
				)}
			</div>
		);
	}
}
