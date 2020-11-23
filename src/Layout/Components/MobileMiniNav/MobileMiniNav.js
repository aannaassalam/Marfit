import React from "react";
import "./MobileMiniNav.css";
import firebase from "firebase";
import newImage from "../../../assets/new.png";
import saleImage from "../../../assets/sale.png";

export default class MobileMiniNav extends React.Component {
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
			<div className='mobile-mini-container'>
				<a href='/NewArrivals' className='item'>
					<img src={newImage} />
				</a>
				{this.state.categories.map((category) => {
					return (
						<a href={"/Category/" + category.name} className='item'>
							<img src={category.image} />
						</a>
					);
				})}
				<a href='/Sale' className='item'>
					<img src={saleImage} />
				</a>
			</div>
		);
	}
}
