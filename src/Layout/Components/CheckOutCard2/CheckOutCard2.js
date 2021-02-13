import React from "react";
import remove from "./remove.svg";
import truck from "./truck.svg";
import "./CheckOutCard2.css";

const CheckOutCard2 = (props) => {
	console.log(props.product);
	return (
		<div className='prod-card2'>
			<div className='card-content'>
				<div className='left-img'>
					<a href={"/Category/" + props.product.category + "/" + props.product.subCategory + "/" + props.product.id}>
						<img src={props.product.images && props.product.images[0]} alt='prod-img' />
					</a>
				</div>
				<div className='right-details'>
					<div className='item-name'>
						<a href={"/Category/" + props.product.category + "/" + props.product.subCategory + "/" + props.product.id}>
							<p>{props.product.title}</p>
						</a>
					</div>
					<div className='item-price-time'>
						<div className='tenure'>
							<p>&#8377; {props.product.sp}</p>
							<span>
								<span style={{ textDecoration: "line-through", marginRight: "2px" }}>&#8377; {props.product.cp}</span>
								<span style={{ color: "#fb6b25" }}>{100 - Math.round((props.product.sp / props.product.cp) * 100)}% off</span>
							</span>
						</div>
						{props.product.size !== "null" ? (
							<div className='tenure'>
								<p style={{ textTransform: "uppercase" }}>{props.product.size}</p>
								<span>Size</span>
							</div>
						) : null}
						<div className='tenure'>
							<p>{props.product.quantity}</p>
							<span>Quantity</span>
						</div>
					</div>
					<div className='item-delivery'>
						<img src={truck} alt='truck' />
						<p>Delivery Charge :</p>
						<p>{props.product.shippingCharge !== 0 ? "₹ " + props.product.shippingCharge : "Free"}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckOutCard2;
